import { useMemo, useState } from 'react'
import CalculatorLayout from '../layout/CalculatorLayout'
import ProjectHeader from '../project/ProjectHeader'
import ProjectInfoCard from '../project/ProjectInfoCard'
import CableNameCard from './CableNameCard'
import SupplyCard from './SupplyCard'
import InstallationCard from './InstallationCard'
import LoadCard from './LoadCard'
import RequirementsCard from './RequirementsCard'
import ResultPanel from './ResultPanel'
import { cableTypes } from '../../data/cableTypes'
import { supplySystems } from '../../data/supplySystems'
import { calculateLowVoltageCable } from '../../calculations/lowVoltageCable'
import { resolveDesignCurrent } from '../../calculations/resolveDesignCurrent'
import { resolveProtection } from '../../calculations/resolveProtection'
import { resolveCorrectionFactors } from '../../calculations/resolveCorrectionFactors'
import { resolveCurrentRating } from '../../calculations/resolveCurrentRating'
import { useProject } from '../../hooks/useProject'
import '../../styles/layout.css'
import '../../styles/cards.css'
import '../../styles/forms.css'
import '../../styles/results.css'
import '../../styles/project.css'

export default function LowVoltageCableCalculator({ editingCableId, onEditingDone, onOpenCableList }) {
  const {
    project,
    updateProject,
    updateCalculation,
    updateCalculationGroup,
    saveCable,
    updateSavedCable,
  } = useProject()
  const [showProjectInfo, setShowProjectInfo] = useState(false)

  const calculation = project.calculations.find((item) => item.type === 'lowVoltageCable')

  const supplySystem = supplySystems.find((item) => item.id === calculation.supply.supplySystemId)
  const cableType = cableTypes.find((item) => item.id === calculation.installation.cableTypeId)
  const cableSize = cableType.sizes.find((item) => item.area === Number(calculation.installation.area))

  const designCurrentResult = resolveDesignCurrent({
    supply: calculation.supply,
    load: calculation.load,
    supplySystem,
  })

  const designCurrent = designCurrentResult.value

  const protectionResult = resolveProtection({
    supply: calculation.supply,
    load: calculation.load,
    designCurrent,
  })

  const cableDesignCurrent = protectionResult.selected ?? designCurrent
  const correctionFactors = resolveCorrectionFactors(calculation.installation)

  const currentRating = resolveCurrentRating({
    cableType,
    cableSize,
    installation: calculation.installation,
  })

  const calculationCableSize = {
    ...cableSize,
    currentCapacity: currentRating.baseCurrentCapacity ?? 0,
  }

  const result = useMemo(() => {
    if (
      !supplySystem ||
      !cableType ||
      !cableSize ||
      !cableDesignCurrent ||
      !currentRating.baseCurrentCapacity
    ) {
      return null
    }

    return calculateLowVoltageCable({
      supplySystem,
      cableType,
      cableSize: calculationCableSize,
      loadCurrent: cableDesignCurrent,
      length: Number(calculation.installation.length),
      cosPhi: Number(calculation.load.cosPhi),
      maxVoltageDropPercent: calculation.requirements.maxVoltageDropPercent,
      parallelCables: Number(calculation.installation.parallelCables),
      correctionFactor: correctionFactors.totalFactor,
      shortCircuitCurrent: calculation.requirements.shortCircuitCurrent,
      disconnectionTime: Number(calculation.requirements.disconnectionTime),
    })
  }, [
    supplySystem,
    cableType,
    cableSize,
    cableDesignCurrent,
    currentRating.baseCurrentCapacity,
    calculationCableSize,
    calculation,
    correctionFactors.totalFactor,
  ])

  function handleCableTypeChange(cableTypeId) {
    const nextCable = cableTypes.find((item) => item.id === cableTypeId)

    updateCalculationGroup(calculation.id, 'installation', {
      cableTypeId,
      area: nextCable.sizes[0].area,
    })
  }

  function getCableDescription() {
    const parallelCount = Number(calculation.installation.parallelCables)
    const sizeText = cableSize?.designation ?? `${cableSize?.area ?? ''} mm²`
    const cableName = cableType?.name ?? 'Ikke valgt'

    return parallelCount > 1
      ? `${parallelCount}× ${cableName} ${sizeText}`
      : `${cableName} ${sizeText}`
  }

  function handleSaveCable() {
    if (!result || !calculation.title.trim()) return

    const savedCable = {
      id: editingCableId ?? crypto.randomUUID(),
      name: calculation.title.trim(),
      cable: getCableDescription(),
      savedAt: new Date().toLocaleDateString('no-NO'),
      currentOk: result.currentOk,
      voltageDropOk: result.voltageDropOk,
      shortCircuitOk: result.shortCircuitOk,
      result,
      correctionFactors,
      currentRating,
      cableDesignCurrent,
      calculation: structuredClone(calculation),
    }

    if (editingCableId) {
      updateSavedCable(editingCableId, savedCable)
      onEditingDone()
      return
    }

    saveCable(savedCable)
  }

  const canSaveCable = Boolean(result && calculation.title.trim())

  return (
    <>
      <ProjectHeader
        project={project}
        onEditProject={() => setShowProjectInfo((current) => !current)}
      />

      {showProjectInfo && (
        <div className="project-info-inline">
          <ProjectInfoCard project={project} onChange={updateProject} defaultOpen />
        </div>
      )}

      <section className="module-heading compact module-heading-row">
        <div>
          <p className="eyebrow">Lavspent kabel</p>
          <h2>Kabelberegning</h2>
        </div>

        <div className="module-actions">
          <button type="button" className="secondary-action" onClick={onOpenCableList}>
            Kabelliste ({project.savedCables?.length ?? 0})
          </button>

          <button
            type="button"
            className="primary-action"
            onClick={handleSaveCable}
            disabled={!canSaveCable}
            title={!calculation.title.trim() ? 'Gi kabelen et navn før den lagres' : undefined}
          >
            {editingCableId ? 'Oppdater kabel' : 'Lagre kabel'}
          </button>
        </div>
      </section>

      <CalculatorLayout
        left={
          <>
            <CableNameCard
              title={calculation.title}
              onChange={(title) => updateCalculation(calculation.id, { title })}
            />

            <div className="top-input-grid">
              <SupplyCard
                supply={calculation.supply}
                supplySystems={supplySystems}
                onChange={(values) => updateCalculationGroup(calculation.id, 'supply', values)}
              />

              <RequirementsCard
                requirements={calculation.requirements}
                onChange={(values) => updateCalculationGroup(calculation.id, 'requirements', values)}
              />
            </div>

            <LoadCard
              load={calculation.load}
              onChange={(values) => updateCalculationGroup(calculation.id, 'load', values)}
            />

            <InstallationCard
              installation={calculation.installation}
              cableTypes={cableTypes}
              selectedCableType={cableType}
              onChange={(values) => updateCalculationGroup(calculation.id, 'installation', values)}
              onCableTypeChange={handleCableTypeChange}
            />
          </>
        }
        right={
          <ResultPanel
            designCurrent={designCurrent}
            designCurrentSource={designCurrentResult.source}
            cableDesignCurrent={cableDesignCurrent}
            protectionResult={protectionResult}
            supplySystem={supplySystem}
            cableType={cableType}
            cableSize={cableSize}
            parallelCables={Number(calculation.installation.parallelCables)}
            correctionFactors={correctionFactors}
            currentRating={currentRating}
            result={result}
          />
        }
      />
    </>
  )
}
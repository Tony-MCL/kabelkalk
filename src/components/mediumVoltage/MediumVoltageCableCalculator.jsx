import { useMemo } from 'react'
import CalculatorLayout from '../layout/CalculatorLayout'
import ProjectHeader from '../project/ProjectHeader'
import SectionCard from '../cards/SectionCard'
import { mediumVoltageAreas } from '../../data/mediumVoltageCurrentRatings'
import { calculateMediumVoltageCable } from '../../calculations/mediumVoltageCable'
import { useProject } from '../../hooks/useProject'
import '../../styles/layout.css'
import '../../styles/cards.css'
import '../../styles/forms.css'
import '../../styles/results.css'
import '../../styles/project.css'

function StatusValue({ label, value, ok }) {
  const className = ok === null || ok === undefined ? '' : ok ? 'status-ok' : 'status-fail'

  return (
    <div className="result-row">
      <span>{label}</span>
      <strong className={className}>{value}</strong>
    </div>
  )
}

export default function MediumVoltageCableCalculator() {
  const { project, updateCalculation, updateCalculationGroup } = useProject()
  const calculation = project.calculations.find((item) => item.type === 'mediumVoltageCable')

  const result = useMemo(() => {
    if (!calculation) return null

    return calculateMediumVoltageCable({
      area: calculation.installation.area,
      loadCurrent: calculation.load.loadCurrent,
      parallelCircuits: calculation.installation.parallelCircuits,
      environment: calculation.installation.environment,
      layout: calculation.installation.layout,
      screenBonding: calculation.installation.screenBonding,
      correctionFactor: calculation.installation.correctionFactor,
      shortCircuitCurrent: calculation.requirements.shortCircuitCurrent,
      disconnectionTime: calculation.requirements.disconnectionTime,
    })
  }, [calculation])

  if (!calculation) return null

  return (
    <>
      <ProjectHeader project={project} />

      <section className="module-heading compact module-heading-row">
        <div>
          <p className="eyebrow">Mellomspenningskabel</p>
          <h2>Kabelberegning</h2>
        </div>
      </section>

      <CalculatorLayout
        left={
          <>
            <SectionCard title="Kabel" subtitle="Enleder aluminium, PEX 90 °C">
              <div className="form-grid">
                <label className="form-field">
                  <span>Navn</span>
                  <input
                    value={calculation.title}
                    onChange={(event) => updateCalculation(calculation.id, { title: event.target.value })}
                  />
                </label>

                <label className="form-field">
                  <span>Driftsspenning</span>
                  <select
                    value={calculation.supply.voltageKv}
                    onChange={(event) => updateCalculationGroup(calculation.id, 'supply', { voltageKv: Number(event.target.value) })}
                  >
                    <option value={6}>6 kV</option>
                    <option value={10}>10 kV</option>
                    <option value={11}>11 kV</option>
                    <option value={12}>12 kV</option>
                    <option value={22}>22 kV</option>
                    <option value={24}>24 kV</option>
                    <option value={33}>33 kV</option>
                    <option value={36}>36 kV</option>
                  </select>
                </label>

                <label className="form-field">
                  <span>Belastningsstrøm</span>
                  <input
                    type="number"
                    min="0"
                    value={calculation.load.loadCurrent}
                    onChange={(event) => updateCalculationGroup(calculation.id, 'load', { loadCurrent: event.target.value })}
                  />
                  <small>A</small>
                </label>

                <label className="form-field">
                  <span>Tverrsnitt</span>
                  <select
                    value={calculation.installation.area}
                    onChange={(event) => updateCalculationGroup(calculation.id, 'installation', { area: Number(event.target.value) })}
                  >
                    {mediumVoltageAreas.map((area) => (
                      <option key={area} value={area}>{area} mm²</option>
                    ))}
                  </select>
                </label>
              </div>
            </SectionCard>

            <SectionCard title="Forlegning" subtitle="Tre enlederkabler i trefasesett">
              <div className="installation-grid">
                <label className="form-field">
                  <span>Miljø</span>
                  <select
                    value={calculation.installation.environment}
                    onChange={(event) => updateCalculationGroup(calculation.id, 'installation', { environment: event.target.value })}
                  >
                    <option value="ground">Jord</option>
                    <option value="air">Luft</option>
                  </select>
                </label>

                <label className="form-field">
                  <span>Forlegning</span>
                  <select
                    value={calculation.installation.layout}
                    onChange={(event) => updateCalculationGroup(calculation.id, 'installation', { layout: event.target.value })}
                  >
                    <option value="flat">Flat</option>
                    <option value="trefoil">Trekant</option>
                  </select>
                </label>

                <label className="form-field">
                  <span>Skjerm</span>
                  <select
                    value={calculation.installation.screenBonding}
                    onChange={(event) => updateCalculationGroup(calculation.id, 'installation', { screenBonding: event.target.value })}
                  >
                    <option value="open">Åpen skjerm</option>
                    <option value="closed">Lukket skjerm</option>
                  </select>
                </label>

                <label className="form-field">
                  <span>Parallelle kabelsett</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={calculation.installation.parallelCircuits}
                    onChange={(event) => updateCalculationGroup(calculation.id, 'installation', { parallelCircuits: event.target.value })}
                  />
                </label>

                <label className="form-field">
                  <span>Samlet korreksjonsfaktor</span>
                  <input
                    type="number"
                    min="0.01"
                    max="2"
                    step="0.01"
                    value={calculation.installation.correctionFactor}
                    onChange={(event) => updateCalculationGroup(calculation.id, 'installation', { correctionFactor: event.target.value })}
                  />
                  <small>Foreløpig manuelt felt. NEN-faktorene kobles inn som neste steg.</small>
                </label>
              </div>
            </SectionCard>

            <SectionCard title="Kortslutning" subtitle="Aluminium / PEX, 90 → 250 °C">
              <div className="form-grid">
                <label className="form-field">
                  <span>Krav til kortslutningsstrøm</span>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={calculation.requirements.shortCircuitCurrent}
                    onChange={(event) => updateCalculationGroup(calculation.id, 'requirements', { shortCircuitCurrent: event.target.value })}
                  />
                  <small>kA – valgfritt</small>
                </label>

                <label className="form-field">
                  <span>Utkoblingstid</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={calculation.requirements.disconnectionTime}
                    onChange={(event) => updateCalculationGroup(calculation.id, 'requirements', { disconnectionTime: event.target.value })}
                  />
                  <small>s</small>
                </label>
              </div>
            </SectionCard>
          </>
        }
        right={
          <SectionCard title="Resultat" subtitle="Arbeidsversjon – strømføring og kortslutning">
            {result ? (
              <div className="result-list">
                <StatusValue label="Tabellverdi" value={`${result.baseCurrentCapacity.toFixed(0)} A`} />
                <StatusValue label="Korrigert belastningsevne" value={`${result.currentCapacity.toFixed(0)} A`} ok={result.currentOk} />
                <StatusValue label="Strømmargin" value={`${result.currentMargin.toFixed(0)} A`} ok={result.currentOk} />
                <StatusValue label="Kortslutningsytelse" value={`${result.shortCircuitCapacityKA.toFixed(1)} kA`} ok={result.shortCircuitOk} />
                <StatusValue label="Spenningsfall" value="Avventer R/X-datasett" />
              </div>
            ) : (
              <p>Velg gyldige beregningsdata.</p>
            )}
          </SectionCard>
        }
      />
    </>
  )
}

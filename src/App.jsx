import { useState } from 'react'
import LowVoltageCableCalculator from './components/lowVoltage/LowVoltageCableCalculator'
import AppShell from './components/layout/AppShell'
import ProjectCableListPage from './components/project/ProjectCableListPage'
import ProjectFileActions from './components/project/ProjectFileActions'
import ProjectInfoCard from './components/project/ProjectInfoCard'
import { useProject } from './hooks/useProject'
import './App.css'
import './styles/appshell.css'

function App() {
  const [activeModule, setActiveModule] = useState(null)
  const [activePage, setActivePage] = useState('calculator')
  const [editingCableId, setEditingCableId] = useState(null)
  const [calculatorToolbarActions, setCalculatorToolbarActions] = useState(null)

  const {
    project,
    updateProject,
    newProject,
    openProject,
    deleteSavedCable,
    replaceCalculation,
  } = useProject()

  function openCableForEdit(savedCable) {
    const calculation = project.calculations.find((item) => item.type === 'lowVoltageCable')
    if (!calculation) return

    replaceCalculation(calculation.id, structuredClone(savedCable.calculation))
    setEditingCableId(savedCable.id)
    setActivePage('calculator')
  }

  function copyCable(savedCable) {
    const calculation = project.calculations.find((item) => item.type === 'lowVoltageCable')
    if (!calculation) return

    const copiedCalculation = structuredClone(savedCable.calculation)
    copiedCalculation.id = calculation.id
    copiedCalculation.title = `${savedCable.name} - kopi`

    replaceCalculation(calculation.id, copiedCalculation)
    setEditingCableId(null)
    setActivePage('calculator')
  }

  function handleNewProject() {
    newProject()
    setEditingCableId(null)
    setActivePage('calculator')
    setActiveModule(null)
  }

  function handleOpenProject(nextProject) {
    openProject(nextProject)
    setEditingCableId(null)
    setActivePage('calculator')
    setActiveModule(null)
  }

  const projectFileActions = (
    <ProjectFileActions
      project={project}
      onNewProject={handleNewProject}
      onOpenProject={handleOpenProject}
    />
  )

  if (activeModule === 'lowVoltageCable') {
    const isCableList = activePage === 'cableList'

    return (
      <AppShell
        toolbarLeft={
          isCableList ? (
            <button type="button" className="back-button" onClick={() => setActivePage('calculator')}>
              ← Tilbake til kalkulator
            </button>
          ) : (
            <button type="button" className="back-button" onClick={() => setActiveModule(null)}>
              ← Tilbake til prosjekt
            </button>
          )
        }
        toolbarRight={
          isCableList ? (
            <button type="button" className="secondary-action" onClick={() => window.print()}>
              Eksporter PDF
            </button>
          ) : (
            calculatorToolbarActions
          )
        }
      >
        {isCableList ? (
          <ProjectCableListPage
            project={project}
            onDelete={deleteSavedCable}
            onEdit={openCableForEdit}
            onCopy={copyCable}
          />
        ) : (
          <LowVoltageCableCalculator
            editingCableId={editingCableId}
            onEditingDone={() => setEditingCableId(null)}
            onOpenCableList={() => setActivePage('cableList')}
            onToolbarActionsChange={setCalculatorToolbarActions}
          />
        )}
      </AppShell>
    )
  }

  return (
    <AppShell toolbarRight={projectFileActions}>
      <section className="home-intro">
        <p className="lead">
          Prosjektgrunnlag, beregninger og beregningsrapporter samlet i ett verktøy.
        </p>
      </section>

      <div className="home-project-info">
        <ProjectInfoCard project={project} onChange={updateProject} />
      </div>

      <section className="module-heading home-module-heading">
        <p className="eyebrow">Verktøy</p>
        <h2>Velg prosjekteringsverktøy</h2>
      </section>

      <section className="module-grid">
        <button type="button" className="module-card" onClick={() => setActiveModule('lowVoltageCable')}>
          <h2>Kabelberegning</h2>
          <p>Lavspent kabel for kraftverk, industri, tavler, installasjon og fordelinger.</p>
          <span>Start beregning →</span>
        </button>

        <button type="button" className="module-card muted" disabled>
          <h2>Høyspent kabel</h2>
          <p>Egen beregningsmodul for høyspentkabel.</p>
          <span>Kommer senere</span>
        </button>

        <button type="button" className="module-card muted" disabled>
          <h2>Luftlinje</h2>
          <p>Forberedt for lavspent og høyspent luftlinje.</p>
          <span>Kommer senere</span>
        </button>
      </section>
    </AppShell>
  )
}

export default App
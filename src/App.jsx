import { useState } from 'react'
import LowVoltageCableCalculator from './components/lowVoltage/LowVoltageCableCalculator'
import ProjectCableListPage from './components/project/ProjectCableListPage'
import { useProject } from './hooks/useProject'
import './App.css'

function App() {
  const [activeModule, setActiveModule] = useState(null)
  const [activePage, setActivePage] = useState('calculator')
  const { project, deleteSavedCable } = useProject()

  if (activeModule === 'lowVoltageCable') {
    return (
      <main className="app-shell">
        <div className="top-bar">
          <button type="button" className="back-button" onClick={() => setActiveModule(null)}>
            ← Tilbake
          </button>
          <button type="button" className="settings-button">
            ⚙ Innstillinger
          </button>
        </div>

        {activePage === 'cableList' ? (
          <ProjectCableListPage
            project={project}
            onBack={() => setActivePage('calculator')}
            onDelete={deleteSavedCable}
          />
        ) : (
          <LowVoltageCableCalculator onOpenCableList={() => setActivePage('cableList')} />
        )}
      </main>
    )
  }

  return (
    <main className="app-shell">
      <section className="hero-section">
        <div>
          <p className="eyebrow">Prosjekteringsgrunnlag</p>
          <h1>KabelKalk</h1>
          <p className="lead">
            Kabel- og lederberegning for strømføringsevne, spenningsfall og kortslutningskapasitet.
          </p>
        </div>

        <button type="button" className="settings-button">
          ⚙ Innstillinger
        </button>
      </section>

      <section className="module-grid">
        <button type="button" className="module-card" onClick={() => setActiveModule('lowVoltageCable')}>
          <h2>Lavspent kabel</h2>
          <p>For kraftverk, industri, tavler, installasjon og fordelinger.</p>
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
    </main>
  )
}

export default App
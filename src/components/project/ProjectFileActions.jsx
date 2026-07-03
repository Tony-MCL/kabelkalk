import { useRef, useState } from 'react'
import { downloadProjectFile, readProjectFile } from '../../services/projectFileService'

export default function ProjectFileActions({ project, onNewProject, onOpenProject }) {
  const fileInputRef = useRef(null)
  const [errorMessage, setErrorMessage] = useState('')

  function handleNewProject() {
    if (!window.confirm('Opprette nytt prosjekt? Ulagrede endringer i nåværende prosjekt kan gå tapt.')) {
      return
    }

    setErrorMessage('')
    onNewProject()
  }

  function handleSaveProject() {
    setErrorMessage('')
    downloadProjectFile(project)
  }

  function handleOpenClick() {
    setErrorMessage('')
    fileInputRef.current?.click()
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    try {
      const nextProject = await readProjectFile(file)
      onOpenProject(nextProject)
    } catch (error) {
      setErrorMessage(error.message || 'Kunne ikke åpne prosjektfilen.')
    }
  }

  return (
    <div className="project-file-actions">
      <div className="project-file-buttons">
        <button type="button" className="secondary-action" onClick={handleNewProject}>
          Nytt prosjekt
        </button>

        <button type="button" className="secondary-action" onClick={handleOpenClick}>
          Åpne prosjekt
        </button>

        <button type="button" className="secondary-action" onClick={handleSaveProject}>
          Lagre prosjekt
        </button>
      </div>

      <input
        ref={fileInputRef}
        className="hidden-file-input"
        type="file"
        accept=".manageproject,application/json"
        onChange={handleFileChange}
      />

      {errorMessage && <p className="project-file-error">{errorMessage}</p>}
    </div>
  )
}
import { useContext } from 'react'
import { ProjectContext } from '../context/ProjectContext'

export function useProject() {
  const context = useContext(ProjectContext)

  if (!context) {
    throw new Error('useProject må brukes inni ProjectProvider')
  }

  return context
}
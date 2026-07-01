import { createContext, useMemo, useState } from 'react'
import { createEmptyProject } from '../data/emptyProject'
import { updateProject as applyProjectUpdate } from '../models/Project'

export const ProjectContext = createContext(null)

export function ProjectProvider({ children }) {
  const [project, setProject] = useState(() => createEmptyProject())

  function updateProject(values) {
    setProject((current) => applyProjectUpdate(current, values))
  }

  function updateCalculation(calculationId, values) {
    setProject((current) => ({
      ...current,
      updatedAt: new Date().toISOString(),
      calculations: current.calculations.map((calculation) =>
        calculation.id === calculationId ? { ...calculation, ...values } : calculation
      ),
    }))
  }

  function updateCalculationGroup(calculationId, group, values) {
    setProject((current) => ({
      ...current,
      updatedAt: new Date().toISOString(),
      calculations: current.calculations.map((calculation) =>
        calculation.id === calculationId
          ? {
              ...calculation,
              [group]: {
                ...calculation[group],
                ...values,
              },
            }
          : calculation
      ),
    }))
  }

  function saveCable(savedCable) {
    setProject((current) => ({
      ...current,
      updatedAt: new Date().toISOString(),
      savedCables: [savedCable, ...(current.savedCables ?? [])],
    }))
  }

  function deleteSavedCable(savedCableId) {
    setProject((current) => ({
      ...current,
      updatedAt: new Date().toISOString(),
      savedCables: (current.savedCables ?? []).filter((item) => item.id !== savedCableId),
    }))
  }

  const value = useMemo(
    () => ({
      project,
      updateProject,
      updateCalculation,
      updateCalculationGroup,
      saveCable,
      deleteSavedCable,
    }),
    [project]
  )

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}
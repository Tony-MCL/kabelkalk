import { createContext, useEffect, useMemo, useState } from 'react'
import { createEmptyProject } from '../data/emptyProject'
import { createMediumVoltageCableCalculation } from '../models/Calculation'
import { updateProject as applyProjectUpdate } from '../models/Project'

const PROJECT_STORAGE_KEY = 'manage-tools.active-project.v1'

export const ProjectContext = createContext(null)

function normalizeProject(project) {
  const emptyProject = createEmptyProject()
  const calculations = Array.isArray(project?.calculations)
    ? [...project.calculations]
    : [...emptyProject.calculations]

  if (!calculations.some((item) => item.type === 'mediumVoltageCable')) {
    calculations.push(createMediumVoltageCableCalculation())
  }

  return {
    ...emptyProject,
    ...project,
    calculations,
    savedCables: Array.isArray(project?.savedCables) ? project.savedCables : [],
  }
}

function loadStoredProject() {
  if (typeof window === 'undefined') {
    return createEmptyProject()
  }

  try {
    const storedValue = window.localStorage.getItem(PROJECT_STORAGE_KEY)

    if (!storedValue) {
      return createEmptyProject()
    }

    const storedProject = JSON.parse(storedValue)

    if (!storedProject || typeof storedProject !== 'object') {
      return createEmptyProject()
    }

    return normalizeProject(storedProject)
  } catch (error) {
    console.warn('Kunne ikke lese lagret Manage Tools-prosjekt.', error)
    return createEmptyProject()
  }
}

export function ProjectProvider({ children }) {
  const [project, setProject] = useState(loadStoredProject)

  useEffect(() => {
    try {
      window.localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(project))
    } catch (error) {
      console.warn('Kunne ikke lagre Manage Tools-prosjekt i nettleseren.', error)
    }
  }, [project])

  function newProject() {
    setProject(createEmptyProject())
  }

  function openProject(nextProject) {
    setProject({
      ...normalizeProject(nextProject),
      updatedAt: new Date().toISOString(),
    })
  }

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
          ? { ...calculation, [group]: { ...calculation[group], ...values } }
          : calculation
      ),
    }))
  }

  function replaceCalculation(calculationId, nextCalculation) {
    setProject((current) => ({
      ...current,
      updatedAt: new Date().toISOString(),
      calculations: current.calculations.map((calculation) =>
        calculation.id === calculationId ? nextCalculation : calculation
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

  function updateSavedCable(savedCableId, savedCable) {
    setProject((current) => ({
      ...current,
      updatedAt: new Date().toISOString(),
      savedCables: (current.savedCables ?? []).map((item) =>
        item.id === savedCableId ? savedCable : item
      ),
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
      newProject,
      openProject,
      updateProject,
      updateCalculation,
      updateCalculationGroup,
      replaceCalculation,
      saveCable,
      updateSavedCable,
      deleteSavedCable,
    }),
    [project]
  )

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}

const PROJECT_FILE_VERSION = 1
const PROJECT_FILE_EXTENSION = 'manageproject'

export function createProjectFilePayload(project) {
  return {
    fileType: 'manage-tools-project',
    version: PROJECT_FILE_VERSION,
    exportedAt: new Date().toISOString(),
    project: {
      ...project,
      updatedAt: new Date().toISOString(),
    },
  }
}

export function downloadProjectFile(project) {
  const payload = createProjectFilePayload(project)
  const fileName = getProjectFileName(project)

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()

  URL.revokeObjectURL(url)
}

export function readProjectFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Ingen prosjektfil valgt.'))
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        const project = normalizeProjectFile(parsed)
        resolve(project)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error('Kunne ikke lese prosjektfilen.'))
    }

    reader.readAsText(file)
  })
}

function normalizeProjectFile(parsed) {
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Ugyldig prosjektfil.')
  }

  if (parsed.fileType !== 'manage-tools-project') {
    throw new Error('Dette ser ikke ut som en Manage Tools-prosjektfil.')
  }

  if (!parsed.project || typeof parsed.project !== 'object') {
    throw new Error('Prosjektfilen mangler prosjektdata.')
  }

  return {
    ...parsed.project,
    updatedAt: new Date().toISOString(),
  }
}

function getProjectFileName(project) {
  const rawName = project?.name?.trim() || 'manage-tools-prosjekt'
  const safeName = rawName
    .toLowerCase()
    .replaceAll('æ', 'ae')
    .replaceAll('ø', 'o')
    .replaceAll('å', 'a')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${safeName || 'manage-tools-prosjekt'}.${PROJECT_FILE_EXTENSION}`
}
export function createProject(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    name: 'Nytt kabelprosjekt',
    customer: '',
    facility: '',
    description: '',
    company: '',
    logoDataUrl: '',
    calculations: [],
    savedCables: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

export function updateProject(project, values) {
  return {
    ...project,
    ...values,
    updatedAt: new Date().toISOString(),
  }
}
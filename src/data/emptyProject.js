import { createProject } from '../models/Project'
import { createLowVoltageCableCalculation } from '../models/Calculation'

export function createEmptyProject() {
  return createProject({
    calculations: [
      createLowVoltageCableCalculation(),
    ],
  })
}
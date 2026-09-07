import { createProject } from '../models/Project'
import {
  createLowVoltageCableCalculation,
  createMediumVoltageCableCalculation,
} from '../models/Calculation'

export function createEmptyProject() {
  return createProject({
    calculations: [
      createLowVoltageCableCalculation(),
      createMediumVoltageCableCalculation(),
    ],
  })
}

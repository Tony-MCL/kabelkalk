export const mvBurialDepthFactors = [
  { min: 0.50, max: 0.70, factor: 1.00 },
  { min: 0.71, max: 0.90, factor: 0.99 },
  { min: 0.91, max: 1.10, factor: 0.98 },
  { min: 1.11, max: 1.30, factor: 0.96 },
  { min: 1.31, max: 1.50, factor: 0.95 },
]

export const mvSoilTemperatureFactors90C = {
  '-5': 1.13,
  '0': 1.10,
  '5': 1.06,
  '10': 1.03,
  '15': 1.00,
  '20': 0.96,
  '25': 0.93,
  '30': 0.89,
}

export const mvAirTemperatureFactors90C = {
  '10': 1.12,
  '15': 1.08,
  '20': 1.04,
  '25': 1.00,
  '30': 0.95,
  '35': 0.90,
  '40': 0.85,
  '45': 0.80,
}

const soilResistivityValues = [70, 100, 120, 150, 200, 250, 300]

export const mvSoilResistivityFactors14_24kV = {
  25: [1.08, 1.00, 0.96, 0.90, 0.81, 0.75, 0.70],
  '35-95': [1.10, 1.00, 0.95, 0.89, 0.79, 0.73, 0.67],
  '120-500': [1.11, 1.00, 0.94, 0.88, 0.78, 0.72, 0.66],
}

export function getMvSoilResistivityFactor(area, resistivity) {
  const numericArea = Number(area)
  const numericResistivity = Number(resistivity)
  const index = soilResistivityValues.indexOf(numericResistivity)

  if (index < 0) {
    return { factor: null, supported: false, reason: 'unsupported-resistivity' }
  }

  let key = null
  if (numericArea === 25) key = 25
  else if (numericArea >= 35 && numericArea <= 95) key = '35-95'
  else if (numericArea >= 120 && numericArea <= 500) key = '120-500'

  if (!key) {
    if (numericResistivity === 100) {
      return { factor: 1, supported: true, reason: 'reference-condition' }
    }

    return { factor: null, supported: false, reason: 'unsupported-area' }
  }

  return {
    factor: mvSoilResistivityFactors14_24kV[key][index],
    supported: true,
    reason: null,
  }
}

export const mvGroundTrefoilGroupingFactors = {
  tight: { 1: 1.00, 2: 0.79, 3: 0.69, 4: 0.63, 5: 0.58, 6: 0.55, 8: 0.50, 10: 0.46 },
  '70mm': { 1: 1.00, 2: 0.85, 3: 0.75, 4: 0.68, 5: 0.64, 6: 0.60, 8: 0.56, 10: 0.53 },
  '250mm': { 1: 1.00, 2: 0.87, 3: 0.79, 4: 0.75, 5: 0.72, 6: 0.69, 8: 0.66, 10: 0.64 },
}

export const mvGroundFlatGroupingFactors70mm = {
  1: 1.00,
  2: 0.85,
  3: 0.75,
  4: 0.68,
  5: 0.64,
  6: 0.60,
  8: 0.56,
  10: 0.53,
}

export const mvSupportedGroupCounts = [1, 2, 3, 4, 5, 6, 8, 10]
export const mvSupportedSoilTemperatures = [-5, 0, 5, 10, 15, 20, 25, 30]
export const mvSupportedAirTemperatures = [10, 15, 20, 25, 30, 35, 40, 45]
export const mvSupportedSoilResistivities = soilResistivityValues

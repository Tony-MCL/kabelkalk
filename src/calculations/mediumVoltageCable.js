import { mediumVoltageCurrentRatings } from '../data/mediumVoltageCurrentRatings'

export function resolveMediumVoltageCurrentRating({ area, environment, layout, screenBonding }) {
  const row = mediumVoltageCurrentRatings.find((item) => item.area === Number(area))
  if (!row) return null

  return row?.[environment]?.[layout]?.[screenBonding] ?? null
}

export function calculateMediumVoltageCable(input) {
  const {
    area,
    loadCurrent,
    parallelCircuits,
    environment,
    layout,
    screenBonding,
    correctionFactor = 1,
    shortCircuitCurrent,
    disconnectionTime,
  } = input

  const baseCurrentCapacity = resolveMediumVoltageCurrentRating({
    area,
    environment,
    layout,
    screenBonding,
  })

  if (!baseCurrentCapacity) return null

  const parallelCount = Math.max(1, Number(parallelCircuits) || 1)
  const factor = Number(correctionFactor) || 1
  const designCurrent = Number(loadCurrent) || 0
  const currentCapacity = baseCurrentCapacity * factor * parallelCount

  // Al / PEX, 90 °C kontinuerlig og 250 °C ved kortslutning.
  const k = 94
  const shortCircuitTime = Math.max(0.01, Number(disconnectionTime) || 1)
  const shortCircuitCapacityKA = (k * Number(area) * parallelCount) / Math.sqrt(shortCircuitTime) / 1000
  const shortCircuitRequirement =
    shortCircuitCurrent === '' || shortCircuitCurrent === null || shortCircuitCurrent === undefined
      ? null
      : Number(shortCircuitCurrent)

  return {
    baseCurrentCapacity,
    correctionFactor: factor,
    currentCapacity,
    currentMargin: currentCapacity - designCurrent,
    currentOk: currentCapacity >= designCurrent,
    shortCircuitCapacityKA,
    shortCircuitRequirement,
    shortCircuitOk:
      shortCircuitRequirement === null ? null : shortCircuitCapacityKA >= shortCircuitRequirement,
  }
}

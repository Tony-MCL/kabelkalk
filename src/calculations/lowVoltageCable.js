export function calculateLowVoltageCable(input) {
  const {
    supplySystem,
    cableType,
    cableSize,
    loadCurrent,
    length,
    cosPhi,
    maxVoltageDropPercent,
    parallelCables,
    correctionFactor,
    shortCircuitCurrent,
    disconnectionTime,
  } = input

  const voltageDropLimit =
    maxVoltageDropPercent === '' || maxVoltageDropPercent === null || maxVoltageDropPercent === undefined
      ? null
      : Number(maxVoltageDropPercent)

  const shortCircuitRequirement =
    shortCircuitCurrent === '' || shortCircuitCurrent === null || shortCircuitCurrent === undefined
      ? null
      : Number(shortCircuitCurrent)

  const currentCapacity = cableSize.currentCapacity * correctionFactor * parallelCables
  const currentMargin = currentCapacity - loadCurrent

  const sinPhi = Math.sqrt(Math.max(0, 1 - cosPhi * cosPhi))
  const resistance = cableSize.resistance / parallelCables
  const reactance = cableSize.reactance / parallelCables

  const voltageDrop =
    Math.sqrt(3) *
    loadCurrent *
    length *
    (resistance * cosPhi + reactance * sinPhi) /
    1000

  const voltageDropPercent = (voltageDrop / supplySystem.voltage) * 100

  const k = cableType.conductorMaterial === 'cu' ? 143 : 94
  const shortCircuitCapacity = (k * cableSize.area * parallelCables) / Math.sqrt(disconnectionTime)
  const shortCircuitCapacityKA = shortCircuitCapacity / 1000

  return {
    currentCapacity,
    currentMargin,
    currentOk: currentCapacity >= loadCurrent,

    voltageDrop,
    voltageDropPercent,
    voltageDropLimit,
    voltageDropOk:
      voltageDropLimit === null ? null : voltageDropPercent <= voltageDropLimit,

    shortCircuitCapacityKA,
    shortCircuitRequirement,
    shortCircuitOk:
      shortCircuitRequirement === null ? null : shortCircuitCapacityKA >= shortCircuitRequirement,
  }
}
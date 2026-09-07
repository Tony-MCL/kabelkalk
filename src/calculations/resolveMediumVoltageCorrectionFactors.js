import {
  getMvSoilResistivityFactor,
  mvAirTemperatureFactors90C,
  mvBurialDepthFactors,
  mvGroundFlatGroupingFactors70mm,
  mvGroundTrefoilGroupingFactors,
  mvSoilTemperatureFactors90C,
} from '../data/mediumVoltageCorrectionFactors'

function resolveBurialDepthFactor(depth) {
  const numericDepth = Number(depth)
  const row = mvBurialDepthFactors.find(
    (item) => numericDepth >= item.min && numericDepth <= item.max
  )

  return row?.factor ?? null
}

function resolveGroundGroupingFactor(layout, groupCount, spacing) {
  const count = Number(groupCount) || 1

  if (layout === 'flat') {
    return mvGroundFlatGroupingFactors70mm[count] ?? null
  }

  return mvGroundTrefoilGroupingFactors[spacing]?.[count] ?? null
}

export function resolveMediumVoltageCorrectionFactors({ area, installation }) {
  if (installation.environment === 'air') {
    const airTemperatureFactor =
      mvAirTemperatureFactors90C[String(installation.ambientTemperature)] ?? null
    const parallelCount = Number(installation.parallelCircuits) || 1
    const groupingSupported = parallelCount === 1
    const warnings = []

    if (airTemperatureFactor === null) {
      warnings.push('Valgt lufttemperatur finnes ikke i NEN 62.75-tabellen for 90 °C ledertemperatur.')
    }
    if (!groupingSupported) {
      warnings.push('Korreksjon for flere kabelsett i luft er ikke koblet inn ennå. Velg ett kabelsett for en komplett beregning.')
    }

    const supported = airTemperatureFactor !== null && groupingSupported

    return {
      environment: 'air',
      airTemperatureFactor,
      burialDepthFactor: 1,
      soilTemperatureFactor: 1,
      soilResistivityFactor: 1,
      groupingFactor: groupingSupported ? 1 : null,
      totalFactor: supported ? airTemperatureFactor : null,
      supported,
      warnings,
    }
  }

  const burialDepthFactor = resolveBurialDepthFactor(installation.burialDepth)
  const soilTemperatureFactor =
    mvSoilTemperatureFactors90C[String(installation.soilTemperature)] ?? null
  const soilResistivityResult = getMvSoilResistivityFactor(
    area,
    installation.soilThermalResistivity
  )
  const groupingFactor = resolveGroundGroupingFactor(
    installation.layout,
    installation.parallelCircuits,
    installation.groupSpacing
  )

  const warnings = []

  if (burialDepthFactor === null) {
    warnings.push('Forlegningsdybden ligger utenfor NEN 62.75-tabellen 0,50–1,50 m.')
  }
  if (soilTemperatureFactor === null) {
    warnings.push('Valgt jordtemperatur finnes ikke i NEN 62.75-tabellen for 90 °C ledertemperatur.')
  }
  if (!soilResistivityResult.supported) {
    warnings.push(
      Number(area) > 500
        ? 'NEN 62.75 tabulerer ikke korreksjon for jordens termiske resistivitet for dette tverrsnittet. Referanseverdien 100 °C·cm/W kan brukes uten korreksjon.'
        : 'Valgt termisk resistivitet finnes ikke i NEN 62.75-tabellen.'
    )
  }
  if (groupingFactor === null) {
    warnings.push('Valgt antall kabelsett eller innbyrdes avstand finnes ikke i NEN 62.75 A-tabellen.')
  }

  const factors = [
    burialDepthFactor,
    soilTemperatureFactor,
    soilResistivityResult.factor,
    groupingFactor,
  ]
  const supported = factors.every((factor) => factor !== null)

  return {
    environment: 'ground',
    airTemperatureFactor: 1,
    burialDepthFactor,
    soilTemperatureFactor,
    soilResistivityFactor: soilResistivityResult.factor,
    groupingFactor,
    totalFactor: supported ? factors.reduce((product, factor) => product * factor, 1) : null,
    supported,
    warnings,
  }
}

import {
  ambientTemperatureFactors,
  installationMethodFactors,
} from '../data/correctionFactors'

function resolveAmbientTemperatureFactor(temperature) {
  return (
    ambientTemperatureFactors[temperature] ?? {
      label: 'Temperatur ikke valgt',
      factor: 1,
    }
  )
}

function resolveInstallationMethodFactor(method) {
  return (
    installationMethodFactors[method] ?? {
      label: 'Forlegning ikke valgt',
      factor: 1,
      groupingFactors: {},
    }
  )
}

function resolveGroupingFactor(installationMethod, grouping) {
  return (
    installationMethod.groupingFactors?.[grouping] ?? {
      label: 'Gruppering ikke valgt',
      factor: 1,
    }
  )
}

export function resolveCorrectionFactors(installation) {
  const temperature = resolveAmbientTemperatureFactor(
    installation.ambientTemperature
  )

  const installationMethod = resolveInstallationMethodFactor(
    installation.installationMethod
  )

  const grouping = resolveGroupingFactor(
    installationMethod,
    installation.grouping
  )

  const totalFactor =
    temperature.factor *
    installationMethod.factor *
    grouping.factor

  return {
    temperature,
    installationMethod,
    grouping,
    totalFactor,
  }
}
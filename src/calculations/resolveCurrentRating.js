import { nenCurrentRatings } from '../data/nenCurrentRatings'

function getEnvironmentFromInstallation(installationMethod) {
  if (installationMethod === 'buried' || installationMethod === 'conduitBuried') {
    return 'earth'
  }

  return 'air'
}

export function resolveCurrentRating({ cableType, cableSize, installation }) {
  const construction = cableType.construction
  const material = cableType.conductorMaterial
  const insulation = cableType.insulation
  const environment = getEnvironmentFromInstallation(installation.installationMethod)

  const constructionTable = nenCurrentRatings[construction]
  const rating =
    constructionTable?.[material]?.[insulation]?.[environment]?.[cableSize.area] ?? null

  const reference =
    construction === 'singleCoreGroup'
      ? environment === 'earth'
        ? constructionTable?.referenceEarth
        : constructionTable?.referenceAir
      : constructionTable?.reference

  return {
    baseCurrentCapacity: rating,
    environment,
    reference: reference ?? 'Tabellgrunnlag ikke funnet',
    tableDescription:
      environment === 'earth'
        ? 'Tabellverdi for jordforlegning'
        : 'Tabellverdi for luftforlegning',
  }
}
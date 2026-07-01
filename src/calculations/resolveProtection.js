import { protectionRatings } from '../data/protectionRatings'

export function resolveProtection({ supply, load, designCurrent }) {
  const current = Number(designCurrent)

  if (!Number.isFinite(current) || current <= 0) {
    return {
      selected: null,
      proposed: null,
      source: 'Ingen',
      description: 'Ingen dimensjonerende strøm tilgjengelig',
      isAutoSuggested: false,
    }
  }

  if (load.enabled) {
    const proposed =
      protectionRatings.find((rating) => rating >= current) ??
      protectionRatings.at(-1)

    return {
      selected: proposed,
      proposed,
      source: 'Foreslått',
      description: `Nærmeste standard vern over ${current.toFixed(0)} A`,
      isAutoSuggested: true,
    }
  }

  if (supply.sourceType === 'transformer') {
    return {
      selected: current,
      proposed: null,
      source: 'Trafo',
      description: 'Beregnet strøm fra trafostørrelse',
      isAutoSuggested: false,
    }
  }

  return {
    selected: Number(supply.sourceCurrent),
    proposed: null,
    source: 'Bruker',
    description: 'Valgt fra forsyning / vern',
    isAutoSuggested: false,
  }
}
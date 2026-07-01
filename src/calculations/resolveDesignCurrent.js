export function resolveDesignCurrent({ supply, load, supplySystem }) {
  if (load.enabled) {
    return {
      value: Number(load.loadCurrent),
      source: 'Lastdata',
      description: `Laststrøm ${Number(load.loadCurrent).toFixed(0)} A`,
    }
  }

  if (supply.sourceType === 'transformer') {
    const kva = Number(supply.transformerKva)
    const voltage = Number(supplySystem.voltage)

    const transformerCurrent =
      supplySystem.phases === 3
        ? (kva * 1000) / (Math.sqrt(3) * voltage)
        : (kva * 1000) / voltage

    return {
      value: transformerCurrent,
      source: 'Trafo',
      description: `${kva.toFixed(0)} kVA trafo`,
    }
  }

  return {
    value: Number(supply.sourceCurrent),
    source: 'Forsyning / vern',
    description: `${Number(supply.sourceCurrent).toFixed(0)} A`,
  }
}
export function createLowVoltageCableCalculation(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    type: 'lowVoltageCable',
    title: 'Lavspent kabel 1',

    supply: {
      supplySystemId: '400-tn',
      sourceType: 'breaker',
      sourceCurrent: 250,
      transformerKva: 400,
      transformerUkPercent: 6,
    },

    load: {
      enabled: false,
      loadCurrent: 125,
      cosPhi: 0.85,
    },

    installation: {
      cableTypeId: 'ifxi-fx-al',
      area: 240,
      length: 50,
      parallelCables: 1,
      installationMethod: 'cableTray',
      ambientTemperature: 25,
      grouping: 'single',
    },

    requirements: {
      maxVoltageDropPercent: '',
      shortCircuitCurrent: '',
      disconnectionTime: 1,
    },

    ...overrides,
  }
}
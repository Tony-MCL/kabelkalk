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

export function createMediumVoltageCableCalculation(overrides = {}) {
  const base = {
    id: crypto.randomUUID(),
    type: 'mediumVoltageCable',
    title: 'Mellomspenningskabel 1',

    supply: {
      voltageKv: 12,
      cableVoltageClass: '12/24 kV',
      sourceType: 'manualShortCircuit',
    },

    load: {
      loadCurrent: 300,
      cosPhi: 0.9,
    },

    installation: {
      cableTypeId: 'single-core-al-pex',
      area: 240,
      length: 100,
      parallelCircuits: 1,
      environment: 'ground',
      layout: 'trefoil',
      screenBonding: 'closed',
      burialDepth: 0.7,
      soilTemperature: 15,
      soilThermalResistivity: 100,
      ambientTemperature: 25,
      groupSpacing: '70mm',
    },

    requirements: {
      maxVoltageDropPercent: '',
      shortCircuitCurrent: '',
      disconnectionTime: 1,
    },
  }

  return {
    ...base,
    ...overrides,
    supply: { ...base.supply, ...(overrides.supply ?? {}) },
    load: { ...base.load, ...(overrides.load ?? {}) },
    installation: { ...base.installation, ...(overrides.installation ?? {}) },
    requirements: { ...base.requirements, ...(overrides.requirements ?? {}) },
  }
}

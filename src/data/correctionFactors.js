export const ambientTemperatureFactors = {
  20: { label: '20 °C', factor: 1.04 },
  25: { label: '25 °C', factor: 1 },
  30: { label: '30 °C', factor: 0.95 },
  35: { label: '35 °C', factor: 0.9 },
  40: { label: '40 °C', factor: 0.85 },
}

export const installationMethodFactors = {
  cableTray: {
    label: 'Kabelbro / stige',
    factor: 1,
    groupingFactors: {
      single: { label: 'Alene', factor: 1 },
      two: { label: '2 kabler/grupper', factor: 0.98 },
      three: { label: '3 kabler/grupper', factor: 0.96 },
      six: { label: '6 kabler/grupper', factor: 0.93 },
      nine: { label: '9 kabler/grupper', factor: 0.92 },
    },
  },

  wall: {
    label: 'På vegg',
    factor: 1,
    groupingFactors: {
      single: { label: 'Alene', factor: 1 },
      two: { label: '2 kabler/grupper', factor: 0.93 },
      three: { label: '3 kabler/grupper', factor: 0.9 },
      six: { label: '6 kabler/grupper', factor: 0.87 },
      nine: { label: '9 kabler/grupper', factor: 0.86 },
    },
  },

  floor: {
    label: 'På gulv',
    factor: 1,
    groupingFactors: {
      single: { label: 'Alene', factor: 0.95 },
      two: { label: '2 kabler/grupper', factor: 0.9 },
      three: { label: '3 kabler/grupper', factor: 0.88 },
      six: { label: '6 kabler/grupper', factor: 0.85 },
      nine: { label: '9 kabler/grupper', factor: 0.84 },
    },
  },

  conduitAir: {
    label: 'Rør / kanal i luft',
    factor: 0.72,
    groupingFactors: {
      single: { label: 'Alene', factor: 1 },
      two: { label: '2 rør', factor: 0.87 },
      three: { label: '3 rør', factor: 0.78 },
      six: { label: '6 rør', factor: 0.67 },
      nine: { label: '9 rør', factor: 0.63 },
    },
  },

  buried: {
    label: 'Direkte i jord',
    factor: 1,
    groupingFactors: {
      single: { label: 'Alene', factor: 1 },
      two: { label: '2 kabler/grupper', factor: 0.85 },
      three: { label: '3 kabler/grupper', factor: 0.75 },
      six: { label: '6 kabler/grupper', factor: 0.6 },
      nine: { label: '9 kabler/grupper', factor: 0.53 },
    },
  },

  conduitBuried: {
    label: 'Rør i jord',
    factor: 0.8,
    groupingFactors: {
      single: { label: 'Alene', factor: 1 },
      two: { label: '2 rør', factor: 0.87 },
      three: { label: '3 rør', factor: 0.78 },
      six: { label: '6 rør', factor: 0.67 },
      nine: { label: '9 rør', factor: 0.63 },
    },
  },
}
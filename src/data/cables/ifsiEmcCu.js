export const ifsiEmcCu = {
  id: 'ifsi-emc-cu',
  name: 'IFSI-EMC 1kV Cu',
  description: 'Lavspent EMC-kabel med kobberleder',
  conductorMaterial: 'cu',
  insulation: 'pex',
  voltageClass: '0.6/1 kV',
  construction: 'multiCore',
  sizes: [
    { area: 1.5, designation: '4x1,5', resistance: 12.1, reactance: 0.08 },
    { area: 2.5, designation: '4x2,5', resistance: 7.41, reactance: 0.08 },
    { area: 4, designation: '4x4', resistance: 4.61, reactance: 0.08 },
    { area: 6, designation: '4x6', resistance: 3.08, reactance: 0.08 },
    { area: 10, designation: '4x10', resistance: 1.83, reactance: 0.08 },
    { area: 16, designation: '4x16', resistance: 1.15, reactance: 0.08 },
  ],
}
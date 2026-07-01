export const tfxpAl = {
  id: 'tfxp-al',
  name: 'TFXP 1kV Al',
  description: 'Lavspent kabel med aluminiumleder',
  conductorMaterial: 'al',
  insulation: 'pex',
  voltageClass: '0.6/1 kV',
  construction: 'multiCore',
  sizes: [
    { area: 25, designation: '4G25', resistance: 1.2, reactance: 0.08 },
    { area: 50, designation: '4G50', resistance: 0.641, reactance: 0.08 },
    { area: 95, designation: '4G95', resistance: 0.32, reactance: 0.08 },
    { area: 150, designation: '4G150', resistance: 0.206, reactance: 0.08 },
    { area: 240, designation: '4G240', resistance: 0.125, reactance: 0.08 },
  ],
}
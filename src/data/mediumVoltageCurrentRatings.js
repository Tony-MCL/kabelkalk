// Belastningsevner for tre enlederkabler, Al / PEX / 90 °C.
// Datagrunnlag: prosjektets normaliserte mellomspenningstabell for 12–36 kV.
// Verdiene er ampere for ett trefasesett.
export const mediumVoltageCurrentRatings = [
  { area: 25, ground: { flat: { open: 145, closed: 145 }, trefoil: { open: 130, closed: 130 } }, air: { flat: { open: 140, closed: 135 }, trefoil: { open: 125, closed: 125 } } },
  { area: 50, ground: { flat: { open: 205, closed: 200 }, trefoil: { open: 185, closed: 185 } }, air: { flat: { open: 210, closed: 205 }, trefoil: { open: 195, closed: 195 } } },
  { area: 95, ground: { flat: { open: 300, closed: 295 }, trefoil: { open: 295, closed: 280 } }, air: { flat: { open: 320, closed: 310 }, trefoil: { open: 285, closed: 280 } } },
  { area: 150, ground: { flat: { open: 390, closed: 370 }, trefoil: { open: 370, closed: 360 } }, air: { flat: { open: 425, closed: 395 }, trefoil: { open: 380, closed: 370 } } },
  { area: 240, ground: { flat: { open: 510, closed: 465 }, trefoil: { open: 465, closed: 465 } }, air: { flat: { open: 570, closed: 515 }, trefoil: { open: 505, closed: 490 } } },
  { area: 300, ground: { flat: { open: 570, closed: 515 }, trefoil: { open: 515, closed: 525 } }, air: { flat: { open: 650, closed: 580 }, trefoil: { open: 580, closed: 565 } } },
  { area: 400, ground: { flat: { open: 670, closed: 590 }, trefoil: { open: 590, closed: 615 } }, air: { flat: { open: 790, closed: 680 }, trefoil: { open: 695, closed: 680 } } },
  { area: 630, ground: { flat: { open: 850, closed: 715 }, trefoil: { open: 715, closed: 780 } }, air: { flat: { open: 1040, closed: 840 }, trefoil: { open: 915, closed: 880 } } },
  { area: 800, ground: { flat: { open: 920, closed: 790 }, trefoil: { open: 790, closed: 885 } }, air: { flat: { open: 1250, closed: 910 }, trefoil: { open: 1060, closed: 1005 } } },
  { area: 1000, ground: { flat: { open: 1025, closed: 870 }, trefoil: { open: 870, closed: 990 } }, air: { flat: { open: 1430, closed: 1005 }, trefoil: { open: 1205, closed: 1195 } } },
  { area: 1200, ground: { flat: { open: 1090, closed: 925 }, trefoil: { open: 925, closed: 1065 } }, air: { flat: { open: 1580, closed: 1075 }, trefoil: { open: 1315, closed: 1230 } } },
]

export const mediumVoltageAreas = mediumVoltageCurrentRatings.map((item) => item.area)

import { useMemo } from 'react'
import CalculatorLayout from '../layout/CalculatorLayout'
import ProjectHeader from '../project/ProjectHeader'
import SectionCard from '../cards/SectionCard'
import { mediumVoltageAreas } from '../../data/mediumVoltageCurrentRatings'
import {
  mvSupportedAirTemperatures,
  mvSupportedGroupCounts,
  mvSupportedSoilResistivities,
  mvSupportedSoilTemperatures,
} from '../../data/mediumVoltageCorrectionFactors'
import { calculateMediumVoltageCable } from '../../calculations/mediumVoltageCable'
import { resolveMediumVoltageCorrectionFactors } from '../../calculations/resolveMediumVoltageCorrectionFactors'
import { useProject } from '../../hooks/useProject'
import '../../styles/layout.css'
import '../../styles/cards.css'
import '../../styles/forms.css'
import '../../styles/results.css'
import '../../styles/project.css'

function StatusValue({ label, value, ok }) {
  const className = ok === null || ok === undefined ? '' : ok ? 'status-ok' : 'status-fail'

  return (
    <div className="result-row">
      <span>{label}</span>
      <strong className={className}>{value}</strong>
    </div>
  )
}

function factorText(value) {
  return value === null || value === undefined ? '—' : Number(value).toFixed(2)
}

export default function MediumVoltageCableCalculator() {
  const { project, updateCalculation, updateCalculationGroup } = useProject()
  const calculation = project.calculations.find((item) => item.type === 'mediumVoltageCable')

  const correctionFactors = useMemo(() => {
    if (!calculation) return null

    return resolveMediumVoltageCorrectionFactors({
      area: calculation.installation.area,
      installation: calculation.installation,
    })
  }, [calculation])

  const result = useMemo(() => {
    if (!calculation || !correctionFactors?.supported) return null

    return calculateMediumVoltageCable({
      area: calculation.installation.area,
      loadCurrent: calculation.load.loadCurrent,
      parallelCircuits: calculation.installation.parallelCircuits,
      environment: calculation.installation.environment,
      layout: calculation.installation.layout,
      screenBonding: calculation.installation.screenBonding,
      correctionFactor: correctionFactors.totalFactor,
      shortCircuitCurrent: calculation.requirements.shortCircuitCurrent,
      disconnectionTime: calculation.requirements.disconnectionTime,
    })
  }, [calculation, correctionFactors])

  if (!calculation) return null

  const voltageKv = Number(calculation.supply.voltageKv)
  const voltageIsValid = Number.isFinite(voltageKv) && voltageKv > 1 && voltageKv <= 36
  const isGround = calculation.installation.environment === 'ground'

  return (
    <>
      <ProjectHeader project={project} />

      <section className="module-heading compact module-heading-row">
        <div>
          <p className="eyebrow">Mellomspenningskabel</p>
          <h2>Kabelberegning</h2>
        </div>
      </section>

      <CalculatorLayout
        left={
          <>
            <SectionCard title="Kabel" subtitle="Enleder aluminium, PEX 90 °C">
              <div className="form-grid">
                <label className="form-field">
                  <span>Navn</span>
                  <input
                    value={calculation.title}
                    onChange={(event) => updateCalculation(calculation.id, { title: event.target.value })}
                  />
                </label>

                <label className="form-field">
                  <span>Driftsspenning</span>
                  <input
                    type="number"
                    min="1.01"
                    max="36"
                    step="0.1"
                    inputMode="decimal"
                    value={calculation.supply.voltageKv}
                    onChange={(event) => updateCalculationGroup(calculation.id, 'supply', { voltageKv: event.target.value })}
                  />
                  <small>kV – faktisk system-/generatorspenning, f.eks. 8,0 eller 9,2 kV.</small>
                  {!voltageIsValid && <small>Driftsspenningen må være over 1 kV og maksimalt 36 kV.</small>}
                </label>

                <label className="form-field">
                  <span>Kabelens spenningsklasse</span>
                  <input value={calculation.supply.cableVoltageClass ?? '12/24 kV'} readOnly />
                  <small>Fast kabelklasse i denne arbeidsversjonen.</small>
                </label>

                <label className="form-field">
                  <span>Belastningsstrøm</span>
                  <input
                    type="number"
                    min="0"
                    value={calculation.load.loadCurrent}
                    onChange={(event) => updateCalculationGroup(calculation.id, 'load', { loadCurrent: event.target.value })}
                  />
                  <small>A</small>
                </label>

                <label className="form-field">
                  <span>Tverrsnitt</span>
                  <select
                    value={calculation.installation.area}
                    onChange={(event) => updateCalculationGroup(calculation.id, 'installation', { area: Number(event.target.value) })}
                  >
                    {mediumVoltageAreas.map((area) => (
                      <option key={area} value={area}>{area} mm²</option>
                    ))}
                  </select>
                </label>
              </div>
            </SectionCard>

            <SectionCard title="Forlegning" subtitle="Tre enlederkabler i trefasesett">
              <div className="installation-grid">
                <label className="form-field">
                  <span>Miljø</span>
                  <select
                    value={calculation.installation.environment}
                    onChange={(event) => updateCalculationGroup(calculation.id, 'installation', { environment: event.target.value })}
                  >
                    <option value="ground">Jord</option>
                    <option value="air">Luft</option>
                  </select>
                </label>

                <label className="form-field">
                  <span>Forlegning</span>
                  <select
                    value={calculation.installation.layout}
                    onChange={(event) => updateCalculationGroup(calculation.id, 'installation', { layout: event.target.value })}
                  >
                    <option value="flat">Flat</option>
                    <option value="trefoil">Trekant</option>
                  </select>
                </label>

                <label className="form-field">
                  <span>Skjerm</span>
                  <select
                    value={calculation.installation.screenBonding}
                    onChange={(event) => updateCalculationGroup(calculation.id, 'installation', { screenBonding: event.target.value })}
                  >
                    <option value="open">Åpen skjerm</option>
                    <option value="closed">Lukket skjerm</option>
                  </select>
                </label>

                <label className="form-field">
                  <span>Parallelle kabelsett</span>
                  <select
                    value={calculation.installation.parallelCircuits}
                    onChange={(event) => updateCalculationGroup(calculation.id, 'installation', { parallelCircuits: Number(event.target.value) })}
                  >
                    {mvSupportedGroupCounts.map((count) => (
                      <option key={count} value={count}>{count}</option>
                    ))}
                  </select>
                </label>
              </div>
            </SectionCard>

            <SectionCard
              title="Korreksjonsfaktorer"
              subtitle={isGround ? 'NEN 62.75 / NEN 62.75 A – forlegning i jord' : 'NEN 62.75 – forlegning i luft'}
            >
              {isGround ? (
                <div className="installation-grid">
                  <label className="form-field">
                    <span>Forlegningsdybde</span>
                    <input
                      type="number"
                      min="0.5"
                      max="1.5"
                      step="0.01"
                      value={calculation.installation.burialDepth}
                      onChange={(event) => updateCalculationGroup(calculation.id, 'installation', { burialDepth: event.target.value })}
                    />
                    <small>m – referanse 0,70 m</small>
                  </label>

                  <label className="form-field">
                    <span>Jordtemperatur</span>
                    <select
                      value={calculation.installation.soilTemperature}
                      onChange={(event) => updateCalculationGroup(calculation.id, 'installation', { soilTemperature: Number(event.target.value) })}
                    >
                      {mvSupportedSoilTemperatures.map((temperature) => (
                        <option key={temperature} value={temperature}>{temperature} °C</option>
                      ))}
                    </select>
                    <small>Referanse 15 °C</small>
                  </label>

                  <label className="form-field">
                    <span>Termisk resistivitet jord</span>
                    <select
                      value={calculation.installation.soilThermalResistivity}
                      onChange={(event) => updateCalculationGroup(calculation.id, 'installation', { soilThermalResistivity: Number(event.target.value) })}
                    >
                      {mvSupportedSoilResistivities.map((value) => (
                        <option key={value} value={value}>{value} °C·cm/W</option>
                      ))}
                    </select>
                    <small>Referanse 100 °C·cm/W</small>
                  </label>

                  {calculation.installation.layout === 'trefoil' ? (
                    <label className="form-field">
                      <span>Avstand mellom kabelsett</span>
                      <select
                        value={calculation.installation.groupSpacing}
                        onChange={(event) => updateCalculationGroup(calculation.id, 'installation', { groupSpacing: event.target.value })}
                      >
                        <option value="tight">Tett</option>
                        <option value="70mm">70 mm</option>
                        <option value="250mm">250 mm</option>
                      </select>
                    </label>
                  ) : (
                    <div className="form-field">
                      <span>Avstand mellom enlederkabler</span>
                      <input value="70 mm" readOnly />
                      <small>NEN 62.75 A-tabellen for flat gruppe er basert på 70 mm innbyrdes avstand.</small>
                    </div>
                  )}
                </div>
              ) : (
                <div className="form-grid">
                  <label className="form-field">
                    <span>Lufttemperatur</span>
                    <select
                      value={calculation.installation.ambientTemperature}
                      onChange={(event) => updateCalculationGroup(calculation.id, 'installation', { ambientTemperature: Number(event.target.value) })}
                    >
                      {mvSupportedAirTemperatures.map((temperature) => (
                        <option key={temperature} value={temperature}>{temperature} °C</option>
                      ))}
                    </select>
                    <small>Referanse 25 °C</small>
                  </label>
                </div>
              )}

              {correctionFactors?.warnings?.length > 0 && (
                <div>
                  {correctionFactors.warnings.map((warning) => (
                    <p key={warning}><strong>Merk:</strong> {warning}</p>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title="Kortslutning" subtitle="Aluminium / PEX, 90 → 250 °C">
              <div className="form-grid">
                <label className="form-field">
                  <span>Krav til kortslutningsstrøm</span>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={calculation.requirements.shortCircuitCurrent}
                    onChange={(event) => updateCalculationGroup(calculation.id, 'requirements', { shortCircuitCurrent: event.target.value })}
                  />
                  <small>kA – valgfritt. Senere kan denne beregnes fra generator-/nettkilden.</small>
                </label>

                <label className="form-field">
                  <span>Utkoblingstid</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={calculation.requirements.disconnectionTime}
                    onChange={(event) => updateCalculationGroup(calculation.id, 'requirements', { disconnectionTime: event.target.value })}
                  />
                  <small>s</small>
                </label>
              </div>
            </SectionCard>
          </>
        }
        right={
          <>
            <SectionCard title="Resultat" subtitle="Strømføring og kortslutning">
              {result ? (
                <div className="result-list">
                  <StatusValue label="Driftsspenning" value={voltageIsValid ? `${voltageKv.toLocaleString('no-NO')} kV` : 'Ugyldig verdi'} ok={voltageIsValid ? undefined : false} />
                  <StatusValue label="Kabelklasse" value={calculation.supply.cableVoltageClass ?? '12/24 kV'} />
                  <StatusValue label="Tabellverdi" value={`${result.baseCurrentCapacity.toFixed(0)} A`} />
                  <StatusValue label="Samlet korreksjonsfaktor" value={factorText(correctionFactors.totalFactor)} />
                  <StatusValue label="Korrigert belastningsevne" value={`${result.currentCapacity.toFixed(0)} A`} ok={result.currentOk} />
                  <StatusValue label="Strømmargin" value={`${result.currentMargin.toFixed(0)} A`} ok={result.currentOk} />
                  <StatusValue label="Kortslutningsytelse" value={`${result.shortCircuitCapacityKA.toFixed(1)} kA`} ok={result.shortCircuitOk} />
                  <StatusValue label="Spenningsfall" value="Avventer R/X-datasett" />
                  <StatusValue label="Kortslutningsstrøm fra kilde" value="Senere generator-/nettkildemodell" />
                </div>
              ) : (
                <p>Beregningen mangler en tabellstøttet korreksjonsfaktor. Se merknadene under korreksjonsfaktorer.</p>
              )}
            </SectionCard>

            <SectionCard title="Korreksjonsgrunnlag" subtitle="Faktorene som inngår i belastningsevnen">
              <div className="result-list">
                {isGround ? (
                  <>
                    <StatusValue label="Forlegningsdybde" value={factorText(correctionFactors?.burialDepthFactor)} />
                    <StatusValue label="Jordtemperatur" value={factorText(correctionFactors?.soilTemperatureFactor)} />
                    <StatusValue label="Termisk resistivitet" value={factorText(correctionFactors?.soilResistivityFactor)} />
                    <StatusValue label="Gruppering" value={factorText(correctionFactors?.groupingFactor)} />
                  </>
                ) : (
                  <>
                    <StatusValue label="Lufttemperatur" value={factorText(correctionFactors?.airTemperatureFactor)} />
                    <StatusValue label="Gruppering" value={factorText(correctionFactors?.groupingFactor)} />
                  </>
                )}
                <StatusValue label="Samlet faktor" value={factorText(correctionFactors?.totalFactor)} />
              </div>
            </SectionCard>
          </>
        }
      />
    </>
  )
}

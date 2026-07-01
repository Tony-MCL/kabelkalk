import { useState } from 'react'

export default function ResultPanel({
  designCurrent,
  designCurrentSource,
  cableDesignCurrent,
  protectionResult,
  supplySystem,
  cableType,
  cableSize,
  parallelCables = 1,
  correctionFactors,
  currentRating,
  result,
}) {
  const [showCorrections, setShowCorrections] = useState(false)

  const parallelCount = Number(parallelCables)
  const sizeText = cableSize?.designation ?? (cableSize ? `${cableSize.area} mm²` : '')
  const cableName = cableType?.name ?? 'Ikke valgt'

  const cableDescription =
    parallelCount > 1
      ? `${parallelCount}× ${cableName} ${sizeText}`
      : `${cableName} ${sizeText}`

  const voltageMargin =
    result?.voltageDropLimit === null
      ? null
      : ((result?.voltageDropLimit - result?.voltageDropPercent) / result?.voltageDropLimit) * 100

  const shortCircuitMargin =
    result?.shortCircuitRequirement === null
      ? null
      : ((result?.shortCircuitCapacityKA - result?.shortCircuitRequirement) /
          result?.shortCircuitRequirement) *
        100

  return (
    <div className="result-panel">
      <div className="selected-cable-card">
        <p className="summary-label">Valgt kabel</p>
        <strong>{cableDescription}</strong>
        <span>Parallelle kabler: {parallelCount}</span>
      </div>

      {result && (
        <>
          <ResultItem
            title="Strømføringsevne"
            status={result.currentOk ? 'OK' : 'Ikke OK'}
            statusType={result.currentOk ? 'ok' : 'fail'}
            rows={[
              ['Belastning', `${Number(cableDesignCurrent).toFixed(0)} A`],
              ['Tabellverdi', currentRating?.baseCurrentCapacity ? `${currentRating.baseCurrentCapacity} A` : 'Ikke funnet'],
              ['Korrigert Iz', `${result.currentCapacity.toFixed(0)} A`],
              ['Margin', `${result.currentMargin.toFixed(0)} A`],
            ]}
            footer={
              <button
                type="button"
                className="correction-toggle"
                onClick={() => setShowCorrections((current) => !current)}
              >
                Korr.faktor {correctionFactors?.totalFactor.toFixed(3) ?? '1.000'}{' '}
                {showCorrections ? '▲' : '▼'}
              </button>
            }
          />

          {showCorrections && correctionFactors && (
            <div className="mini-detail-card">
              <h3>Korreksjonsfaktorer</h3>
              <ResultRows
                rows={[
                  ['Temperatur', correctionFactors.temperature.factor.toFixed(3)],
                  ['Forlegning', correctionFactors.installationMethod.factor.toFixed(3)],
                  ['Gruppering', correctionFactors.grouping.factor.toFixed(3)],
                  ['Total', correctionFactors.totalFactor.toFixed(3)],
                ]}
              />
            </div>
          )}

          <ResultItem
            title="Spenningsfall"
            status={
              result.voltageDropOk === null
                ? 'Ikke vurdert'
                : result.voltageDropOk
                  ? 'OK'
                  : 'Ikke OK'
            }
            statusType={
              result.voltageDropOk === null
                ? 'neutral'
                : result.voltageDropOk
                  ? 'ok'
                  : 'fail'
            }
            rows={[
              ['Beregnet', `${result.voltageDropPercent.toFixed(2)} %`],
              ['Spenningsfall', `${result.voltageDrop.toFixed(1)} V`],
              [
                'Grense',
                result.voltageDropLimit === null
                  ? 'Ikke oppgitt'
                  : `${result.voltageDropLimit.toFixed(1)} %`,
              ],
              [
                'Margin',
                voltageMargin === null ? 'Ikke vurdert' : `${voltageMargin.toFixed(1)} %`,
              ],
            ]}
          />

          <ResultItem
            title="Kortslutning"
            status={
              result.shortCircuitOk === null
                ? 'Ikke vurdert'
                : result.shortCircuitOk
                  ? 'OK'
                  : 'Ikke OK'
            }
            statusType={
              result.shortCircuitOk === null
                ? 'neutral'
                : result.shortCircuitOk
                  ? 'ok'
                  : 'fail'
            }
            rows={[
              [
                'Ik maks',
                result.shortCircuitRequirement === null
                  ? 'Ikke oppgitt'
                  : `${result.shortCircuitRequirement.toFixed(1)} kA`,
              ],
              ['Utkoblingstid', '1 s'],
              ['Kabelkapasitet', `${result.shortCircuitCapacityKA.toFixed(1)} kA`],
              [
                'Margin',
                shortCircuitMargin === null ? 'Ikke vurdert' : `${shortCircuitMargin.toFixed(1)} %`,
              ],
            ]}
          />
        </>
      )}
    </div>
  )
}

function ResultItem({ title, status, statusType, rows, footer }) {
  return (
    <article className={`result-item report-style ${statusType}`}>
      <header>
        <h3>{title}</h3>
        <span>{status}</span>
      </header>

      <ResultRows rows={rows} />

      {footer}
    </article>
  )
}

function ResultRows({ rows }) {
  return (
    <dl className="result-rows">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  )
}
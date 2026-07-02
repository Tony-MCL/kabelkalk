import { useState } from 'react'

export default function ProjectCableListPage({ project, onBack, onDelete, onEdit, onCopy }) {
  const [openId, setOpenId] = useState(null)
  const savedCables = project.savedCables ?? []

  function handlePrint() {
    window.print()
  }

  return (
    <section className="project-list-page">
      <div className="project-list-header no-print">
        <div>
          <p className="eyebrow">Prosjekt</p>
          <h1>Beregninger i prosjektet</h1>
          <p>{project.name}</p>
        </div>

        <div className="module-actions">
          <button type="button" className="secondary-action" onClick={handlePrint}>
            Eksporter PDF
          </button>

          <button type="button" className="back-button" onClick={onBack}>
            ← Tilbake til kalkulator
          </button>
        </div>
      </div>

      <div className="print-header print-only">
        {project.logoDataUrl && (
          <img className="print-logo" src={project.logoDataUrl} alt="" />
        )}

        <div>
          <h1>Beregningsrapport</h1>

          <div className="print-meta">
            {project.company && <p>Firma: {project.company}</p>}
            {project.customer && <p>Kunde: {project.customer}</p>}
            {project.name && <p>Prosjekt: {project.name}</p>}
            {project.facility && <p>Anlegg: {project.facility}</p>}
            {project.description && <p>Beskrivelse: {project.description}</p>}
            <p>Dato: {new Date().toLocaleDateString('no-NO')}</p>
          </div>
        </div>
      </div>

      <div className="print-footer print-only">
        Beregningsrapport generert med Manage Tools – morningcoffeelabs.no
      </div>

      {savedCables.length === 0 ? (
        <div className="empty-list-card">Ingen kabler er lagret ennå.</div>
      ) : (
        <div className="project-cable-list">
          {savedCables.map((item) => {
            const isOpen = openId === item.id

            return (
              <article key={item.id} className="project-cable-card">
                <button
                  type="button"
                  className="project-cable-summary clean no-print-button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                >
                  <div>
                    <strong>{item.name || item.cable}</strong>
                    <span>{item.cable}</span>
                  </div>

                  <span className="saved-date">Lagret {item.savedAt}</span>
                  <span className="expand-indicator no-print">{isOpen ? '▲' : '▼'}</span>
                </button>

                <div className={`print-cable-report ${isOpen ? 'screen-open' : ''}`}>
                  <CableReport item={item} onDelete={onDelete} onEdit={onEdit} onCopy={onCopy} />
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

function CableReport({ item, onDelete, onEdit, onCopy }) {
  const calculation = item.calculation
  const supply = calculation?.supply ?? {}
  const installation = calculation?.installation ?? {}
  const result = item.result

  const voltageLimit =
    result.voltageDropLimit === null
      ? 'Ikke oppgitt'
      : `${result.voltageDropLimit.toFixed(2)} %`

  const voltageMargin =
    result.voltageDropLimit === null
      ? 'Ikke vurdert'
      : `${(result.voltageDropLimit - result.voltageDropPercent).toFixed(2)} %`

  const shortCircuitStress =
    result.shortCircuitRequirement === null
      ? null
      : Math.pow(result.shortCircuitRequirement, 2) *
        Number(calculation.requirements.disconnectionTime || 1)

  const shortCircuitCapacity =
    Math.pow(result.shortCircuitCapacityKA, 2) *
    Number(calculation.requirements.disconnectionTime || 1)

  return (
    <div className="project-cable-details report-layout">
      <section className="saved-report-grid">
        <ReportCard title="Beregningsgrunnlag" icon="i" accent>
          <ReportRow label="Forsyning" value={getSourceText(supply)} />
          <ReportRow label="Belastning" value={`${item.cableDesignCurrent.toFixed(1)} A`} />
          <ReportRow label="Kabellengde" value={`${installation.length ?? '-'} m`} />
          <ReportRow label="Forlegning" value={getInstallationText(installation)} />
          <ReportRow label="Omg.temp" value={`${installation.ambientTemperature ?? '-'} °C`} />
          <ReportRow label="Fellesføring" value={getGroupingText(installation)} />
          <ReportRow label="Samlet korr.faktor" value={item.correctionFactors.totalFactor.toFixed(2)} />
        </ReportCard>

        <ReportCard title="Strømføring" icon="∿" status={item.currentOk ? 'OK' : 'Ikke OK'}>
          <ReportRow label="Belastning" value={`${item.cableDesignCurrent.toFixed(1)} A`} />
          <ReportRow label="Beregnet strømføringsevne (Iz)" value={`${result.currentCapacity.toFixed(0)} A`} />
          <ReportDivider />
          <ReportRow label="Margin" value={`${result.currentMargin.toFixed(0)} A`} />
        </ReportCard>

        <ReportCard
          title="Spenningsfall"
          icon="↓"
          status={
            item.voltageDropOk === null
              ? 'Ikke vurdert'
              : item.voltageDropOk
                ? 'OK'
                : 'Ikke OK'
          }
        >
          <ReportRow label="Tillatt maks" value={voltageLimit} />
          <ReportRow label="Beregnet" value={`${result.voltageDropPercent.toFixed(2)} %`} />
          <ReportRow label="Spenningsfall" value={`${result.voltageDrop.toFixed(2)} V`} />
          <ReportDivider />
          <ReportRow label="Margin" value={voltageMargin} />
        </ReportCard>

        <ReportCard
          title="Kortslutning"
          icon="⚡"
          status={
            item.shortCircuitOk === null
              ? 'Ikke vurdert'
              : item.shortCircuitOk
                ? 'OK'
                : 'Ikke OK'
          }
        >
          <ReportRow
            label="Ik maks"
            value={
              result.shortCircuitRequirement === null
                ? 'Ikke oppgitt'
                : `${result.shortCircuitRequirement.toFixed(2)} kA`
            }
          />
          <ReportRow label="Kabelens Ik" value={`${result.shortCircuitCapacityKA.toFixed(2)} kA`} />
          <ReportRow label="Utkoblingstid" value={`${calculation.requirements.disconnectionTime ?? 1} s`} />
          <ReportRow
            label="Termisk påkjenning"
            value={shortCircuitStress === null ? 'Ikke vurdert' : `${shortCircuitStress.toFixed(2)} MA²s`}
          />
          <ReportRow label="Termisk kapasitet" value={`${shortCircuitCapacity.toFixed(2)} MA²s`} />
          <ReportDivider />
          <ReportRow
            label="Margin"
            value={
              result.shortCircuitRequirement === null
                ? 'Ikke vurdert'
                : `${(
                    ((result.shortCircuitCapacityKA - result.shortCircuitRequirement) /
                      result.shortCircuitRequirement) *
                    100
                  ).toFixed(1)} %`
            }
          />
        </ReportCard>
      </section>

      <div className="project-cable-actions no-print">
        <button type="button" className="neutral-action" onClick={() => onEdit(item)}>
          Rediger kabel
        </button>

        <button type="button" className="neutral-action" onClick={() => onCopy(item)}>
          Kopier kabel
        </button>

        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Slette "${item.name}" fra prosjektet?`)) {
              onDelete(item.id)
            }
          }}
        >
          Slett kabel
        </button>
      </div>
    </div>
  )
}

function ReportCard({ title, icon, status, accent = false, children }) {
  const statusClass =
    status === 'OK'
      ? 'ok'
      : status === 'Ikke OK'
        ? 'fail'
        : status
          ? 'neutral'
          : ''

  return (
    <article className={`saved-report-card ${accent ? 'accent' : ''}`}>
      <header>
        <div className="report-title">
          {icon && <span className="report-icon">{icon}</span>}
          <h3>{title}</h3>
        </div>

        {status && <span className={`report-status ${statusClass}`}>{status}</span>}
      </header>

      <dl>{children}</dl>
    </article>
  )
}

function ReportRow({ label, value }) {
  return (
    <div className="report-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function ReportDivider() {
  return <div className="report-divider" />
}

function getSourceText(supply) {
  if (supply.sourceType === 'transformer') {
    return `Trafo, ${supply.sourceCurrent ?? '-'} kVA, uk ${supply.transformerUkPercent ?? 6} %`
  }

  if (supply.sourceType === 'fuse') {
    return `Sikring, ${supply.sourceCurrent ?? '-'} A`
  }

  if (supply.sourceType === 'motorProtection') {
    return `Motorvern, ${supply.sourceCurrent ?? '-'} A`
  }

  return `Effektbryter, ${supply.sourceCurrent ?? '-'} A`
}

function getInstallationText(installation) {
  const labels = {
    cableTray: 'Kabelbro / stige',
    wall: 'På vegg',
    floor: 'På gulv',
    conduitAir: 'Rør / kanal i luft',
    buried: 'Direkte i jord',
    conduitBuried: 'Rør i jord',
  }

  return labels[installation.installationMethod] ?? 'Ikke valgt'
}

function getGroupingText(installation) {
  const labels = {
    single: 'Ingen fellesføring / enkelt kurs',
    two: '2 kabler/grupper',
    three: '3 kabler/grupper',
    six: '6 kabler/grupper',
    nine: '9 kabler/grupper',
  }

  return labels[installation.grouping] ?? 'Ikke valgt'
}
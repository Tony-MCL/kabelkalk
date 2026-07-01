import SectionCard from '../cards/SectionCard'
import FormField from '../fields/FormField'

export default function RequirementsCard({ requirements, onChange }) {
  return (
    <SectionCard title="Krav" subtitle="Grenseverdier for vurdering" defaultOpen>
      <div className="three-field-grid">
        <FormField label="Maks spenningsfall %">
          <input
            type="number"
            step="0.1"
            min="0"
            value={requirements.maxVoltageDropPercent}
            onChange={(event) => onChange({ maxVoltageDropPercent: event.target.value })}
          />
        </FormField>

        <FormField label="Kortslutningsstrøm kA">
          <input
            type="number"
            step="0.1"
            min="0"
            value={requirements.shortCircuitCurrent}
            onChange={(event) => onChange({ shortCircuitCurrent: event.target.value })}
          />
        </FormField>

        <FormField label="Utkoblingstid">
          <input
            type="number"
            step="0.1"
            min="0.01"
            value={requirements.disconnectionTime}
            onChange={(event) => onChange({ disconnectionTime: event.target.value })}
          />
        </FormField>
      </div>
    </SectionCard>
  )
}
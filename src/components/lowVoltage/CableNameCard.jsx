import SectionCard from '../cards/SectionCard'
import FormField from '../fields/FormField'

export default function CableNameCard({ title, onChange }) {
  return (
    <SectionCard title="Kabel" subtitle="Navn på kabelen i prosjektet" defaultOpen>
      <div className="single-field-row">
        <FormField label="Navn">
          <input
            type="text"
            value={title}
            placeholder="Eksempel: ST1 → Hovedtavle"
            onChange={(event) => onChange(event.target.value)}
          />
        </FormField>
      </div>
    </SectionCard>
  )
}
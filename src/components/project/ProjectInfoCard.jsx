import SectionCard from '../cards/SectionCard'
import FormField from '../fields/FormField'

export default function ProjectInfoCard({ project, onChange, defaultOpen = false }) {
  return (
    <SectionCard
      title="Prosjektinformasjon"
      subtitle="Brukes senere i rapport og PDF"
      defaultOpen={defaultOpen}
    >
      <div className="form-grid">
        <FormField label="Prosjektnavn">
          <input
            type="text"
            value={project.name}
            onChange={(event) => onChange({ name: event.target.value })}
          />
        </FormField>

        <FormField label="Kunde">
          <input
            type="text"
            value={project.customer}
            onChange={(event) => onChange({ customer: event.target.value })}
          />
        </FormField>

        <FormField label="Anlegg">
          <input
            type="text"
            value={project.facility}
            onChange={(event) => onChange({ facility: event.target.value })}
          />
        </FormField>
      </div>

      <div className="form-row-full">
        <FormField label="Beskrivelse">
          <textarea
            rows="3"
            value={project.description}
            onChange={(event) => onChange({ description: event.target.value })}
          />
        </FormField>
      </div>
    </SectionCard>
  )
}
import SectionCard from '../cards/SectionCard'
import FormField from '../fields/FormField'

export default function ProjectInfoCard({ project, onChange, defaultOpen = false }) {
  function handleLogoChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = () => {
      onChange({ logoDataUrl: reader.result })
    }

    reader.readAsDataURL(file)
  }

  return (
    <SectionCard title="Prosjektinformasjon" subtitle="Brukes i PDF og rapport" defaultOpen={defaultOpen}>
      <div className="project-info-grid">
        <FormField label="Prosjekt">
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

        <FormField label="Firma">
          <input
            type="text"
            value={project.company ?? ''}
            onChange={(event) => onChange({ company: event.target.value })}
          />
        </FormField>
      </div>

      <FormField label="Beskrivelse">
        <textarea
          value={project.description}
          onChange={(event) => onChange({ description: event.target.value })}
        />
      </FormField>

      <div className="logo-upload-row">
        <FormField label="Logo">
          <input type="file" accept="image/*" onChange={handleLogoChange} />
        </FormField>

        {project.logoDataUrl && (
          <div className="logo-preview-box">
            <img src={project.logoDataUrl} alt="Valgt logo" />
            <button type="button" onClick={() => onChange({ logoDataUrl: '' })}>
              Fjern logo
            </button>
          </div>
        )}
      </div>
    </SectionCard>
  )
}
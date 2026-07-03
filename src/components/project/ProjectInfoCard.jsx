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
    <SectionCard
      title="Prosjektinformasjon"
      subtitle="Opplysninger som brukes i beregningsrapporten"
      defaultOpen={defaultOpen}
    >
      <div className="project-info-split">
        <section className="project-info-group">
          <p className="project-info-label">Utførende</p>

          <div className="logo-upload-row compact">
            <FormField label="Firmalogo">
              <input type="file" accept="image/*" onChange={handleLogoChange} />
              <small>Vises i beregningsrapporten.</small>
            </FormField>

            {project.logoDataUrl && (
              <div className="logo-preview-box">
                <img src={project.logoDataUrl} alt="Valgt firmalogo" />
                <button type="button" onClick={() => onChange({ logoDataUrl: '' })}>
                  Fjern logo
                </button>
              </div>
            )}
          </div>

          <div className="project-info-grid two-columns">
            <FormField label="Firma">
              <input
                type="text"
                value={project.company ?? ''}
                onChange={(event) => onChange({ company: event.target.value })}
              />
            </FormField>

            <FormField label="Kontaktperson">
              <input
                type="text"
                value={project.contactPerson ?? ''}
                onChange={(event) => onChange({ contactPerson: event.target.value })}
              />
            </FormField>

            <FormField label="Telefon">
              <input
                type="text"
                value={project.phone ?? ''}
                onChange={(event) => onChange({ phone: event.target.value })}
              />
            </FormField>

            <FormField label="E-post">
              <input
                type="email"
                value={project.email ?? ''}
                onChange={(event) => onChange({ email: event.target.value })}
              />
            </FormField>
          </div>
        </section>

        <section className="project-info-group project-info-group-bordered">
          <p className="project-info-label">Prosjekt / kunde</p>

          <div className="project-info-grid two-columns">
            <FormField label="Prosjekt">
              <input
                type="text"
                value={project.name ?? ''}
                onChange={(event) => onChange({ name: event.target.value })}
              />
            </FormField>

            <FormField label="Kunde">
              <input
                type="text"
                value={project.customer ?? ''}
                onChange={(event) => onChange({ customer: event.target.value })}
              />
            </FormField>

            <FormField label="Anlegg">
              <input
                type="text"
                value={project.facility ?? ''}
                onChange={(event) => onChange({ facility: event.target.value })}
              />
            </FormField>

            <FormField label="Adresse">
              <input
                type="text"
                value={project.address ?? ''}
                onChange={(event) => onChange({ address: event.target.value })}
              />
            </FormField>
          </div>

          <FormField label="Beskrivelse">
            <textarea
              value={project.description ?? ''}
              onChange={(event) => onChange({ description: event.target.value })}
            />
          </FormField>
        </section>
      </div>
    </SectionCard>
  )
}
import FormField from '../fields/FormField'

export default function LoadCard({ load, onChange }) {
  return (
    <section className="section-card">
      <label className="optional-section-toggle">
        <input
          type="checkbox"
          checked={load.enabled}
          onChange={(event) => onChange({ enabled: event.target.checked })}
        />
        <div>
          <h2>Bruk lastdata</h2>
          <p>Aktiveres når faktisk last er kjent og skal brukes som grunnlag.</p>
        </div>
      </label>

      {load.enabled && (
        <div className="section-card-body">
          <div className="form-grid">
            <FormField label="Laststrøm">
              <input
                type="number"
                min="0"
                value={load.loadCurrent}
                onChange={(event) => onChange({ loadCurrent: event.target.value })}
              />
            </FormField>

            <FormField label="cos φ">
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={load.cosPhi}
                onChange={(event) => onChange({ cosPhi: event.target.value })}
              />
            </FormField>
          </div>
        </div>
      )}
    </section>
  )
}
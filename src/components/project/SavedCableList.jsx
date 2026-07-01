export default function SavedCableList({ savedCables, onDelete }) {
  if (savedCables.length === 0) return null

  return (
    <section className="saved-cables-card">
      <h2>Lagrede kabler i prosjektet</h2>

      <div className="saved-cables-list">
        {savedCables.map((item) => (
          <article key={item.id} className="saved-cable-row">
            <div>
              <strong>{item.cable}</strong>
              <span>{item.savedAt}</span>
            </div>

            <div className="saved-cable-statuses">
              <span className={item.currentOk ? 'ok' : 'fail'}>Strømføring</span>
              <span className={item.voltageDropOk === null ? 'neutral' : item.voltageDropOk ? 'ok' : 'fail'}>
                Spenningsfall
              </span>
              <span className={item.shortCircuitOk === null ? 'neutral' : item.shortCircuitOk ? 'ok' : 'fail'}>
                Kortslutning
              </span>
            </div>

            <button type="button" onClick={() => onDelete(item.id)}>
              Slett
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
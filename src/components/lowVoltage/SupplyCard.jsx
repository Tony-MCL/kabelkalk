import SectionCard from '../cards/SectionCard'
import FormField from '../fields/FormField'

function getSourceValueLabel(sourceType) {
  switch (sourceType) {
    case 'transformer':
      return 'Trafostørrelse (kVA)'
    case 'breaker':
      return 'Merkestrøm (A)'
    case 'fuse':
      return 'Sikringsstørrelse (A)'
    case 'motorProtection':
      return 'Innstilt strøm (A)'
    case 'manual':
      return 'Dimensjonerende strøm (A)'
    default:
      return 'Verdi'
  }
}

export default function SupplyCard({ supply, supplySystems, onChange }) {
  const isTransformer = supply.sourceType === 'transformer'

  return (
    <SectionCard title="Forsyning" subtitle="Spenningsnivå og valgt kilde/vern" defaultOpen>
      <div className="three-field-grid">
        <FormField label="Spenningsnivå">
          <select
            value={supply.supplySystemId}
            onChange={(event) => onChange({ supplySystemId: event.target.value })}
          >
            {supplySystems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Kilde / vern">
          <select
            value={supply.sourceType}
            onChange={(event) => onChange({ sourceType: event.target.value })}
          >
            <option value="transformer">Direkte fra trafo</option>
            <option value="breaker">Effektbryter</option>
            <option value="fuse">Sikring</option>
            <option value="motorProtection">Motorvern</option>
            <option value="manual">Manuell verdi</option>
          </select>
        </FormField>

        <FormField label={getSourceValueLabel(supply.sourceType)}>
          <input
            type="number"
            min="0"
            value={isTransformer ? supply.transformerKva : supply.sourceCurrent}
            onChange={(event) =>
              onChange(
                isTransformer
                  ? { transformerKva: event.target.value }
                  : { sourceCurrent: event.target.value }
              )
            }
          />
        </FormField>
      </div>
    </SectionCard>
  )
}
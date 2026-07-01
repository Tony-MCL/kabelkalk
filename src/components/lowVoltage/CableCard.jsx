import SectionCard from '../cards/SectionCard'
import FormField from '../fields/FormField'

export default function CableCard({
  cable,
  cableTypes,
  selectedCableType,
  onChange,
  onCableTypeChange,
}) {
  return (
    <SectionCard
      title="Kabel"
      subtitle="Kabeltype, tverrsnitt, lengde, paralleller og korreksjon"
      defaultOpen
    >
      <div className="form-grid">
        <FormField label="Kabeltype">
          <select
            value={cable.cableTypeId}
            onChange={(event) => onCableTypeChange(event.target.value)}
          >
            {cableTypes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Tverrsnitt">
          <select
            value={cable.area}
            onChange={(event) => onChange({ area: Number(event.target.value) })}
          >
            {selectedCableType.sizes.map((item) => (
              <option key={item.area} value={item.area}>
                {item.area} mm²
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Lengde" helpText="Kabellengde i meter.">
          <input
            type="number"
            min="0"
            value={cable.length}
            onChange={(event) => onChange({ length: event.target.value })}
          />
        </FormField>

        <FormField label="Parallelle kabler">
          <input
            type="number"
            min="1"
            value={cable.parallelCables}
            onChange={(event) => onChange({ parallelCables: event.target.value })}
          />
        </FormField>

        <FormField label="Korreksjonsfaktor">
          <input
            type="number"
            step="0.01"
            min="0"
            value={cable.correctionFactor}
            onChange={(event) => onChange({ correctionFactor: event.target.value })}
          />
        </FormField>

        <FormField label="Kortslutningsstrøm kA">
          <input
            type="number"
            step="0.1"
            min="0"
            value={cable.shortCircuitCurrent}
            onChange={(event) => onChange({ shortCircuitCurrent: event.target.value })}
          />
        </FormField>

        <FormField label="Utkoblingstid s">
          <input
            type="number"
            step="0.1"
            min="0.01"
            value={cable.disconnectionTime}
            onChange={(event) => onChange({ disconnectionTime: event.target.value })}
          />
        </FormField>
      </div>
    </SectionCard>
  )
}
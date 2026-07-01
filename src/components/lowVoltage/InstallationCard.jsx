import SectionCard from '../cards/SectionCard'
import FormField from '../fields/FormField'

export default function InstallationCard({
  installation,
  cableTypes,
  selectedCableType,
  onChange,
  onCableTypeChange,
}) {
  return (
    <SectionCard
      title="Installasjon"
      subtitle="Kabeltype, forlegning og installasjonsforhold"
      defaultOpen
    >
      <div className="installation-grid">
        <FormField label="Kabeltype">
          <select
            value={installation.cableTypeId}
            onChange={(event) => onCableTypeChange(event.target.value)}
          >
            {cableTypes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Lengde">
          <input
            type="number"
            min="0"
            value={installation.length}
            onChange={(event) => onChange({ length: event.target.value })}
          />
        </FormField>

        <FormField label="Forlegning">
          <select
            value={installation.installationMethod}
            onChange={(event) => onChange({ installationMethod: event.target.value })}
          >
            <option value="cableTray">Kabelbro / stige</option>
            <option value="wall">På vegg</option>
            <option value="floor">På gulv</option>
            <option value="conduitAir">Rør / kanal i luft</option>
            <option value="buried">Direkte i jord</option>
            <option value="conduitBuried">Rør i jord</option>
          </select>
        </FormField>

        <FormField label="Omgivelsestemperatur">
          <select
            value={installation.ambientTemperature}
            onChange={(event) => onChange({ ambientTemperature: Number(event.target.value) })}
          >
            <option value={20}>20 °C</option>
            <option value={25}>25 °C</option>
            <option value={30}>30 °C</option>
            <option value={35}>35 °C</option>
            <option value={40}>40 °C</option>
          </select>
        </FormField>

        <FormField label="Tverrsnitt">
          <select
            value={installation.area}
            onChange={(event) => onChange({ area: Number(event.target.value) })}
          >
            {selectedCableType.sizes.map((item) => (
              <option key={item.area} value={item.area}>
                {item.designation ?? `${item.area} mm²`}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Parallelle kabler">
          <input
            type="number"
            min="1"
            value={installation.parallelCables}
            onChange={(event) => onChange({ parallelCables: event.target.value })}
          />
        </FormField>

        <FormField label="Gruppering">
          <select
            value={installation.grouping}
            onChange={(event) => onChange({ grouping: event.target.value })}
          >
            <option value="single">Alene</option>
            <option value="two">2 kabler/grupper</option>
            <option value="three">3 kabler/grupper</option>
            <option value="six">6 kabler/grupper</option>
            <option value="nine">9 kabler/grupper</option>
          </select>
        </FormField>
      </div>
    </SectionCard>
  )
}
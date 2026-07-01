export default function FormField({ label, helpText, children }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      {children}
      {helpText && <small>{helpText}</small>}
    </label>
  )
}
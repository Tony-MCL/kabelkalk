import { useState } from 'react'

export default function SectionCard({ title, subtitle, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <article className="section-card">
      <button type="button" className="section-card-header" onClick={() => setOpen((value) => !value)}>
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <span>{open ? '−' : '+'}</span>
      </button>

      {open && <div className="section-card-body">{children}</div>}
    </article>
  )
}
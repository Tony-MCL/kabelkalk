export default function Toolbar({ left = null, center = null, right = null }) {
  return (
    <nav className="mcl-toolbar no-print">
      <div className="mcl-toolbar-inner">
        <div className="mcl-toolbar-left">{left}</div>
        <div className="mcl-toolbar-center">{center}</div>
        <div className="mcl-toolbar-right">{right}</div>
      </div>
    </nav>
  )
}
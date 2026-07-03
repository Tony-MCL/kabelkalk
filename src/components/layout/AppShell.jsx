import Toolbar from './Toolbar'

export default function AppShell({
  toolbarLeft = null,
  toolbarCenter = null,
  toolbarRight = null,
  children,
}) {
  return (
    <div className="app-shell mcl-shell">
      <header className="mcl-header no-print">
        <div className="mcl-header-inner">
          <div className="mcl-header-brand">
            <img
              src="/managetools_logo.png"
              alt="Manage Tools"
              className="mcl-managetools-logo"
            />
          </div>

          <div className="mcl-header-actions">
            <button type="button" className="mcl-header-link">
              Hjelp
            </button>
          </div>
        </div>
      </header>

      <Toolbar left={toolbarLeft} center={toolbarCenter} right={toolbarRight} />

      <main className="mcl-app-main">
        <div className="mcl-app-viewport">{children}</div>
      </main>

      <footer className="mcl-footer no-print">
        <div className="mcl-footer-inner">
          <span>© 2026 Morning Coffee Labs</span>
          <span>Terms · Privacy</span>
          <span aria-hidden="true">☕</span>
        </div>
      </footer>
    </div>
  )
}
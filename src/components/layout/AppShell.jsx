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
            <div className="mcl-header-logo-mark">☕</div>

            <div>
              <p className="mcl-header-kicker">Morning Coffee Labs</p>
              <h1>Manage Tools</h1>
            </div>
          </div>

          <div className="mcl-header-actions">
            <span className="mcl-plan-pill">Plan: pro</span>
            <button type="button" className="mcl-header-link">Konto</button>
            <button type="button" className="mcl-header-link">Hjelp</button>
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
export default function CalculatorLayout({ left, right }) {
  return (
    <section className="calculator-layout">
      <div className="calculator-left">{left}</div>
      <aside className="calculator-right">{right}</aside>
    </section>
  )
}
import { useState } from 'react'
import Step1 from './components/Step1.jsx'
import Step2 from './components/Step2.jsx'
import Step3 from './components/Step3.jsx'
import { simularInversion } from './utils/calculos.js'

// ── Paleta oficial Invermint ──────────────────────────────────
const C = {
  navy:       '#0D3B50',   // logo oscuro / fondo header
  navyDark:   '#0A2D3E',
  teal:       '#1A7090',   // teal medio
  mint:       '#6EECD4',   // verde menta (accent principal)
  mintDark:   '#4DD4BC',
  mintLight:  '#E8FAF7',   // fondos suaves
  coral:      '#EF7070',   // acento cálido
  bg:         '#F4FAFA',   // fondo general
  text:       '#0D3B50',
}

const DEFAULTS = {
  capitalInicial: 5000000,
  aporteMensual: 1000000,
  horizonte: 5,
  perfil: 'Moderado',
  reinversionPct: 80,
}

const STEPS = ['Tu inversión', 'Simulación', 'Comparativa']

export default function App() {
  const [step, setStep] = useState(1)
  const [inputs, setInputs] = useState(DEFAULTS)
  const [resultados, setResultados] = useState(null)

  function handleSimular(vals) {
    const data = simularInversion(vals)
    setInputs(vals)
    setResultados(data)
    setStep(2)
  }

  function handleInputChange(vals) {
    setInputs(vals)
    if (resultados) setResultados(simularInversion(vals))
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bg }}>

      {/* ── Trust bar ── */}
      <div
        className="text-center py-2 text-xs sm:text-sm font-semibold"
        style={{ backgroundColor: C.mint, color: C.navy }}
      >
        🏠 +1.200 inversores ya hacen crecer su patrimonio con înverMint · Desde $250 USD
      </div>

      {/* ── Header ── */}
      <header style={{ backgroundColor: C.navy }} className="shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <a
            href="https://invermint.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            {/* Logo text con tipografía de marca */}
            <span className="text-2xl font-bold tracking-tight" style={{ color: C.mint }}>
              î<span className="text-white">nver</span>
              <span style={{ color: C.mint }}>Mint</span>
              <span className="text-white">.</span>
            </span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(110,236,212,0.15)', color: C.mint, border: `1px solid ${C.mint}` }}
            >
              Simulador
            </span>
          </a>
          <a
            href="https://invermint.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 text-sm font-bold px-4 py-2 rounded-full transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: C.mint, color: C.navy }}
          >
            Ir al sitio →
          </a>
        </div>
      </header>

      {/* ── Stepper ── */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-0 mb-8">
          {STEPS.map((label, i) => {
            const num = i + 1
            const active = step === num
            const done = step > num
            return (
              <div key={num} className="flex items-center">
                <button
                  onClick={() => done && setStep(num)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 ${
                    active ? 'font-semibold' : done ? 'cursor-pointer hover:opacity-80' : 'opacity-40 cursor-default'
                  }`}
                  style={{ color: active || done ? C.navy : '#9CA3AF' }}
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                    style={{
                      backgroundColor: active ? C.navy : done ? C.mint : '#E5E7EB',
                      color: active ? 'white' : done ? C.navy : '#9CA3AF',
                    }}
                  >
                    {done ? '✓' : num}
                  </span>
                  <span className={`text-sm hidden sm:block ${active ? 'font-semibold' : 'font-medium'}`}>
                    {label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className="w-8 sm:w-16 h-0.5 mx-1 transition-all duration-300"
                    style={{ backgroundColor: done ? C.mint : '#E5E7EB' }}
                  />
                )}
              </div>
            )
          })}
        </div>

        {step === 1 && <Step1 inputs={inputs} onChange={handleInputChange} onNext={handleSimular} />}
        {step === 2 && resultados && (
          <Step2 resultados={resultados} inputs={inputs} onNext={() => setStep(3)} onBack={() => setStep(1)} />
        )}
        {step === 3 && resultados && (
          <Step3 resultados={resultados} inputs={inputs} onBack={() => setStep(2)} />
        )}
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 mt-12 py-8 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm">
            <span className="text-gray-500">🔒 Datos seguros</span>
            <span className="text-gray-500">✅ Sin costos ocultos</span>
            <span className="text-gray-500">🏦 Respaldado por activos reales</span>
          </div>
          <p className="text-gray-400 text-xs">
            © 2025 înverMint · Simulación con fines informativos · No constituye asesoría financiera
          </p>
          <a
            href="https://invermint.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs mt-1 block hover:underline"
            style={{ color: C.teal }}
          >
            invermint.com
          </a>
        </div>
      </footer>
    </div>
  )
}

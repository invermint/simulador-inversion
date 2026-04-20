import { useState } from 'react'
import Step1 from './components/Step1.jsx'
import Step2 from './components/Step2.jsx'
import Step3 from './components/Step3.jsx'
import { simularInversion } from './utils/calculos.js'

const DEFAULTS = {
  capitalInicial: 5000000,
  aporteMensual: 500000,
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
    if (resultados) {
      setResultados(simularInversion(vals))
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#1A5276' }} className="text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold tracking-tight">Invermint</span>
            <span className="ml-2 text-blue-200 text-sm font-medium">Simulador de Inversión</span>
          </div>
          <span className="text-blue-200 text-sm hidden sm:block">Fracciones Inmobiliarias</span>
        </div>
      </header>

      {/* Stepper */}
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
                    active
                      ? 'font-semibold'
                      : done
                      ? 'cursor-pointer hover:opacity-80'
                      : 'opacity-40 cursor-default'
                  }`}
                  style={{ color: active || done ? '#1A5276' : '#9CA3AF' }}
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                    style={{
                      backgroundColor: active ? '#1A5276' : done ? '#27AE60' : '#E5E7EB',
                      color: active || done ? 'white' : '#9CA3AF',
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
                    style={{ backgroundColor: done ? '#27AE60' : '#E5E7EB' }}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Steps */}
        {step === 1 && (
          <Step1
            inputs={inputs}
            onChange={handleInputChange}
            onNext={handleSimular}
          />
        )}
        {step === 2 && resultados && (
          <Step2
            resultados={resultados}
            inputs={inputs}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && resultados && (
          <Step3
            resultados={resultados}
            inputs={inputs}
            onBack={() => setStep(2)}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-xs mt-8">
        <p>© 2025 Invermint · Simulación con fines informativos · No constituye asesoría financiera</p>
      </footer>
    </div>
  )
}

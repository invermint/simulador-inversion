import { useState, useEffect } from 'react'
import { formatCOP } from '../utils/format.js'

const PERFILES = [
  { value: 'Conservador', label: 'Conservador', desc: '12% E.A. · Menor riesgo', icon: '🛡️' },
  { value: 'Moderado',    label: 'Moderado',    desc: '13% E.A. · Balance ideal', icon: '⚖️' },
  { value: 'Crecimiento', label: 'Crecimiento', desc: '15% E.A. · Mayor potencial', icon: '🚀' },
]

const HORIZONTES = [1, 3, 5, 7, 10]

const perfilData = { Conservador: 12, Moderado: 13, Crecimiento: 15 }

export default function Step1({ inputs, onChange, onNext }) {
  const [local, setLocal] = useState(inputs)
  const [errors, setErrors] = useState({})

  useEffect(() => { setLocal(inputs) }, [])

  function update(field, value) {
    const next = { ...local, [field]: value }
    setLocal(next)
    onChange(next)
  }

  function handleMoneyInput(field, raw) {
    const clean = raw.replace(/[^0-9]/g, '')
    update(field, clean === '' ? 0 : parseInt(clean, 10))
  }

  function validate() {
    const errs = {}
    if (!local.capitalInicial || local.capitalInicial < 100000)
      errs.capitalInicial = 'Mínimo $100.000 COP'
    if (local.aporteMensual > 0 && local.aporteMensual < 1000000)
      errs.aporteMensual = 'Mínimo $1.000.000 COP (o $0 si no harás aportes)'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onNext(local)
  }

  // Pérdida por inflación anual sobre el capital ingresado
  const perdidaInflacion = Math.round((local.capitalInicial || 0) * 0.065)

  return (
    <div className="max-w-2xl mx-auto">

      {/* ── Hero headline ── */}
      <div className="text-center mb-8">
        <div
          className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
          style={{ backgroundColor: '#EAFAF1', color: '#1E8449' }}
        >
          🏠 Calculadora gratuita · Sin registro previo
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight" style={{ color: '#1A5276' }}>
          ¿Cuánto puede valer<br className="hidden sm:block" /> tu dinero en bienes raíces?
        </h1>
        <p className="text-gray-500 text-base max-w-md mx-auto">
          Simula tu crecimiento patrimonial en segundos y compara contra un CDT.
        </p>
      </div>

      {/* ── Alerta de inflación (loss aversion) ── */}
      {(local.capitalInicial || 0) >= 100000 && (
        <div
          className="rounded-xl px-4 py-3 mb-6 flex items-start gap-3 text-sm"
          style={{ backgroundColor: '#FEF9E7', borderLeft: '4px solid #F39C12' }}
        >
          <span className="text-xl">⚠️</span>
          <p className="text-yellow-800">
            <strong>La inflación (6.5% anual) le está quitando {formatCOP(perdidaInflacion)} a tu capital este año.</strong>
            {' '}Invertir es la única forma de proteger tu patrimonio.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Capital inicial */}
        <div className="card">
          <label className="label">Capital inicial a invertir</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
            <input
              type="text"
              inputMode="numeric"
              className="input-field pl-8"
              value={local.capitalInicial ? local.capitalInicial.toLocaleString('es-CO') : ''}
              onChange={e => handleMoneyInput('capitalInicial', e.target.value)}
              placeholder="5.000.000"
            />
          </div>
          {errors.capitalInicial
            ? <p className="text-red-500 text-xs mt-1">{errors.capitalInicial}</p>
            : <p className="text-xs text-gray-400 mt-1">Mínimo $100.000 COP · Equivale a ~$250 USD</p>
          }
        </div>

        {/* Aportes mensuales */}
        <div className="card">
          <label className="label">Aportes mensuales adicionales</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
            <input
              type="text"
              inputMode="numeric"
              className="input-field pl-8"
              value={local.aporteMensual ? local.aporteMensual.toLocaleString('es-CO') : ''}
              onChange={e => handleMoneyInput('aporteMensual', e.target.value)}
              placeholder="1.000.000"
            />
          </div>
          {errors.aporteMensual
            ? <p className="text-red-500 text-xs mt-1">{errors.aporteMensual}</p>
            : <p className="text-xs text-gray-400 mt-1">Mínimo $1.000.000 COP · Escribe 0 si no harás aportes periódicos</p>
          }
        </div>

        {/* Horizonte */}
        <div className="card">
          <label className="label">¿En cuánto tiempo quieres ver resultados?</label>
          <div className="flex gap-2 flex-wrap">
            {HORIZONTES.map(h => (
              <button
                type="button"
                key={h}
                onClick={() => update('horizonte', h)}
                className="flex-1 min-w-[60px] py-3 rounded-xl font-semibold text-sm border-2 transition-all duration-200"
                style={{
                  borderColor: local.horizonte === h ? '#1A5276' : '#E5E7EB',
                  backgroundColor: local.horizonte === h ? '#1A5276' : 'white',
                  color: local.horizonte === h ? 'white' : '#6B7280',
                }}
              >
                {h} {h === 1 ? 'año' : 'años'}
              </button>
            ))}
          </div>
        </div>

        {/* Perfil de riesgo */}
        <div className="card">
          <label className="label">Perfil de riesgo</label>
          <div className="space-y-2">
            {PERFILES.map(p => (
              <button
                type="button"
                key={p.value}
                onClick={() => update('perfil', p.value)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200 text-left"
                style={{
                  borderColor: local.perfil === p.value ? '#1A5276' : '#E5E7EB',
                  backgroundColor: local.perfil === p.value ? '#EBF5FB' : 'white',
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{p.icon}</span>
                  <div>
                    <span className="font-semibold text-gray-800">{p.label}</span>
                    <span className="ml-2 text-gray-500 text-sm">{p.desc}</span>
                  </div>
                </div>
                <span
                  className="font-bold text-lg"
                  style={{ color: local.perfil === p.value ? '#1A5276' : '#9CA3AF' }}
                >
                  {perfilData[p.value]}%
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            📈 Incluye arriendo + valorización del inmueble · Efectivo anual
          </p>
        </div>

        {/* % Reinversión */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <label className="label mb-0">% Rendimientos reinvertidos</label>
              <p className="text-xs text-gray-400 mt-0.5">El resto lo recibes como ingreso pasivo mensual</p>
            </div>
            <span className="text-2xl font-bold" style={{ color: '#1A5276' }}>
              {local.reinversionPct}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={local.reinversionPct}
            onChange={e => update('reinversionPct', Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #1A5276 ${local.reinversionPct}%, #E5E7EB ${local.reinversionPct}%)`,
              accentColor: '#1A5276',
            }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0% · Retiras todo</span>
            <span>100% · Máximo crecimiento</span>
          </div>
        </div>

        {/* Resumen + CTA */}
        <div
          className="rounded-xl px-5 py-4 text-sm mb-2"
          style={{ backgroundColor: '#EBF5FB', borderLeft: '4px solid #1A5276' }}
        >
          <p className="font-semibold" style={{ color: '#1A5276' }}>Tu simulación incluirá:</p>
          <ul className="text-gray-600 mt-1 space-y-0.5">
            <li>✓ Proyección año a año de tu portafolio</li>
            <li>✓ Comparativa directa vs CDT tradicional</li>
            <li>✓ Cuánto más ganarías con Invermint</li>
          </ul>
        </div>

        <button type="submit" className="btn-primary w-full text-lg py-4 rounded-xl">
          Calcular mi proyección →
        </button>

        <p className="text-center text-xs text-gray-400">
          🔒 Sin compromiso · Resultado en segundos · Gratis
        </p>
      </form>
    </div>
  )
}

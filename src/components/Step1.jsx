import { useState, useEffect } from 'react'
import { formatCOP } from '../utils/format.js'

const PERFILES = [
  { value: 'Conservador', label: 'Conservador', desc: '10% anual · Menor riesgo' },
  { value: 'Moderado',    label: 'Moderado',    desc: '11% anual · Balance ideal' },
  { value: 'Crecimiento', label: 'Crecimiento', desc: '12% anual · Mayor potencial' },
]

const HORIZONTES = [1, 3, 5, 7, 10]

export default function Step1({ inputs, onChange, onNext }) {
  const [local, setLocal] = useState(inputs)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setLocal(inputs)
  }, [])

  function update(field, value) {
    const next = { ...local, [field]: value }
    setLocal(next)
    onChange(next)
  }

  function handleMoneyInput(field, raw) {
    const clean = raw.replace(/[^0-9]/g, '')
    const num = clean === '' ? 0 : parseInt(clean, 10)
    update(field, num)
  }

  function validate() {
    const errs = {}
    if (!local.capitalInicial || local.capitalInicial < 100000) {
      errs.capitalInicial = 'Mínimo $100.000 COP'
    }
    if (local.aporteMensual < 0) {
      errs.aporteMensual = 'No puede ser negativo'
    }
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onNext(local)
  }

  const perfilData = { Conservador: 10, Moderado: 11, Crecimiento: 12 }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1A5276' }}>
          Simula tu inversión
        </h1>
        <p className="text-gray-500 text-base">
          Ingresa tus datos para ver cómo crece tu dinero con fracciones inmobiliarias
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Capital inicial */}
        <div className="card">
          <label className="label">Capital inicial</label>
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
          {errors.capitalInicial && (
            <p className="text-red-500 text-xs mt-1">{errors.capitalInicial}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">Mínimo $100.000 COP · Valor en pesos colombianos</p>
        </div>

        {/* Aportes mensuales */}
        <div className="card">
          <label className="label">Aportes mensuales</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
            <input
              type="text"
              inputMode="numeric"
              className="input-field pl-8"
              value={local.aporteMensual ? local.aporteMensual.toLocaleString('es-CO') : ''}
              onChange={e => handleMoneyInput('aporteMensual', e.target.value)}
              placeholder="500.000"
            />
          </div>
          {errors.aporteMensual && (
            <p className="text-red-500 text-xs mt-1">{errors.aporteMensual}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">Puedes poner 0 si no harás aportes periódicos</p>
        </div>

        {/* Horizonte */}
        <div className="card">
          <label className="label">Horizonte de inversión</label>
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
                <div>
                  <span className="font-semibold text-gray-800">{p.label}</span>
                  <span className="ml-2 text-gray-500 text-sm">{p.desc}</span>
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
        </div>

        {/* % Reinversión */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <label className="label mb-0">% Rendimientos reinvertidos</label>
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
            <span>0% · Retiro total</span>
            <span>100% · Reinversión total</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            El {100 - local.reinversionPct}% de los arriendos lo recibirías como ingreso mensual
          </p>
        </div>

        {/* Resumen rápido */}
        <div
          className="rounded-xl px-5 py-4 text-sm"
          style={{ backgroundColor: '#EBF5FB', borderLeft: '4px solid #1A5276' }}
        >
          <p className="font-semibold" style={{ color: '#1A5276' }}>Resumen de tu inversión</p>
          <p className="text-gray-600 mt-1">
            Capital inicial de <strong>{formatCOP(local.capitalInicial || 0)}</strong> con aportes de{' '}
            <strong>{formatCOP(local.aporteMensual || 0)}/mes</strong> durante{' '}
            <strong>{local.horizonte} {local.horizonte === 1 ? 'año' : 'años'}</strong> en perfil{' '}
            <strong>{local.perfil}</strong>.
          </p>
        </div>

        <button type="submit" className="btn-primary w-full text-lg py-4">
          Ver simulación →
        </button>
      </form>
    </div>
  )
}

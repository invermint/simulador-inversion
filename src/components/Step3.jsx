import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'
import { formatCOP, formatPct } from '../utils/format.js'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <strong>{formatCOP(p.value)}</strong>
        </p>
      ))}
    </div>
  )
}

export default function Step3({ resultados, inputs, onBack }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [emailError, setEmailError] = useState('')

  const { inversion, cdt, capitalInvertido, timeline } = resultados

  const chartData = timeline.map(t => ({
    año: `Año ${t.año}`,
    'Fracciones Invermint': t.portafolio,
    'CDT': t.cdt,
  }))

  const tableRows = [
    { label: 'Valor final',       inv: formatCOP(inversion.valorFinal),    cdtVal: formatCOP(cdt.valorFinal) },
    { label: 'Ganancia total',    inv: formatCOP(inversion.gananciaTotal),  cdtVal: formatCOP(cdt.gananciaTotal) },
    { label: 'Retorno total',     inv: formatPct(inversion.retornoPct),     cdtVal: formatPct(cdt.retornoPct) },
    { label: 'Tasa real anual',   inv: formatPct(inversion.tasaRealAnual),  cdtVal: formatPct(cdt.tasaRealAnual) },
    { label: 'Valorización',      inv: formatPct(inversion.valorizacion),   cdtVal: '0.0%' },
    { label: 'Fuentes de retorno', inv: 'Arriendo + Valorización',          cdtVal: 'Intereses' },
  ]

  function handleLead(e) {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Ingresa un correo válido')
      return
    }
    setSent(true)
  }

  const ganaMas = inversion.valorFinal > cdt.valorFinal
  const diferencia = Math.abs(inversion.valorFinal - cdt.valorFinal)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold" style={{ color: '#1A5276' }}>Comparativa final</h2>
        <p className="text-gray-500 text-sm mt-1">
          Fracciones Invermint vs CDT · {inputs.horizonte} {inputs.horizonte === 1 ? 'año' : 'años'}
        </p>
      </div>

      {/* 2 cards comparativas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* CDT */}
        <div className="card border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-bold text-gray-700 text-lg">CDT</p>
              <p className="text-xs text-gray-400">Certificado de Depósito</p>
            </div>
            <span className="text-2xl">🏦</span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Valor final</p>
              <p className="text-2xl font-bold text-gray-700">{formatCOP(cdt.valorFinal)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Ganancia</p>
              <p className="text-lg font-semibold text-gray-600">{formatCOP(cdt.gananciaTotal)}</p>
            </div>
            <div className="flex gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-400">Tasa neta</p>
                <p className="font-bold text-gray-700">{formatPct(cdt.tasaNeta)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Retención</p>
                <p className="font-bold text-gray-700">{formatPct(cdt.retencion)}</p>
              </div>
            </div>
            <div
              className="rounded-lg px-3 py-2 text-xs font-medium text-center"
              style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
            >
              Solo intereses · Sin valorización
            </div>
          </div>
        </div>

        {/* Fracciones Invermint */}
        <div
          className="card border-2 relative overflow-hidden"
          style={{ borderColor: '#27AE60' }}
        >
          {ganaMas && (
            <div
              className="absolute top-0 right-0 text-white text-xs font-bold px-3 py-1 rounded-bl-xl"
              style={{ backgroundColor: '#27AE60' }}
            >
              ✓ MEJOR OPCIÓN
            </div>
          )}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-bold text-lg" style={{ color: '#1A5276' }}>Fracciones Invermint</p>
              <p className="text-xs text-gray-400">Inversión inmobiliaria fraccionada</p>
            </div>
            <span className="text-2xl">🏠</span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Valor final</p>
              <p className="text-2xl font-bold" style={{ color: '#27AE60' }}>{formatCOP(inversion.valorFinal)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Ganancia</p>
              <p className="text-lg font-semibold" style={{ color: '#1A5276' }}>{formatCOP(inversion.gananciaTotal)}</p>
            </div>
            <div className="flex gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-400">Tasa total</p>
                <p className="font-bold" style={{ color: '#1A5276' }}>{formatPct(inversion.tasaTotal)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Perfil</p>
                <p className="font-bold" style={{ color: '#1A5276' }}>{inputs.perfil}</p>
              </div>
            </div>
            <div
              className="rounded-lg px-3 py-2 text-xs font-medium text-center"
              style={{ backgroundColor: '#EAFAF1', color: '#1E8449' }}
            >
              Arriendo + Valorización · Doble fuente
            </div>
          </div>
        </div>
      </div>

      {/* Diferencia highlight */}
      {ganaMas && (
        <div
          className="rounded-2xl p-4 text-center border-2"
          style={{ backgroundColor: '#EAFAF1', borderColor: '#27AE60' }}
        >
          <p className="text-lg font-bold" style={{ color: '#1E8449' }}>
            Con Invermint ganarías <span className="text-2xl">{formatCOP(diferencia)}</span> más que con un CDT
          </p>
          <p className="text-sm text-gray-500 mt-1">
            En {inputs.horizonte} {inputs.horizonte === 1 ? 'año' : 'años'} de inversión con perfil {inputs.perfil}
          </p>
        </div>
      )}

      {/* Tabla comparativa */}
      <div className="card overflow-hidden p-0">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-700">Tabla comparativa</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#F8F9FA' }}>
                <th className="text-left px-6 py-3 text-gray-500 font-semibold">Indicador</th>
                <th className="text-right px-4 py-3 text-gray-500 font-semibold">CDT</th>
                <th className="text-right px-6 py-3 font-semibold" style={{ color: '#1A5276' }}>
                  Fracciones Invermint
                </th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : ''} style={{ backgroundColor: i % 2 !== 0 ? '#F8F9FA' : 'white' }}>
                  <td className="px-6 py-3 text-gray-600 font-medium">{row.label}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{row.cdtVal}</td>
                  <td className="px-6 py-3 text-right font-semibold" style={{ color: '#1A5276' }}>
                    {row.inv}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Timeline año a año */}
      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-700">Evolución año a año</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#F8F9FA' }}>
                <th className="text-left px-6 py-3 text-gray-500 font-semibold">Año</th>
                <th className="text-right px-4 py-3 text-gray-500 font-semibold">CDT</th>
                <th className="text-right px-4 py-3 font-semibold" style={{ color: '#1A5276' }}>Invermint</th>
                <th className="text-right px-6 py-3 font-semibold" style={{ color: '#27AE60' }}>Diferencia</th>
              </tr>
            </thead>
            <tbody>
              {resultados.timeline.map((row, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 !== 0 ? '#F8F9FA' : 'white' }}>
                  <td className="px-6 py-3 text-gray-600 font-medium">Año {row.año}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{formatCOP(row.cdt)}</td>
                  <td className="px-4 py-3 text-right font-semibold" style={{ color: '#1A5276' }}>
                    {formatCOP(row.portafolio)}
                  </td>
                  <td
                    className="px-6 py-3 text-right font-bold"
                    style={{ color: row.diferencia >= 0 ? '#27AE60' : '#E74C3C' }}
                  >
                    {row.diferencia >= 0 ? '+' : ''}{formatCOP(row.diferencia)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gráfica comparativa */}
      <div className="card">
        <h3 className="font-semibold text-gray-700 mb-4">Crecimiento comparativo</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
            <XAxis
              dataKey="año"
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={v => {
                if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`
                if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(0)}M`
                return `$${(v / 1000).toFixed(0)}K`
              }}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span style={{ color: '#6B7280', fontSize: '12px' }}>{value}</span>
              )}
            />
            <Bar dataKey="CDT" fill="#94A3B8" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="Fracciones Invermint" fill="#1A5276" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* CTA Lead capture */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{ background: 'linear-gradient(135deg, #1A5276 0%, #154360 100%)' }}
      >
        {!sent ? (
          <>
            <p className="text-white text-xl font-bold mb-1">¿Listo para invertir?</p>
            <p className="text-blue-200 text-sm mb-5">
              Únete a los inversionistas que ya están haciendo crecer su patrimonio con Invermint
            </p>
            <form onSubmit={handleLead} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailError('') }}
                  placeholder="tucorreo@ejemplo.com"
                  className="flex-1 rounded-xl px-4 py-3 text-gray-800 font-medium focus:outline-none focus:ring-2 text-sm"
                  style={{ focusRingColor: '#27AE60' }}
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl font-bold text-white text-sm transition-all duration-200 hover:opacity-90 active:scale-95 whitespace-nowrap"
                  style={{ backgroundColor: '#27AE60' }}
                >
                  Quiero empezar →
                </button>
              </div>
              {emailError && <p className="text-red-300 text-xs mt-2">{emailError}</p>}
            </form>
            <p className="text-blue-300 text-xs mt-4">Sin spam · Cancelá cuando quieras</p>
          </>
        ) : (
          <div className="py-4">
            <div className="text-5xl mb-3">🎉</div>
            <p className="text-white text-xl font-bold">¡Gracias por tu interés!</p>
            <p className="text-blue-200 text-sm mt-2">
              Un asesor de Invermint se pondrá en contacto contigo en las próximas 24 horas.
            </p>
          </div>
        )}
      </div>

      {/* Back */}
      <div className="flex justify-start">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl border-2 font-semibold text-sm transition-all duration-200 hover:bg-gray-50"
          style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
        >
          ← Volver a simulación
        </button>
      </div>
    </div>
  )
}

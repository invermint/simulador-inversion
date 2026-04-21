import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { formatCOP, formatPct } from '../utils/format.js'

const C = { navy: '#0D3B50', mint: '#6EECD4', mintLight: '#E8FAF7', teal: '#1A7090', coral: '#EF7070' }

// ── Actualizar con el número real de WhatsApp ──
const WA = `https://wa.me/573228229244?text=${encodeURIComponent(
  '¡Hola! Acabo de usar el simulador de înverMint y me interesa conocer más sobre cómo invertir en fracciones inmobiliarias. 🏠'
)}`

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold mb-2" style={{ color: C.navy }}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.name}: <strong>{formatCOP(p.value)}</strong></p>
      ))}
    </div>
  )
}

const TESTIMONIOS = [
  {
    nombre: 'Carolina M.',
    ciudad: 'Bogotá',
    texto: '"Empecé con $5 millones y en 2 años tengo un portafolio diversificado. La rentabilidad superó mis expectativas."',
  },
  {
    nombre: 'Andrés P.',
    ciudad: 'Medellín',
    texto: '"Gracias a înverMint pude acceder a bienes raíces que solo pensaba para personas con mucho capital."',
  },
]

export default function Step3({ resultados, inputs, onBack }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [emailError, setEmailError] = useState('')

  const { inversion, cdt, capitalInvertido, timeline } = resultados
  const ganaMas = inversion.valorFinal > cdt.valorFinal
  const diferencia = Math.abs(inversion.valorFinal - cdt.valorFinal)

  const chartData = timeline.map(t => ({
    año: `Año ${t.año}`,
    'Fracciones înverMint': t.portafolio,
    'CDT': t.cdt,
  }))

  const tableRows = [
    { label: 'Valor final',         inv: formatCOP(inversion.valorFinal),   cdtVal: formatCOP(cdt.valorFinal) },
    { label: 'Ganancia total',      inv: formatCOP(inversion.gananciaTotal), cdtVal: formatCOP(cdt.gananciaTotal) },
    { label: 'Retorno total',       inv: formatPct(inversion.retornoPct),    cdtVal: formatPct(cdt.retornoPct) },
    { label: 'Tasa real anual',     inv: formatPct(inversion.tasaRealAnual), cdtVal: formatPct(cdt.tasaRealAnual) },
    { label: 'Valorización',        inv: formatPct(inversion.valorizacion),  cdtVal: '0.0%' },
    { label: 'Fuentes de retorno',  inv: 'Arriendo + Valorización',          cdtVal: 'Solo intereses' },
  ]

  function handleLead(e) {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Ingresa un correo válido')
      return
    }
    setSent(true)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Headline */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: C.navy }}>
          înverMint vs CDT · Tu comparativa
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {inputs.horizonte} {inputs.horizonte === 1 ? 'año' : 'años'} · Perfil {inputs.perfil}
        </p>
      </div>

      {/* 2 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* CDT */}
        <div className="card border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-bold text-gray-700 text-lg">CDT Bancario</p>
              <p className="text-xs text-gray-400">Tasa neta {formatPct(cdt.tasaNeta)} E.A.</p>
            </div>
            <span className="text-3xl">🏦</span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Valor final</p>
              <p className="text-2xl font-bold text-gray-600">{formatCOP(cdt.valorFinal)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Ganancia</p>
              <p className="text-lg font-semibold text-gray-500">{formatCOP(cdt.gananciaTotal)}</p>
            </div>
            <div className="rounded-lg px-3 py-2 text-xs font-medium text-center bg-gray-100 text-gray-500">
              ❌ Sin valorización · Retención 7%
            </div>
          </div>
        </div>

        {/* Invermint */}
        <div className="card border-2 relative overflow-hidden" style={{ borderColor: C.mint }}>
          {ganaMas && (
            <div
              className="absolute top-0 right-0 text-xs font-bold px-3 py-1 rounded-bl-xl"
              style={{ backgroundColor: C.mint, color: C.navy }}
            >
              ✓ MEJOR OPCIÓN
            </div>
          )}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-bold text-lg" style={{ color: C.navy }}>Fracciones înverMint</p>
              <p className="text-xs text-gray-400">{formatPct(inversion.tasaTotal)} E.A. · Arriendo + Valorización</p>
            </div>
            <span className="text-3xl">🏠</span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Valor final</p>
              <p className="text-2xl font-bold" style={{ color: C.teal }}>{formatCOP(inversion.valorFinal)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Ganancia</p>
              <p className="text-lg font-semibold" style={{ color: C.navy }}>{formatCOP(inversion.gananciaTotal)}</p>
            </div>
            <div
              className="rounded-lg px-3 py-2 text-xs font-medium text-center"
              style={{ backgroundColor: C.mintLight, color: C.teal }}
            >
              ✅ Arriendo + Valorización · Doble fuente
            </div>
          </div>
        </div>
      </div>

      {/* Diferencia */}
      {ganaMas && (
        <div
          className="rounded-2xl p-5 text-center border-2"
          style={{ backgroundColor: C.mintLight, borderColor: C.mint }}
        >
          <p className="text-base text-gray-600">Con înverMint ganarías</p>
          <p className="text-4xl font-bold my-1" style={{ color: C.teal }}>{formatCOP(diferencia)} más</p>
          <p className="text-sm text-gray-500">
            que con un CDT en {inputs.horizonte} {inputs.horizonte === 1 ? 'año' : 'años'} · Perfil {inputs.perfil}
          </p>
        </div>
      )}

      {/* Gráfica comparativa */}
      <div className="card">
        <h3 className="font-semibold mb-4" style={{ color: C.navy }}>Crecimiento comparativo</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
            <XAxis dataKey="año" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={v => {
                if (v >= 1e9) return `$${(v/1e9).toFixed(1)}B`
                if (v >= 1e6) return `$${(v/1e6).toFixed(0)}M`
                return `$${(v/1000).toFixed(0)}K`
              }}
              tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={v => <span style={{ color: '#6B7280', fontSize: '12px' }}>{v}</span>} />
            <Bar dataKey="CDT" fill="#CBD5E1" radius={[4,4,0,0]} maxBarSize={40} />
            <Bar dataKey="Fracciones înverMint" fill={C.navy} radius={[4,4,0,0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla comparativa */}
      <div className="card overflow-hidden p-0">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold" style={{ color: C.navy }}>Comparativa detallada</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#F8F9FA' }}>
                <th className="text-left px-6 py-3 text-gray-500 font-semibold">Indicador</th>
                <th className="text-right px-4 py-3 text-gray-500 font-semibold">CDT</th>
                <th className="text-right px-6 py-3 font-semibold" style={{ color: C.navy }}>înverMint</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 !== 0 ? '#F8F9FA' : 'white' }}>
                  <td className="px-6 py-3 text-gray-600 font-medium">{row.label}</td>
                  <td className="px-4 py-3 text-right text-gray-400">{row.cdtVal}</td>
                  <td className="px-6 py-3 text-right font-semibold" style={{ color: C.teal }}>{row.inv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Timeline */}
      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold" style={{ color: C.navy }}>Evolución año a año</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#F8F9FA' }}>
                <th className="text-left px-6 py-3 text-gray-500 font-semibold">Año</th>
                <th className="text-right px-4 py-3 text-gray-500 font-semibold">CDT</th>
                <th className="text-right px-4 py-3 font-semibold" style={{ color: C.navy }}>înverMint</th>
                <th className="text-right px-6 py-3 font-semibold" style={{ color: C.teal }}>Diferencia</th>
              </tr>
            </thead>
            <tbody>
              {resultados.timeline.map((row, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 !== 0 ? '#F8F9FA' : 'white' }}>
                  <td className="px-6 py-3 text-gray-600 font-medium">Año {row.año}</td>
                  <td className="px-4 py-3 text-right text-gray-400">{formatCOP(row.cdt)}</td>
                  <td className="px-4 py-3 text-right font-semibold" style={{ color: C.navy }}>{formatCOP(row.portafolio)}</td>
                  <td
                    className="px-6 py-3 text-right font-bold"
                    style={{ color: row.diferencia >= 0 ? C.teal : C.coral }}
                  >
                    {row.diferencia >= 0 ? '+' : ''}{formatCOP(row.diferencia)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Testimonios */}
      <div>
        <h3 className="font-semibold mb-3 text-center" style={{ color: C.navy }}>Lo que dicen nuestros inversores</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TESTIMONIOS.map((t, i) => (
            <div key={i} className="card border-l-4" style={{ borderColor: C.mint }}>
              <p className="text-sm mb-2" style={{ color: C.mint }}>★★★★★</p>
              <p className="text-gray-600 text-sm italic">{t.texto}</p>
              <p className="text-xs font-semibold mt-3" style={{ color: C.navy }}>{t.nombre} · {t.ciudad}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Principal */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{ background: `linear-gradient(135deg, ${C.navy} 0%, #0A2D3E 100%)` }}
      >
        <div
          className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4"
          style={{ backgroundColor: C.coral, color: 'white' }}
        >
          🔥 Cupos limitados para nuevos inversores este mes
        </div>
        <p className="text-white text-2xl font-bold mb-1">¿Listo para invertir?</p>
        <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: C.mint }}>
          Habla con un asesor ahora y empieza desde <strong className="text-white">$250 USD</strong>.
          Sin letra pequeña.
        </p>

        {/* WhatsApp — CTA principal */}
        <a
          href={WA}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full max-w-sm mx-auto py-4 rounded-xl font-bold text-white text-lg transition-all duration-200 hover:opacity-90 active:scale-95 mb-3"
          style={{ backgroundColor: '#25D366' }}
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white flex-none">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Hablar con un asesor por WhatsApp
        </a>

        {/* Agenda reunión */}
        <a
          href="https://invermint.com"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-sm mb-5 transition-colors hover:text-white"
          style={{ color: C.mint }}
        >
          O agenda una reunión en invermint.com →
        </a>

        {/* Email (secundario) */}
        <div className="border-t pt-5" style={{ borderColor: 'rgba(110,236,212,0.2)' }}>
          <p className="text-xs mb-3" style={{ color: C.mint }}>¿Prefieres que te contactemos?</p>
          {!sent ? (
            <form onSubmit={handleLead} className="max-w-sm mx-auto">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailError('') }}
                  placeholder="tucorreo@ejemplo.com"
                  className="flex-1 rounded-xl px-4 py-3 text-gray-800 font-medium focus:outline-none text-sm"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all hover:opacity-90"
                  style={{ backgroundColor: C.mint, color: C.navy }}
                >
                  Enviar →
                </button>
              </div>
              {emailError && <p className="text-red-300 text-xs mt-1">{emailError}</p>}
            </form>
          ) : (
            <p className="font-semibold text-sm" style={{ color: C.mint }}>
              ✅ ¡Recibido! Te contactaremos pronto.
            </p>
          )}
        </div>
        <p className="text-xs mt-4" style={{ color: 'rgba(110,236,212,0.6)' }}>🔒 Tus datos están seguros · Sin spam</p>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-3 text-center text-xs text-gray-500">
        {[
          { icon: '🏦', title: 'Activos reales', desc: 'Propiedades físicas' },
          { icon: '📈', title: '+1.200 inversores', desc: 'Confían en înverMint' },
          { icon: '💸', title: 'Desde $250 USD', desc: 'Accesible para todos' },
        ].map((b, i) => (
          <div key={i} className="card py-3">
            <div className="text-2xl mb-1">{b.icon}</div>
            <p className="font-semibold" style={{ color: C.navy }}>{b.title}</p>
            <p>{b.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-start">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl border-2 font-semibold text-sm transition-all hover:bg-gray-50"
          style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
        >
          ← Volver a simulación
        </button>
      </div>
    </div>
  )
}

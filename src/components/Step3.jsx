import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'
import { formatCOP, formatPct } from '../utils/format.js'

// ── Número de WhatsApp de Invermint (actualizar con el real) ──
const WHATSAPP_NUMBER = '573000000000'
const WHATSAPP_MSG = encodeURIComponent(
  '¡Hola! Acabo de usar el simulador de Invermint y me interesa conocer más sobre cómo invertir en fracciones inmobiliarias. 🏠'
)

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

const TESTIMONIOS = [
  {
    nombre: 'Carolina M.',
    ciudad: 'Bogotá',
    texto: '"Empecé con $5 millones y en 2 años ya tengo un portafolio diversificado. La rentabilidad superó mis expectativas."',
    stars: 5,
  },
  {
    nombre: 'Andrés P.',
    ciudad: 'Medellín',
    texto: '"Lo que más me gustó fue poder empezar pequeño. Invermint me dio acceso a bienes raíces que nunca hubiera podido comprar solo."',
    stars: 5,
  },
]

export default function Step3({ resultados, inputs, onBack }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [emailError, setEmailError] = useState('')

  const { inversion, cdt, capitalInvertido, timeline } = resultados
  const diferencia = Math.abs(inversion.valorFinal - cdt.valorFinal)
  const ganaMas = inversion.valorFinal > cdt.valorFinal

  const chartData = timeline.map(t => ({
    año: `Año ${t.año}`,
    'Fracciones Invermint': t.portafolio,
    'CDT': t.cdt,
  }))

  const tableRows = [
    { label: 'Valor final',        inv: formatCOP(inversion.valorFinal),   cdtVal: formatCOP(cdt.valorFinal) },
    { label: 'Ganancia total',     inv: formatCOP(inversion.gananciaTotal), cdtVal: formatCOP(cdt.gananciaTotal) },
    { label: 'Retorno total',      inv: formatPct(inversion.retornoPct),    cdtVal: formatPct(cdt.retornoPct) },
    { label: 'Tasa real anual',    inv: formatPct(inversion.tasaRealAnual), cdtVal: formatPct(cdt.tasaRealAnual) },
    { label: 'Valorización',       inv: formatPct(inversion.valorizacion),  cdtVal: '0.0%' },
    { label: 'Fuentes de retorno', inv: 'Arriendo + Valorización',          cdtVal: 'Solo intereses' },
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

      {/* ── Headline de resultado ── */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#1A5276' }}>
          Invermint vs CDT · Tu comparativa
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {inputs.horizonte} {inputs.horizonte === 1 ? 'año' : 'años'} · Perfil {inputs.perfil}
        </p>
      </div>

      {/* ── 2 cards lado a lado ── */}
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
        <div className="card border-2 relative overflow-hidden" style={{ borderColor: '#27AE60' }}>
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
              <p className="text-xs text-gray-400">{formatPct(inversion.tasaTotal)} E.A. · Arriendo + Valorización</p>
            </div>
            <span className="text-3xl">🏠</span>
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
            <div
              className="rounded-lg px-3 py-2 text-xs font-medium text-center"
              style={{ backgroundColor: '#EAFAF1', color: '#1E8449' }}
            >
              ✅ Arriendo + Valorización · Doble fuente
            </div>
          </div>
        </div>
      </div>

      {/* ── Diferencia destacada ── */}
      {ganaMas && (
        <div
          className="rounded-2xl p-5 text-center border-2"
          style={{ backgroundColor: '#EAFAF1', borderColor: '#27AE60' }}
        >
          <p className="text-base text-gray-600">Con Invermint ganarías</p>
          <p className="text-4xl font-bold my-1" style={{ color: '#1E8449' }}>
            {formatCOP(diferencia)} más
          </p>
          <p className="text-sm text-gray-500">
            que con un CDT en {inputs.horizonte} {inputs.horizonte === 1 ? 'año' : 'años'} · Perfil {inputs.perfil}
          </p>
        </div>
      )}

      {/* ── Gráfica comparativa ── */}
      <div className="card">
        <h3 className="font-semibold text-gray-700 mb-4">Crecimiento comparativo año a año</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
            <XAxis dataKey="año" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
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
            <Legend formatter={v => <span style={{ color: '#6B7280', fontSize: '12px' }}>{v}</span>} />
            <Bar dataKey="CDT" fill="#94A3B8" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="Fracciones Invermint" fill="#1A5276" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Tabla comparativa ── */}
      <div className="card overflow-hidden p-0">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-700">Tabla comparativa detallada</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#F8F9FA' }}>
                <th className="text-left px-6 py-3 text-gray-500 font-semibold">Indicador</th>
                <th className="text-right px-4 py-3 text-gray-500 font-semibold">CDT</th>
                <th className="text-right px-6 py-3 font-semibold" style={{ color: '#1A5276' }}>Invermint</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 !== 0 ? '#F8F9FA' : 'white' }}>
                  <td className="px-6 py-3 text-gray-600 font-medium">{row.label}</td>
                  <td className="px-4 py-3 text-right text-gray-400">{row.cdtVal}</td>
                  <td className="px-6 py-3 text-right font-semibold" style={{ color: '#1A5276' }}>{row.inv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Timeline año a año ── */}
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
                  <td className="px-4 py-3 text-right text-gray-400">{formatCOP(row.cdt)}</td>
                  <td className="px-4 py-3 text-right font-semibold" style={{ color: '#1A5276' }}>{formatCOP(row.portafolio)}</td>
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

      {/* ── Testimonios ── */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3 text-center">Lo que dicen nuestros inversores</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TESTIMONIOS.map((t, i) => (
            <div key={i} className="card border-l-4" style={{ borderColor: '#27AE60' }}>
              <p className="text-yellow-400 text-sm mb-2">{'★'.repeat(t.stars)}</p>
              <p className="text-gray-600 text-sm italic">{t.texto}</p>
              <p className="text-xs font-semibold mt-3" style={{ color: '#1A5276' }}>
                {t.nombre} · {t.ciudad}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA Principal: WhatsApp + urgencia ── */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{ background: 'linear-gradient(135deg, #1A5276 0%, #154360 100%)' }}
      >
        <div
          className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4"
          style={{ backgroundColor: '#27AE60', color: 'white' }}
        >
          🔥 Cupos limitados para nuevos inversores este mes
        </div>

        <p className="text-white text-2xl font-bold mb-1">¿Listo para invertir?</p>
        <p className="text-blue-200 text-sm mb-6 max-w-sm mx-auto">
          Habla con un asesor ahora y empieza desde <strong className="text-white">$250 USD</strong>.
          Sin letra pequeña, sin compromisos.
        </p>

        {/* WhatsApp CTA (principal) */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
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

        {/* Agenda reunión (secundario) */}
        <a
          href="https://invermint.com"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-blue-200 text-sm hover:text-white transition-colors duration-200 mb-5"
        >
          O agenda una reunión en invermint.com →
        </a>

        {/* Email (terciario) */}
        <div className="border-t border-white/10 pt-5">
          <p className="text-blue-300 text-xs mb-3">¿Prefieres que te contactemos?</p>
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
                  className="px-5 py-3 rounded-xl font-bold text-white text-sm transition-all duration-200 hover:opacity-90 whitespace-nowrap"
                  style={{ backgroundColor: '#27AE60' }}
                >
                  Enviar →
                </button>
              </div>
              {emailError && <p className="text-red-300 text-xs mt-1">{emailError}</p>}
            </form>
          ) : (
            <p className="text-green-300 font-semibold text-sm">
              ✅ ¡Recibido! Te contactaremos pronto.
            </p>
          )}
        </div>

        <p className="text-blue-400 text-xs mt-4">🔒 Tus datos están seguros · Sin spam</p>
      </div>

      {/* Señales de confianza */}
      <div className="grid grid-cols-3 gap-3 text-center text-xs text-gray-500">
        <div className="card py-3">
          <div className="text-2xl mb-1">🏦</div>
          <p className="font-semibold text-gray-700">Activos reales</p>
          <p>Respaldado por propiedades</p>
        </div>
        <div className="card py-3">
          <div className="text-2xl mb-1">📈</div>
          <p className="font-semibold text-gray-700">+1.200 inversores</p>
          <p>Confían en Invermint</p>
        </div>
        <div className="card py-3">
          <div className="text-2xl mb-1">💸</div>
          <p className="font-semibold text-gray-700">Desde $250 USD</p>
          <p>Accesible para todos</p>
        </div>
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

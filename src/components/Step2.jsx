import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { formatCOP, formatPct } from '../utils/format.js'

function MetricCard({ label, value, sub, accent, big }) {
  return (
    <div
      className="card text-center relative overflow-hidden"
      style={accent ? { borderTop: '3px solid #27AE60' } : { borderTop: '3px solid #1A5276' }}
    >
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`font-bold ${big ? 'text-3xl' : 'text-2xl'}`} style={{ color: accent ? '#27AE60' : '#1A5276' }}>
        {value}
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      <p style={{ color: '#1A5276' }}>Portafolio: <strong>{formatCOP(payload[0]?.value)}</strong></p>
    </div>
  )
}

export default function Step2({ resultados, inputs, onNext, onBack }) {
  const { inversion, cdt, capitalInvertido, timeline, perfil } = resultados

  const diferencia = inversion.valorFinal - cdt.valorFinal
  const multiplicador = (inversion.valorFinal / capitalInvertido).toFixed(2)
  const perdidaInflacion = Math.round(capitalInvertido * 0.065 * inputs.horizonte)

  const chartData = timeline.map(t => ({
    año: `Año ${t.año}`,
    portafolio: t.portafolio,
  }))

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* ── Headline de resultado ── */}
      <div className="text-center">
        <div
          className="inline-block text-sm font-bold px-4 py-1.5 rounded-full mb-3"
          style={{ backgroundColor: '#EAFAF1', color: '#1E8449' }}
        >
          🎉 ¡Excelente decisión! Así crecería tu dinero
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#1A5276' }}>
          Tu dinero se multiplicaría <span style={{ color: '#27AE60' }}>{multiplicador}x</span>
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Perfil {perfil} · {inputs.horizonte} {inputs.horizonte === 1 ? 'año' : 'años'} · {formatPct(inversion.tasaTotal)} E.A.
        </p>
      </div>

      {/* ── Metric cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Capital invertido total"
          value={formatCOP(capitalInvertido)}
          sub={`${formatCOP(inputs.capitalInicial)} inicial + aportes`}
        />
        <MetricCard
          label="Valor de tu portafolio"
          value={formatCOP(inversion.valorFinal)}
          sub={`Al año ${inputs.horizonte}`}
          accent big
        />
        <MetricCard
          label="Ganancia total"
          value={formatCOP(inversion.gananciaTotal)}
          sub={`+${formatPct(inversion.retornoPct)} sobre lo invertido`}
          accent
        />
      </div>

      {/* ── Alerta: costo de NO invertir ── */}
      <div
        className="rounded-xl p-4 flex items-start gap-3 text-sm"
        style={{ backgroundColor: '#FEF9E7', borderLeft: '4px solid #E67E22' }}
      >
        <span className="text-xl flex-none">💸</span>
        <div>
          <p className="font-semibold text-yellow-900">¿Qué pasa si no inviertes?</p>
          <p className="text-yellow-800 mt-0.5">
            La inflación (6.5% anual) destruiría <strong>{formatCOP(perdidaInflacion)}</strong> de tu poder adquisitivo
            en {inputs.horizonte} {inputs.horizonte === 1 ? 'año' : 'años'}. Con Invermint, ese dinero crece en vez de perder valor.
          </p>
        </div>
      </div>

      {/* ── Breakdown rendimiento ── */}
      <div className="card">
        <h3 className="font-semibold text-gray-700 mb-3">¿Cómo se genera tu rentabilidad?</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#EBF5FB' }}>
            <p className="text-xs text-gray-500 font-medium mb-1">Arriendo</p>
            <p className="text-2xl font-bold" style={{ color: '#1A5276' }}>{formatPct(inversion.arriendo)}</p>
            <p className="text-xs text-gray-400">anual</p>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#EAFAF1' }}>
            <p className="text-xs text-gray-500 font-medium mb-1">Valorización</p>
            <p className="text-2xl font-bold" style={{ color: '#27AE60' }}>{formatPct(inversion.valorizacion)}</p>
            <p className="text-xs text-gray-400">anual</p>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#1A5276' }}>
            <p className="text-xs text-blue-200 font-medium mb-1">Total E.A.</p>
            <p className="text-2xl font-bold text-white">{formatPct(inversion.tasaTotal)}</p>
            <p className="text-xs text-blue-200">anual</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
          <span>📊</span>
          <span>
            Tasa real (descontando inflación): <strong style={{ color: '#27AE60' }}>{formatPct(inversion.tasaRealAnual)} anual</strong>
            {' '}· CDT real: <strong className="text-red-500">{formatPct(resultados.cdt.tasaRealAnual)}</strong>
          </span>
        </p>
      </div>

      {/* ── Gráfica año a año ── */}
      <div className="card">
        <h3 className="font-semibold text-gray-700 mb-4">Evolución de tu portafolio año a año</h3>
        <ResponsiveContainer width="100%" height={Math.max(180, timeline.length * 52)}>
          <BarChart layout="vertical" data={chartData} margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
            <XAxis
              type="number"
              tickFormatter={v => {
                if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`
                if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(0)}M`
                return `$${(v / 1000).toFixed(0)}K`
              }}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="año"
              tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              width={52}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="portafolio" radius={[0, 6, 6, 0]} maxBarSize={36}>
              {chartData.map((_, i) => (
                <Cell
                  key={i}
                  fill={i === chartData.length - 1 ? '#27AE60' : '#1A5276'}
                  fillOpacity={0.75 + (i / chartData.length) * 0.25}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Insight vs CDT ── */}
      <div className="rounded-2xl p-5 border-l-4" style={{ backgroundColor: '#EAFAF1', borderColor: '#27AE60' }}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">🏆</span>
          <div>
            <p className="font-semibold" style={{ color: '#1E8449' }}>
              Ganarías {formatCOP(diferencia)} más que en un CDT
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Con Invermint obtienes <strong>{formatPct(inversion.tasaTotal)}</strong> E.A. vs el{' '}
              <strong>{formatPct(resultados.cdt.tasaNeta)}</strong> neto del CDT — una diferencia que en {inputs.horizonte} años
              se convierte en patrimonio real.
            </p>
          </div>
        </div>
      </div>

      {/* ── CTAs ── */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-none px-6 py-3 rounded-xl border-2 font-semibold text-sm transition-all duration-200 hover:bg-gray-50"
          style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
        >
          ← Ajustar
        </button>
        <button onClick={onNext} className="btn-primary flex-1 text-base py-3">
          Ver comparativa completa →
        </button>
      </div>
    </div>
  )
}

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { formatCOP, formatPct } from '../utils/format.js'

function MetricCard({ label, value, sub, accent }) {
  return (
    <div className="card text-center">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold" style={{ color: accent ? '#27AE60' : '#1A5276' }}>
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
      <p className="font-semibold text-gray-700 mb-1">Año {label}</p>
      <p style={{ color: '#1A5276' }}>Portafolio: <strong>{formatCOP(payload[0]?.value)}</strong></p>
    </div>
  )
}

export default function Step2({ resultados, inputs, onNext, onBack }) {
  const { inversion, cdt, capitalInvertido, timeline, perfil } = resultados

  const diferencia = inversion.valorFinal - cdt.valorFinal
  const diferenciaPositiva = diferencia > 0

  const chartData = timeline.map(t => ({
    año: `Año ${t.año}`,
    portafolio: t.portafolio,
  }))

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold" style={{ color: '#1A5276' }}>Tu simulación</h2>
        <p className="text-gray-500 text-sm mt-1">
          Perfil {perfil} · {inputs.horizonte} {inputs.horizonte === 1 ? 'año' : 'años'} de inversión
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Capital invertido total"
          value={formatCOP(capitalInvertido)}
          sub={`${formatCOP(inputs.capitalInicial)} inicial + aportes`}
        />
        <MetricCard
          label="Valor del portafolio"
          value={formatCOP(inversion.valorFinal)}
          sub={`Al año ${inputs.horizonte}`}
          accent
        />
        <MetricCard
          label="Ganancia total"
          value={formatCOP(inversion.gananciaTotal)}
          sub={`+${formatPct(inversion.retornoPct)} sobre lo invertido`}
          accent
        />
      </div>

      {/* Breakdown rendimiento */}
      <div className="card">
        <h3 className="font-semibold text-gray-700 mb-3">Composición del rendimiento</h3>
        <div className="grid grid-cols-3 gap-3">
          <div
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: '#EBF5FB' }}
          >
            <p className="text-xs text-gray-500 font-medium mb-1">Arriendo</p>
            <p className="text-2xl font-bold" style={{ color: '#1A5276' }}>
              {formatPct(inversion.arriendo)}
            </p>
            <p className="text-xs text-gray-400">anual</p>
          </div>
          <div
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: '#EAFAF1' }}
          >
            <p className="text-xs text-gray-500 font-medium mb-1">Valorización</p>
            <p className="text-2xl font-bold" style={{ color: '#27AE60' }}>
              {formatPct(inversion.valorizacion)}
            </p>
            <p className="text-xs text-gray-400">anual</p>
          </div>
          <div
            className="rounded-xl p-4 text-center border-2"
            style={{ backgroundColor: '#1A5276', borderColor: '#1A5276' }}
          >
            <p className="text-xs text-blue-200 font-medium mb-1">Total</p>
            <p className="text-2xl font-bold text-white">
              {formatPct(inversion.tasaTotal)}
            </p>
            <p className="text-xs text-blue-200">anual</p>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-400 flex items-center gap-1">
          <span>📊</span>
          <span>Tasa real (descontando inflación 6.5%): <strong style={{ color: '#1A5276' }}>{formatPct(inversion.tasaRealAnual)} anual</strong></span>
        </div>
      </div>

      {/* Gráfica barras horizontales año a año */}
      <div className="card">
        <h3 className="font-semibold text-gray-700 mb-4">Evolución de tu portafolio</h3>
        <ResponsiveContainer width="100%" height={Math.max(180, timeline.length * 52)}>
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
          >
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
                  fillOpacity={0.85 + (i / chartData.length) * 0.15}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insight box */}
      <div
        className="rounded-2xl p-5 border-l-4"
        style={{ backgroundColor: '#EAFAF1', borderColor: '#27AE60' }}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">🏠</span>
          <div>
            <p className="font-semibold" style={{ color: '#1E8449' }}>
              {diferenciaPositiva
                ? `Ganarías ${formatCOP(diferencia)} más que en un CDT`
                : `El CDT superaría tu portafolio por ${formatCOP(Math.abs(diferencia))}`}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Con fracciones Invermint obtienes <strong>{formatPct(inversion.tasaTotal)}</strong> anual vs el{' '}
              <strong>{formatPct(resultados.cdt.tasaNeta)}</strong> neto del CDT.
              {inputs.reinversionPct > 0 && ` Además, el ${inputs.reinversionPct}% de los arriendos se reinvierten para potenciar el efecto compuesto.`}
            </p>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-none px-6 py-3 rounded-xl border-2 font-semibold text-sm transition-all duration-200 hover:bg-gray-50"
          style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
        >
          ← Volver
        </button>
        <button onClick={onNext} className="btn-primary flex-1 text-base py-3">
          Ver comparativa →
        </button>
      </div>
    </div>
  )
}

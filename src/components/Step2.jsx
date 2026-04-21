import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { formatCOP, formatPct } from '../utils/format.js'

const C = { navy: '#0D3B50', mint: '#6EECD4', mintLight: '#E8FAF7', teal: '#1A7090', mintDark: '#4DD4BC' }

function MetricCard({ label, value, sub, highlight }) {
  return (
    <div
      className="card text-center"
      style={highlight ? { borderTop: `3px solid ${C.mint}`, backgroundColor: '#F0FDFB' } : { borderTop: `3px solid ${C.navy}` }}
    >
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`font-bold ${highlight ? 'text-3xl' : 'text-2xl'}`} style={{ color: highlight ? C.teal : C.navy }}>
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
      <p className="font-semibold mb-1" style={{ color: C.navy }}>{label}</p>
      <p style={{ color: C.teal }}>Portafolio: <strong>{formatCOP(payload[0]?.value)}</strong></p>
    </div>
  )
}

export default function Step2({ resultados, inputs, onNext, onBack }) {
  const { inversion, cdt, capitalInvertido, timeline, perfil } = resultados
  const diferencia = inversion.valorFinal - cdt.valorFinal
  const multiplicador = (inversion.valorFinal / capitalInvertido).toFixed(2)
  const perdidaInflacion = Math.round(capitalInvertido * 0.065 * inputs.horizonte)
  const chartData = timeline.map(t => ({ año: `Año ${t.año}`, portafolio: t.portafolio }))

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Headline */}
      <div className="text-center">
        <div
          className="inline-block text-sm font-bold px-4 py-1.5 rounded-full mb-3"
          style={{ backgroundColor: C.mintLight, color: C.teal }}
        >
          🎉 ¡Excelente decisión! Así crecería tu dinero
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: C.navy }}>
          Tu dinero se multiplicaría <span style={{ color: C.teal }}>{multiplicador}x</span>
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Perfil {perfil} · {inputs.horizonte} {inputs.horizonte === 1 ? 'año' : 'años'} · {formatPct(inversion.tasaTotal)} E.A.
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
          label="Valor de tu portafolio"
          value={formatCOP(inversion.valorFinal)}
          sub={`Al año ${inputs.horizonte}`}
          highlight
        />
        <MetricCard
          label="Ganancia total"
          value={formatCOP(inversion.gananciaTotal)}
          sub={`+${formatPct(inversion.retornoPct)} sobre lo invertido`}
          highlight
        />
      </div>

      {/* Costo de NO invertir */}
      <div
        className="rounded-xl p-4 flex items-start gap-3 text-sm"
        style={{ backgroundColor: '#FEF9E7', borderLeft: '4px solid #E67E22' }}
      >
        <span className="text-xl flex-none">💸</span>
        <div>
          <p className="font-semibold text-yellow-900">¿Qué pasa si no inviertes?</p>
          <p className="text-yellow-800 mt-0.5">
            La inflación destruiría <strong>{formatCOP(perdidaInflacion)}</strong> de tu poder adquisitivo
            en {inputs.horizonte} {inputs.horizonte === 1 ? 'año' : 'años'}.
            Con înverMint ese dinero crece en vez de perder valor.
          </p>
        </div>
      </div>

      {/* Breakdown rendimiento */}
      <div className="card">
        <h3 className="font-semibold mb-3" style={{ color: C.navy }}>¿Cómo se genera tu rentabilidad?</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: C.mintLight }}>
            <p className="text-xs text-gray-500 font-medium mb-1">Arriendo</p>
            <p className="text-2xl font-bold" style={{ color: C.teal }}>{formatPct(inversion.arriendo)}</p>
            <p className="text-xs text-gray-400">anual</p>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: C.mintLight }}>
            <p className="text-xs text-gray-500 font-medium mb-1">Valorización</p>
            <p className="text-2xl font-bold" style={{ color: C.teal }}>{formatPct(inversion.valorizacion)}</p>
            <p className="text-xs text-gray-400">anual</p>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: C.navy }}>
            <p className="text-xs font-medium mb-1" style={{ color: C.mint }}>Total E.A.</p>
            <p className="text-2xl font-bold" style={{ color: C.mint }}>{formatPct(inversion.tasaTotal)}</p>
            <p className="text-xs" style={{ color: C.mint }}>anual</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          📊 Tasa real (sin inflación):{' '}
          <strong style={{ color: C.teal }}>{formatPct(inversion.tasaRealAnual)}</strong>
          {' '}· CDT real:{' '}
          <strong className="text-red-400">{formatPct(resultados.cdt.tasaRealAnual)}</strong>
        </p>
      </div>

      {/* Gráfica */}
      <div className="card">
        <h3 className="font-semibold mb-4" style={{ color: C.navy }}>Evolución año a año</h3>
        <ResponsiveContainer width="100%" height={Math.max(180, timeline.length * 52)}>
          <BarChart layout="vertical" data={chartData} margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
            <XAxis
              type="number"
              tickFormatter={v => {
                if (v >= 1_000_000_000) return `$${(v/1e9).toFixed(1)}B`
                if (v >= 1_000_000) return `$${(v/1e6).toFixed(0)}M`
                return `$${(v/1000).toFixed(0)}K`
              }}
              tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false}
            />
            <YAxis
              type="category" dataKey="año" width={52}
              tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }} axisLine={false} tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="portafolio" radius={[0, 6, 6, 0]} maxBarSize={36}>
              {chartData.map((_, i) => (
                <Cell
                  key={i}
                  fill={i === chartData.length - 1 ? C.mint : C.navy}
                  fillOpacity={i === chartData.length - 1 ? 1 : 0.7 + (i / chartData.length) * 0.3}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insight vs CDT */}
      <div
        className="rounded-2xl p-5 border-l-4"
        style={{ backgroundColor: C.mintLight, borderColor: C.mint }}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">🏆</span>
          <div>
            <p className="font-semibold" style={{ color: C.teal }}>
              Ganarías {formatCOP(diferencia)} más que en un CDT
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Con înverMint obtienes <strong>{formatPct(inversion.tasaTotal)}</strong> E.A. vs el{' '}
              <strong>{formatPct(resultados.cdt.tasaNeta)}</strong> neto del CDT —
              en {inputs.horizonte} años la diferencia se convierte en patrimonio real.
            </p>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-none px-6 py-3 rounded-xl border-2 font-semibold text-sm transition-all hover:bg-gray-50"
          style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
        >
          ← Ajustar
        </button>
        <button
          onClick={onNext}
          className="flex-1 text-base py-3 rounded-xl font-bold transition-all duration-200 active:scale-95 shadow-md"
          style={{ backgroundColor: C.navy, color: 'white' }}
        >
          Ver comparativa completa →
        </button>
      </div>
    </div>
  )
}

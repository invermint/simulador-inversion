const copFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function formatCOP(n) {
  return copFormatter.format(Math.round(n))
}

export function formatPct(n) {
  return n.toFixed(1) + '%'
}

export function formatMultiplier(n) {
  return n.toFixed(2) + 'x'
}

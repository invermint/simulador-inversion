const PERFILES = {
  Conservador: { arriendo: 0.06, valorizacion: 0.06, total: 0.12 },
  Moderado:    { arriendo: 0.07, valorizacion: 0.06, total: 0.13 },
  Crecimiento: { arriendo: 0.09, valorizacion: 0.06, total: 0.15 },
}

const CDT_TASA_NOMINAL = 0.12
const CDT_RETENCION = 0.07
const CDT_TASA_NETA = CDT_TASA_NOMINAL * (1 - CDT_RETENCION) // 0.1116
const INFLACION = 0.065

export function simularInversion({ capitalInicial, aporteMensual, horizonte, perfil, reinversionPct }) {
  const { arriendo, valorizacion } = PERFILES[perfil]
  const reinvest = reinversionPct / 100
  const aporte = aporteMensual

  let portfolio = capitalInicial
  let cdt = capitalInicial
  const timeline = []

  const { total } = PERFILES[perfil]

  for (let year = 1; year <= horizonte; year++) {
    // Portafolio siempre crece a la tasa total anunciada
    // El slider de reinversión es informativo (cuánto retiras vs reinviertes)
    portfolio = portfolio * (1 + total) + (aporte * 12)

    // CDT
    cdt = cdt * (1 + CDT_TASA_NETA) + (aporte * 12)

    timeline.push({
      año: year,
      portafolio: Math.round(portfolio),
      cdt: Math.round(cdt),
      diferencia: Math.round(portfolio - cdt),
    })
  }

  const capitalInvertido = capitalInicial + aporte * 12 * horizonte
  const valorFinalInv = Math.round(portfolio)
  const gananciaTotalInv = valorFinalInv - capitalInvertido
  const retornoPctInv = (gananciaTotalInv / capitalInvertido) * 100
  const tasaRealAnualInv = PERFILES[perfil].total - INFLACION

  const valorFinalCDT = Math.round(cdt)
  const gananciaTotalCDT = valorFinalCDT - capitalInvertido
  const retornoPctCDT = (gananciaTotalCDT / capitalInvertido) * 100
  const tasaRealAnualCDT = CDT_TASA_NETA - INFLACION

  return {
    timeline,
    perfil,
    perfilData: PERFILES[perfil],
    capitalInvertido,
    inversion: {
      valorFinal: valorFinalInv,
      gananciaTotal: gananciaTotalInv,
      retornoPct: retornoPctInv,
      tasaRealAnual: tasaRealAnualInv * 100,
      tasaTotal: PERFILES[perfil].total * 100,
      arriendo: arriendo * 100,
      valorizacion: valorizacion * 100,
    },
    cdt: {
      valorFinal: valorFinalCDT,
      gananciaTotal: gananciaTotalCDT,
      retornoPct: retornoPctCDT,
      tasaRealAnual: tasaRealAnualCDT * 100,
      tasaNominal: CDT_TASA_NOMINAL * 100,
      tasaNeta: CDT_TASA_NETA * 100,
      retencion: CDT_RETENCION * 100,
    },
  }
}

export { PERFILES, INFLACION, CDT_TASA_NETA }

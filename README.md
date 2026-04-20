# Simulador de Inversión Inmobiliaria — Invermint

Aplicación web estática que compara fracciones inmobiliarias vs CDT en 3 pasos interactivos.

## Stack

- React 18 + Vite 5
- Tailwind CSS 3
- Recharts 2

## Instalación

```bash
npm install
```

## Desarrollo local

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173).

## Build de producción

```bash
npm run build
```

Los archivos estáticos quedan en `dist/`.

## Deploy en Vercel

```bash
npm install -g vercel
vercel --prod
```

Configuración recomendada:
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

## Lógica de cálculo

| Perfil | Arriendo | Valorización | Total |
|--------|----------|--------------|-------|
| Conservador | 4% | 6% | 10% |
| Moderado | 5% | 6% | 11% |
| Crecimiento | 6% | 6% | 12% |

**CDT:** Tasa nominal 12% con retención en la fuente del 7% → tasa neta **11.16%** anual.

**Inflación de referencia:** 6.5% anual (para cálculo de tasa real).

# BlueTrain — Arquitectura

## Estructura de carpetas

```
BlueTrain/
├── index.html              ← Punto de entrada limpio (HTML semántico, sin lógica)
├── assets/
│   ├── images/             ← Imágenes (logo, hero, ejercicios)
│   ├── icons/              ← Iconos SVG
│   └── videos/             ← Vídeos de referencia
├── css/
│   ├── main.css            ← Variables CSS, reset, layout, header, nav, progress bar
│   ├── components.css      ← Todos los componentes UI + animaciones CSS keyframes
│   └── responsive.css      ← Media queries, reduced-motion, safe-area iOS
├── js/
│   ├── app.js              ← Punto de entrada JS: init, view switching, event listeners
│   ├── workouts.js         ← Renderizado de sesiones, progress tracking, localStorage
│   ├── nutrition.js        ← Sección Competición y Nutrición, calculadora Mifflin-St Jeor
│   └── utils.js            ← Timer de descanso, formatters, updateHeaderHeight
├── data/
│   ├── animations.js       ← ANIMS: biblioteca de SVG stick figures (400×300)
│   ├── workouts.js         ← WORKOUTS_DATA: 7 sesiones, 3 mesociclos
│   └── stations.js         ← STATIONS: 8 estaciones de carrera funcional
├── modules/
│   ├── training/           ← Módulo futuro: planes personalizados
│   ├── competition-functional/ ← Módulo futuro: prep específica de carrera
│   ├── nutrition/          ← Módulo futuro: tracking nutricional
│   └── dashboard/          ← Módulo futuro: métricas y progreso
└── docs/
    ├── architecture.md     ← Este documento
    ├── roadmap.md          ← Roadmap de funcionalidades
    └── sources.md          ← Fuentes científicas
```

## Separación de responsabilidades

| Capa | Responsabilidad |
|------|----------------|
| HTML (`index.html`) | Estructura semántica, accesibilidad, carga de assets |
| CSS (`css/`) | Presentación, animaciones, responsive |
| JS (`js/`) | Lógica de la aplicación, interacciones, renderizado |
| Datos (`data/`) | Contenido desacoplado: ejercicios, sesiones, estaciones |
| Módulos (`modules/`) | Expansión futura sin tocar el core |

## Orden de carga de scripts

```html
data/animations.js   → define ANIMS (SVG strings)
data/workouts.js     → define WORKOUTS_DATA
data/stations.js     → define STATIONS
js/utils.js          → funciones helper
js/workouts.js       → depende de ANIMS, WORKOUTS_DATA
js/nutrition.js      → depende de STATIONS
js/app.js            → punto de entrada, llama a init()
```

Sin módulos ES6 ni bundler → funciona como archivo local sin servidor.

## Escalabilidad futura

Para evolucionar hacia SaaS añadir:
1. **Auth**: módulo `modules/auth/` con JWT o OAuth
2. **API**: sustituir `data/*.js` por `fetch('/api/workouts')` en `app.js`
3. **DB**: Supabase / Firebase como backend
4. **Build**: Vite o esbuild para bundling, tree-shaking y code splitting
5. **PWA**: añadir `manifest.json` y Service Worker para offline completo

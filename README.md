# BlueTrain

**Plataforma SaaS de entrenamiento funcional.** Plan de 3 mesociclos progresivos, tracking de rendimiento por usuario, nutrición basada en evidencia científica y simulación de carrera por estaciones.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Bundler | Vite 6 |
| Lenguaje | TypeScript 5 (strict) |
| Auth + DB | Supabase (PostgreSQL + Row Level Security) |
| Offline | PWA — Service Worker (Workbox) |
| Estilos | CSS custom — design system propio, dark mode |
| Deploy | Cualquier hosting estático (Vercel, Netlify, Cloudflare Pages) |

Sin frameworks frontend. Vanilla TypeScript con módulos ES, arquitectura en capas y cero dependencias de runtime más allá del SDK de Supabase.

---

## Funcionalidades

### Entrenamiento
- **7 sesiones** organizadas en 3 mesociclos (Base · Intensificación · Peaking)
- Periodización científica basada en NSCA: progresión de %1RM por semana
- **40+ animaciones SVG** de stick figures para cada ejercicio — sin conexión
- Temporizador de descanso con audio (Web Audio API) y vibración
- Puntos clave técnicos por ejercicio
- Bloque de competición en cada sesión con protocolo AMRAP / For Time / EMOM

### Tracking
- Registro de sesiones: duración real, RPE 1–10, notas y cargas principales
- Dashboard con estadísticas: sesiones totales, racha de días, tiempo acumulado
- Gráfico de actividad semanal
- Historial completo con filtros por tipo (fuerza / funcional)
- Sincronización entre dispositivos vía Supabase

### Competición
- Guía completa de las 8 estaciones de carrera funcional por estaciones
- Pesos oficiales por división (Pro / Open, hombres / mujeres)
- Tips de ejecución por estación
- Ruta de carrera visual

### Nutrición
- Calculadora de necesidades calóricas (Mifflin-St Jeor — ACSM)
- Guías de proteína, carbohidratos, grasas e hidratación
- Protocolo nutricional pre/durante/post competición
- Todo respaldado por fuentes científicas: ISSN, ACSM, WHO/OMS, NSCA

### SaaS / Auth
- Registro y login por email
- Recuperación de contraseña
- Perfil de usuario con nivel y objetivo
- Migración automática de datos locales al crear cuenta
- Cada usuario solo accede a sus propios datos (RLS en PostgreSQL)

---

## Instalación local

### 1. Clonar y dependencias

```bash
git clone https://github.com/Nocnirdev/BlueTrain.git
cd BlueTrain
npm install
```

### 2. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un proyecto nuevo
2. En el SQL Editor, ejecuta el contenido de [`supabase/schema.sql`](supabase/schema.sql)
3. En **Project Settings → API**, copia la `Project URL` y la `anon public` key

### 3. Variables de entorno

```bash
cp .env.example .env
```

Edita `.env`:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Arrancar

```bash
npm run dev
```

La app estará disponible en `http://localhost:5173`.

---

## Scripts disponibles

```bash
npm run dev        # Servidor de desarrollo con HMR
npm run build      # Build de producción (TypeScript + Vite)
npm run preview    # Preview del build de producción
npm run typecheck  # Verificación de tipos sin compilar
```

---

## Estructura del proyecto

```
BlueTrain/
├── src/
│   ├── types/
│   │   └── index.ts            # Todos los tipos TypeScript (UserProfile, SessionEntry…)
│   ├── lib/
│   │   ├── supabase.ts         # Cliente Supabase
│   │   └── html.ts             # esc() XSS sanitizer + helpers DOM
│   ├── services/
│   │   ├── auth.ts             # Auth service (signup, login, logout, profile)
│   │   ├── db.ts               # DB service (Supabase con fallback localStorage)
│   │   └── storage.ts          # Capa localStorage (caché offline)
│   ├── data/
│   │   ├── workouts.ts         # 7 sesiones, 3 mesociclos (tipado)
│   │   ├── stations.ts         # 8 estaciones de carrera funcional
│   │   └── animations.ts       # 40+ SVG stick figures (lazy-loaded)
│   ├── components/
│   │   ├── toast.ts            # Notificaciones (success / error / info)
│   │   └── dialog.ts           # Confirm dialog — reemplaza window.confirm()
│   ├── views/
│   │   ├── auth.ts             # Login / signup / forgot password
│   │   ├── dashboard.ts        # Dashboard con stats y actividad reciente
│   │   ├── training.ts         # Sesiones de entrenamiento + log modal
│   │   ├── competition.ts      # Guía de estaciones
│   │   ├── nutrition.ts        # Nutrición + calculadora Mifflin-St Jeor
│   │   ├── history.ts          # Historial con filtros
│   │   ├── profile.ts          # Perfil de usuario
│   │   └── timer.ts            # Temporizador de descanso
│   ├── app.ts                  # Orquestación: router, auth gate, event bus
│   └── main.ts                 # Entry point — importa CSS y arranca app
├── css/
│   ├── main.css                # Design tokens, reset, layout, header
│   ├── components.css          # Componentes UI + animaciones CSS keyframes
│   ├── tracker.css             # Dashboard, historial, modales
│   ├── responsive.css          # Media queries, reduced-motion, iOS safe area
│   └── auth.css                # Pantalla de auth, skeletons, toast types
├── public/
│   └── manifest.json           # PWA manifest
├── supabase/
│   └── schema.sql              # Schema PostgreSQL + RLS policies
├── .env.example
├── vite.config.ts
└── tsconfig.json
```

---

## Base de datos

Dos tablas en PostgreSQL con Row Level Security activado:

```sql
-- Historial de sesiones entrenadas
sessions (
  id, user_id, session_key, workout_name,
  type, mesocycle, duration, rpe,
  notes, performance (JSONB), date, completed_at
)

-- Estado de checkboxes por sesión
workout_progress (
  user_id, session_key, completed_exercises (TEXT[])
)
```

Cada usuario solo puede leer y escribir sus propios registros. Las políticas RLS se aplican a nivel de base de datos, no de aplicación.

---

## Plan de entrenamiento

| Sesión | Mesociclo | Foco principal |
|--------|-----------|---------------|
| A1 | Base (sem. 1–4) | Tren inferior + Push · Wall Balls |
| B1 | Base (sem. 1–4) | Tren superior + Pull · Remo |
| C1 | Base (sem. 1–4) | Full Body · Simulación reducida |
| A2 | Intensificación (sem. 5–8) | Sentadilla pesada · Ski Erg |
| B2 | Intensificación (sem. 5–8) | Peso muerto · Sandbag |
| C2 | Intensificación (sem. 5–8) | Simulación completa · Race pace |
| A3 | Peaking (sem. 9–12) | Pico fuerza · PAP · Race intervals |

Periodización basada en NSCA — Essentials of Strength Training and Conditioning (4ª ed.).

---

## Fuentes científicas

| Área | Fuente |
|------|--------|
| Periodización | NSCA — Essentials of Strength Training and Conditioning (4th ed.) |
| Volumen e intensidad | ACSM — Guidelines for Exercise Testing and Prescription (11th ed.) |
| Proteína | ISSN Position Stand 2017 — Jäger et al. |
| Carbohidratos y grasas | ACSM/ADA/DC Joint Position Statement 2016 |
| Hidratación | ACSM Position Stand 2007 — Exercise and Fluid Replacement |
| Déficit calórico | WHO/OMS — Obesity: Preventing and Managing |
| Calculadora BMR | Mifflin-St Jeor / Harris et al. (1990) — validada ACSM |
| Grasa localizada | Ramírez-Campillo et al. (2013) — J Strength Cond Res |

---

## Deploy

El build de producción genera un directorio `dist/` estático con Service Worker incluido.

**Vercel:**
```bash
npm run build
# Sube dist/ o conecta el repositorio con Build Command: npm run build
```

**Netlify / Cloudflare Pages:**  
Build Command: `npm run build` · Output Directory: `dist`

Recuerda añadir las variables de entorno `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en la plataforma de deploy.

---

## Roadmap

- [ ] Mesociclos B3 y C3 (completar el plan de 12 semanas)
- [ ] Biblioteca de ejercicios con filtros
- [ ] Planes por categoría: Open / Pro / Age Group
- [ ] Gráficas de progresión de carga por ejercicio
- [ ] Calculadoras de composición corporal (IMC, % grasa)
- [ ] Light mode toggle
- [ ] Dashboard multi-atleta (coach view)

---

## Licencia

MIT

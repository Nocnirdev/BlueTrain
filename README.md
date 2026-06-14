# BlueTrain

**Aplicación web de entrenamiento funcional.** Plan de 3 mesociclos progresivos, tracking de rendimiento por usuario, seguimiento de cargas por ejercicio, nutrición basada en evidencia científica y simulación de carrera por estaciones.

> Proyecto personal educativo y de formación, sin ánimo de lucro.

🌐 **Demo en producción:** [blue-train.vercel.app](https://blue-train.vercel.app)

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Bundler | Vite 6 |
| Lenguaje | TypeScript 5 (strict) |
| Auth + DB | Supabase (PostgreSQL + Row Level Security) |
| Offline | PWA — Service Worker (Workbox) |
| Estilos | CSS custom — design system propio, dark mode |
| Deploy | Vercel |

Sin frameworks frontend. Vanilla TypeScript con módulos ES, arquitectura en capas y cero dependencias de runtime más allá del SDK de Supabase.

---

## Funcionalidades

### Dashboard
- Saludo personalizado con mensaje motivacional según racha y sesiones
- **Estadísticas en tiempo real:** sesiones totales, sesiones semanales, racha de días, tiempo acumulado
- **Accesos rápidos:** navegación directa a Entrena, Competición, Nutrición e Historial
- **Progreso comparativo:** sesiones de esta semana vs semana anterior, este mes vs mes anterior, este año vs año anterior (con % de variación)
- Gráfico de actividad semanal (L–D)
- Último entrenamiento y feed de actividad reciente

### Entrenamiento
- **7 sesiones** organizadas en 3 mesociclos (Base · Intensificación · Peaking)
- Periodización científica basada en NSCA: progresión de %1RM por semana
- **134 ejercicios** con 4–6 puntos clave técnicos detallados en español por ejercicio
- Temporizador de descanso con audio (Web Audio API) y vibración
- Bloque de competición en cada sesión con protocolo AMRAP / For Time / EMOM
- Checkboxes de progreso por ejercicio sincronizados con Supabase
- Botones de vídeo por ejercicio: búsqueda general + versión en español (sin filtros de año)

### Seguimiento de cargas
- **Tracker de peso integrado** en cada ejercicio con carga externa (barbell, dumbbells, KB, wall ball, sandbag, farmer carry, etc.)
- Muestra el último peso utilizado, delta respecto a la sesión anterior (▲▼=) y récord personal
- Input para registrar nuevo peso con validación
- Historial por ejercicio: mini gráfico SVG de evolución + tabla de las últimas 15 entradas
- Almacenamiento en Supabase (`weight_logs`) con fallback a localStorage offline
- 18 ejercicios con clave estable para trazabilidad histórica

### Competición
- Guía completa de las 8 estaciones de carrera funcional por estaciones
- Pesos oficiales por división (Pro / Open, hombres / mujeres)
- Tips de ejecución por estación
- Ruta de carrera visual

### Nutrición
- Calculadora de necesidades calóricas (Mifflin-St Jeor — ACSM)
- El objetivo del perfil del usuario **pre-rellena automáticamente** la calculadora
- Guías de proteína, carbohidratos, grasas e hidratación
- Protocolo nutricional pre/durante/post competición
- Todo respaldado por fuentes científicas: ISSN, ACSM, WHO/OMS, NSCA

### Auth y perfil
- Registro y login por email
- Recuperación de contraseña
- Perfil de usuario con nombre y objetivo de entrenamiento
- Estadísticas del perfil: sesiones, racha y tiempo total
- Migración automática de datos locales al crear cuenta
- Cada usuario solo accede a sus propios datos (RLS en PostgreSQL)

---

## Estructura del proyecto

```
BlueTrain/
├── src/
│   ├── types/
│   │   └── index.ts            # Tipos TypeScript: UserProfile, SessionEntry, WeightEntry…
│   ├── lib/
│   │   ├── supabase.ts         # Cliente Supabase (singleton)
│   │   └── html.ts             # esc() XSS sanitizer + helpers DOM
│   ├── services/
│   │   ├── auth.ts             # Auth service (signup, login, logout, profile)
│   │   ├── db.ts               # DB service (Supabase con fallback localStorage)
│   │   └── storage.ts          # Capa localStorage (caché offline)
│   ├── data/
│   │   ├── workouts.ts         # 7 sesiones, 3 mesociclos, 134 ejercicios (tipado)
│   │   ├── weight-keys.ts      # Mapa de nombres → claves estables para tracker de peso
│   │   └── stations.ts         # 8 estaciones de carrera funcional
│   ├── components/
│   │   ├── toast.ts            # Notificaciones (success / error / info)
│   │   └── dialog.ts           # Confirm dialog — reemplaza window.confirm()
│   ├── views/
│   │   ├── auth.ts             # Login / signup / forgot password
│   │   ├── dashboard.ts        # Dashboard: stats, accesos rápidos, progreso, actividad
│   │   ├── training.ts         # Sesiones + log modal + tracker de pesos por ejercicio
│   │   ├── competition.ts      # Guía de estaciones
│   │   ├── nutrition.ts        # Nutrición + calculadora Mifflin-St Jeor
│   │   ├── history.ts          # Historial con filtros
│   │   ├── profile.ts          # Modal de perfil
│   │   └── timer.ts            # Temporizador de descanso
│   ├── app.ts                  # Orquestación: router, auth gate, event bus
│   └── main.ts                 # Entry point — importa CSS y arranca app
├── css/
│   ├── main.css                # Design tokens, reset, layout, header
│   ├── components.css          # Componentes UI + animaciones CSS keyframes
│   ├── tracker.css             # Dashboard, historial, modales, tracker de pesos
│   ├── responsive.css          # Media queries, reduced-motion, iOS safe area
│   └── auth.css                # Pantalla de auth
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

Tres tablas en PostgreSQL con Row Level Security activado. Cada usuario solo puede leer y escribir sus propios registros:

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

-- Seguimiento de cargas por ejercicio
weight_logs (
  id, user_id, exercise_key, date,
  weight (NUMERIC), session_key, recorded_at
)
```

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

## Roadmap

- [ ] Mesociclos B3 y C3 (completar el plan de 12 semanas)
- [ ] Gráficas de evolución de carga por ejercicio (histórico completo)
- [ ] Registro de medidas corporales (peso, cintura, cadera)
- [ ] Planes por categoría: Open / Pro / Age Group
- [ ] Calculadoras de composición corporal (IMC, % grasa)
- [ ] Foto de perfil (Supabase Storage)
- [ ] Light mode toggle
- [ ] Términos de uso y Política de privacidad (pendiente revisión legal)

---

## Licencia

MIT

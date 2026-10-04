# BlueTrain — Arquitectura

## Aplicación actual

BlueTrain es una aplicación web construida con TypeScript estricto y Vite 8. No usa un framework de interfaz: el código se organiza en módulos ES y cada vista se renderiza desde `src/`.

```
BlueTrain/
├── src/
│   ├── app.ts                 ← Arranque, navegación y eventos globales
│   ├── main.ts                ← Punto de entrada de Vite
│   ├── components/            ← Componentes reutilizables
│   ├── data/                  ← Sesiones, estaciones, animaciones y claves
│   ├── lib/                   ← Cliente Supabase y utilidades HTML seguras
│   ├── services/              ← Autenticación, datos y almacenamiento local
│   ├── types/                 ← Tipos compartidos
│   └── views/                 ← Una vista por pantalla de la aplicación
├── css/                        ← Sistema visual, componentes y adaptación responsive
├── public/                     ← Manifest e iconos de la PWA
├── supabase/schema.sql         ← Tablas, índices y políticas de acceso
├── vite.config.ts              ← Compilación y service worker
└── vercel.json                 ← Cabeceras de seguridad en producción
```

## Capas y responsabilidades

| Capa | Responsabilidad |
|---|---|
| `src/main.ts` | Carga los estilos e inicia la aplicación. |
| `src/app.ts` | Gestiona el acceso, el cambio de pantalla y los eventos entre vistas. |
| `src/views/` | Renderiza el contenido de cada pantalla. |
| `src/services/` | Centraliza autenticación, Supabase y la caché local. |
| `src/data/` | Mantiene separado el contenido estático del entrenamiento. |
| `src/lib/` | Agrupa el cliente de Supabase y el escape de HTML. |

## Datos y acceso

La aplicación usa Supabase para cuentas y registros sincronizados. Las tablas `sessions`, `workout_progress` y `weight_logs` tienen Row Level Security, por lo que cada cuenta solo accede a sus propios datos.

`src/services/db.ts` es el único punto de acceso a los datos. Cuando una operación remota falla, conserva una copia local para no perder el registro inmediato. Además, deja en una cola local y ligada a la cuenta la operación pendiente de sesión, progreso, carga o medida corporal; la aplicación la intenta enviar de nuevo al iniciar sesión o al recuperar la conexión. Las eliminaciones de sesiones también quedan pendientes de forma independiente.

La copia JSON incluye sesiones, progreso, cargas, medidas corporales, borradores de rendimiento, perfil y temporizador. Las medidas se almacenan en `weight_logs` con claves internas reservadas, así aprovechan las mismas reglas de privacidad por cuenta, sincronización y recuperación sin crear una segunda tabla. Desde el perfil se puede restaurar una copia versión 1: antes de modificar el navegador, se valida su estructura, tamaño, fechas, tipos y duplicados. La restauración solo añade datos que falten y nunca borra ni sustituye los que ya existan. Subir después las sesiones, el progreso, las cargas y las medidas a Supabase requiere una confirmación separada; los borradores y el temporizador siguen siendo locales.

## Publicación y funcionamiento sin conexión

Vite genera la versión de producción y `vite-plugin-pwa` crea el service worker. Cuando detecta una versión nueva, la aplicación muestra un aviso y solo la aplica al pulsar «Actualizar»; así no interrumpe un entrenamiento en curso. Vercel publica la rama `main` y aplica las cabeceras de seguridad definidas en `vercel.json`.

Las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` se configuran en Vercel y no se guardan en Git. Cualquier cambio en ellas requiere un nuevo despliegue.

## Material heredado

Las carpetas raíz `js/` y `data/` contienen la implementación anterior sin TypeScript. Se conservan como referencia histórica, pero la versión publicada usa exclusivamente `src/` y Vite. No deben modificarse al añadir funciones nuevas salvo que se decida retirarlas en una limpieza separada.

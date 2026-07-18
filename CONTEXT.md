# CONTEXT.md - TiendaRopa

> Fuente única de verdad del proyecto. Lee este archivo antes de cualquier sesión de trabajo.

---

## 1. Visión General del Proyecto

**Propósito del negocio:** Tienda de ropa virtual enfocada en moda femenina y masculina. La aplicación permite a los usuarios explorar un catálogo de productos, ver promociones, agregar productos al carrito con selección de talla y realizar pedidos con envío o recogida en tienda física.

**Objetivos técnicos principales:**
- PWA instalable con experiencia nativa (standalone, portrait).
- Catálogo de productos con carrusel de imágenes y selección de talla.
- Carrito de compras persistente con flujo de checkout completo.
- Banner de promociones rotativo con CTAs.
- Footer con información de contacto, redes sociales y código QR de ubicación.

**Usuario final:** Clientes de moda que navegan desde dispositivos móviles o escritorio, con preferencia a la instalación como PWA.

---

## 2. Stack Tecnológico y Decisiones de Arquitectura

### Stack

| Capa | Tecnología | Versión | Decisión |
|------|-----------|---------|----------|
| Framework | React | 19.2.x | Componentes funcionales con hooks, JSX transform |
| Lenguaje | TypeScript | 6.0.x | `verbatimModuleSyntax`, `noUnusedLocals`, `noUnusedParameters` |
| Bundler | Vite | 8.1.x | Build rápido, HMR, soporte PWA nativo |
| Estilos | TailwindCSS | 4.3.x | Plugin `@tailwindcss/vite`, utility-first, sin config file |
| Estado global | React Context | — | Solo para carrito (`CartContext`) |
| Linting | oxlint | 1.71.x | Más rápido que ESLint, plugins: react, typescript, oxc |
| PWA | vite-plugin-pwa | 1.3.x | `autoUpdate`, manifest completo, workbox-window |
| Rutas | react-router-dom | 7.18.x | Instalado pero **no utilizado actualmente** |

### Estructura de directorios

```
tienda-ropa/
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── logoIco.png
├── src/
│   ├── App.tsx                    # Componente raíz
│   ├── main.tsx                   # Entry point, CartProvider
│   ├── index.css                  # TailwindCSS + animaciones custom
│   ├── assets/                    # Imágenes estáticas (logos, hero, etc.)
│   ├── types/
│   │   └── index.ts               # Interfaces globales + constantes de tienda
│   ├── services/
│   │   └── apiClient.ts           # Cliente HTTP genérico (GET/POST)
│   ├── context/
│   │   └── CartContext.tsx         # Estado del carrito (items, checkout, UI)
│   ├── hooks/
│   │   ├── index.ts               # Barrel export
│   │   ├── useLocalStorage.ts     # Persistencia en localStorage
│   │   └── usePWA.ts              # Detección e instalación de PWA
│   ├── components/
│   │   ├── ui/                    # Componentes genéricos reutilizables
│   │   │   ├── Button.tsx         # Button con variantes (primary/secondary/ghost)
│   │   │   ├── Carousel.tsx       # Carrusel de imágenes con touch/swipe
│   │   │   └── ImageOverlay.tsx   # Overlay de imagen a pantalla completa
│   │   ├── feedback/
│   │   │   └── Modal.tsx          # Modal con ESC handler y body scroll lock
│   │   └── layout/
│   │       ├── Footer.tsx         # Footer con contacto, redes, QR de Maps
│   │       └── Header.tsx         # Header de 2 filas: logo, búsqueda, nav, usuario
│   └── features/
│       ├── products/
│       │   ├── index.ts           # useProducts, useProductDetail
│       │   ├── hooks/
│       │   │   └── useProducts.ts # Hook de fetch de productos
│       │   ├── services/
│       │   │   └── productsService.ts  # Servicio con MOCK data
│       │   └── components/
│       │       ├── ProductCard.tsx # Tarjeta de producto con carousel interno
│       │       └── ProductGrid.tsx # Grid responsivo de productos
│       ├── cart/
│       │   ├── index.ts           # CartDrawer
│       │   └── components/
│       │       └── CartDrawer.tsx  # Drawer lateral con checkout completo
│       ├── promos/
│       │   ├── index.ts           # BannerCarousel
│       │   └── components/
│       │       └── BannerCarousel.tsx  # Carrusel de promociones auto-rotativo
│       ├── brands/                # [VACÍO] Feature planeada
│       └── suppliers/             # [VACÍO] Feature planeada
├── package.json
├── vite.config.ts
├── tsconfig.json                  # References pattern
├── tsconfig.app.json              # Config de la app
├── tsconfig.node.json             # Config de vite.config.ts
└── .oxlintrc.json                 # Reglas de linting
```

### Arquitectura: Feature-Driven Development

Cada feature encapsula sus propios hooks, servicios y componentes. Las importaciones entre features se hacen a través del barrel `index.ts` de cada feature. Los componentes UI genéricos (`components/ui`) son compartidos entre features.

**Flujo de datos:**
```
services/productsService.ts  →  hooks/useProducts.ts  →  App.tsx  →  ProductGrid/ProductCard
                                                                    ↕
                                                          components/layout/Header.tsx
                                                                    ↕
                                                          context/CartContext.tsx
                                                                    ↕
                                                          features/cart/CartDrawer.tsx
```

---

## 3. Reglas de Desarrollo y Estilo de Código

### Nomenclatura

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Componentes | PascalCase | `ProductCard`, `CartDrawer` |
| Hooks | camelCase, prefijo `use` | `useProducts`, `usePWA` |
| Funciones | camelCase | `scrollToProducts`, `handleAddToCart` |
| Variables | camelCase | `totalItems`, `selectedSize` |
| Interfaces/Types | PascalCase, sin prefijo `I` | `Product`, `CartItem`, `UseProductsReturn` |
| Constantes | UPPER_SNAKE_CASE | `STORE_ADDRESS`, `API_BASE`, `PROMOS` |
| Archivos componentes | PascalCase.tsx | `ProductCard.tsx` |
| Archivos hooks/servicios | camelCase.ts | `useProducts.ts`, `apiClient.ts` |
| Barrel exports | `index.ts` | Siempre en cada módulo/feature |

### TypeScript

- **Interfaces** preferidas sobre `type` para objetos y props.
- `verbatimModuleSyntax: true` → usar `import type` para imports de tipos.
- `noUnusedLocals: true` y `noUnusedParameters: true` → no dejar código muerto.
- No usar `enum` → usar `as const` objects o union types.
- `Strict mode` habilitado (implícito por la config de Vite).

### Componentes

- **Solo componentes funcionales** con hooks.
- Props definidas con interface explícita en el mismo archivo.
- `export function ComponentName()` (named export, no default).
- Lógica de negocio en hooks custom, no en componentes.
- Separar renderizado condicional temprano (early returns) antes del JSX principal.
- Usar `useCallback` para funciones pasadas como props o en `useEffect` deps.

### Estilos

- **TailwindCSS utility-first** → no crear archivos CSS adicionales salvo `index.css` para animaciones globales.
- Paleta principal: `slate-*` para neutros, `red-500` para alertas/descuentos, `emerald-500` para éxito.
- Border radius consistente: `rounded-xl` para cards, `rounded-2xl` para containers grandes, `rounded-lg` para botones.
- Responsive: breakpoints `sm:`, `md:`, `lg:` (mobile-first).

### Restricciones (NO hacer)

- **No usar librerías de UI externas** (MUI, Chakra, shadcn, etc.). Todo se construye con TailwindCSS.
- **No usar librerías de estado externas** (Zustand, Redux, Jotai). El estado global se maneja con React Context.
- **No usar CSS modules, Sass, o CSS-in-JS.**
- **No usar placeholders ni datos hardcodeados sin indicarlo claramente** como mock.
- **No agregar dependencias sin verificar que sean estrictamente necesarias.**
- **No usar `any`** → tipar siempre las variables, parámetros y return types.
- **No crear ramas de features sin un plan claro.** `brands/` y `suppliers/` están vacíos a propósito.
- **No usar react-router-dom** para navegaciónSPA mientras la app sea single-page. Se instala para uso futuro.
- **No hacer fetch a APIs externas sin antes verificar el estado de `apiClient.ts`** → actualmente mock, la URL base `/api` requiere proxy o backend.

---

## 4. Estado Activo del Proyecto

### [Done] Hitos completados

- Scaffold del proyecto con Vite 8 + React 19 + TypeScript 6 + TailwindCSS 4.
- Sistema de componentes UI: `Button`, `Carousel`, `Modal`, `ImageOverlay`.
- Feature `products`: servicio mock, hook `useProducts`, `ProductCard` con carousel de imágenes, selección de talla y feedback de "agregado".
- Feature `promos`: `BannerCarousel` auto-rotativo (5s) con navegación manual y dots.
- Feature `cart`: `CartDrawer` completo con flujo de checkout (datos personales, modo de envío/recogida, confirmación).
- `CartContext`: addItem, removeItem, updateQuantity, clearCart, orderInfo, UI state (isCartOpen).
- Footer completo: contacto, redes sociales (Instagram, Facebook, X), código QR de ubicación.
- PWA: manifest, icons, `usePWA` hook para instalación desde el header.
- Hooks compartidos: `useLocalStorage`, `usePWA`.
- Header responsivo de 2 filas: logo, barra de búsqueda, menú de navegación con categorías dropdown, badge "NUEVO" en Ofertas, sección de usuario, carrito con badge, botón instalar PWA.

### [In Progress] Trabajo actual

_<!-- Rellenar con la tarea activa de esta sesión -->_

### [Backlog] Funcionalidades pendientes

- **Feature `brands/`**: Exploración de productos por marca. Directorio creado, sin implementar.
- **Feature `suppliers/`**: Gestión de proveedores. Directorio creado, sin implementar.
- **Navegación con react-router-dom**: Rutas para página de detalle de producto (`/producto/:id`), páginas de marca, etc.
- **Conexión a API real**: Reemplazar `productsService.ts` (mock) por fetch real usando `apiClient.ts`.
- ~~**Persistencia del carrito**: Actualmente el carrito se pierde al recargar (usar `useLocalStorage`).~~ **Completado**.
- **Búsqueda y filtros de productos**: Por categoría, marca, precio, talla.
- **Paginación o infinite scroll** del catálogo.
- **Testing**: No hay framework de testing configurado. Evaluar Vitest + React Testing Library.
- **SEO dinámico**: Meta tags por producto si se implementa routing.

### [Backlog Header] Funcionalidades del header pendientes

- **Búsqueda de productos**: El input de búsqueda está implementado como UI pero no tiene lógica. Implementar:
  - Hook `useSearch` que filtre productos por título, marca o categoría.
  - Autocomplete/sugerencias al escribir (debounced).
  - Navegación a resultados o filtrado del catálogo actual.
  - Historial de búsquedas recientes (guardado en `localStorage`).
- **Filtrado por categorías**: El dropdown de categorías muestra opciones pero no filtra. Implementar:
  - Al hacer clic en una categoría, filtrar el catálogo de productos.
  - Comunicación entre `Header` y `ProductGrid` via context o callback.
  - Highlight de categoría activa en el menú.
- **Páginas de navegación**: Los enlaces del menú son `#` placeholder. Implementar con react-router-dom:
  - `/historial` — Página de productos vistos recientemente (guardados en `localStorage`).
  - `/tiendas-oficiales` — Directorio de marcas/tiendas oficiales.
  - `/ofertas` — Página de productos en descuento (filtrar por `originalPrice`).
  - `/vender` — Formulario/información para vendedores.
  - `/ayuda` — Página de FAQ o centro de ayuda.
- **Sistema de usuario**: Los enlaces "Crea tu cuenta", "Ingresa", "Mis compras" son placeholder. Implementar:
  - Feature `auth/` con Login, Registro y perfil de usuario.
  - `AuthContext` para manejar sesión del usuario.
  - Persistencia de sesión en `localStorage`.
  - `/mis-compras` — Historial de pedidos del usuario.
- **Menú móvil completo**: El menú hamburguesa muestra categorías pero no el resto de navegación. Implementar:
  - Drawer/sheet lateral o dropdown completo con todos los enlaces.
  - Sección de usuario accesible desde el menú móvil.

---

## 5. Contexto Pasivo y Deuda Técnica

### Datos conocidos

- **Productos mock**: `productsService.ts` contiene 6 productos hardcodeados con URLs de Unsplash. Todos los datos de marcas, categorías e imágenes son ficticios.
- **URL de API base**: `apiClient.ts` apunta a `/api` pero no existe backend configurado. En desarrollo con Vite se necesita un `proxy` en `vite.config.ts` para redirigir `/api` al servidor real.
- **react-router-dom instalado sin usar**: Agrega peso al bundle sin beneficio actual. Podría eliminarse si no se planea routing a corto plazo.
- **`src/assets/`**: Contiene imágenes generadas por Gemini (`Gemini_Generated_Image_*`) que podrían necesitar reemplazo por assets finales.
- **Falta de `useLocalStorage` en el carrito**: ~~El hook existe pero no se usa para persistir el estado del cart. El `CartContext` guarda todo en `useState` puro.~~ **Resuelto**: `CartContext` ahora usa `useLocalStorage` con TTL de 24 horas.
- **Imágenes externas (Unsplash)**: Las URLs de productos y promos dependen de Unsplash. Si el servicio cae, las imágenes no cargan. No hay fallback/placeholder visual.

### Limitaciones técnicas

- Sin backend real → no hay autenticación, no hay persistencia server-side de pedidos.
- Sin sistema de pagos integrado.
- Sin notificaciones push (PWA instalable pero sin backend de push).
- Sin internacionalización (i18n) → toda la UI en español.
- Sin testing automatizado.

### Refactores planeados

- ~~Migrar `CartContext` a usar `useLocalStorage` para persistencia del carrito.~~ **Completado**.
- Implementar lazy loading de features (`React.lazy`) para optimizar bundle cuando se agreguen rutas.
- Evaluar migración a `tRPC` o `fetch` con React Query/TanStack Query cuando exista backend.
- Mover constantes de tienda (`STORE_ADDRESS`, `SOCIAL_LINKS`, etc.) a archivo de configuración externo si se necesita multi-tenancy.

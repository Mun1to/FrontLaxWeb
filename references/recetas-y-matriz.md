# Recetas, matriz y referencias (investigación de 395 fuentes, 2026-07-08)

> **Documento maestro** del que salen las plantillas. Datos verificables (versiones, pesos, licencias,
> umbrales) separados del criterio editorial, etiquetado *[criterio]*. Es una foto de julio de 2026: si
> una versión o un soporte de navegador no coincide con `SKILL.md`, manda `SKILL.md`.

## TL;DR

- **El movimiento se decide por CONTEXTO, no por moda:** fintech/salud, scroll-reveal sutil e
  intensidad baja; marca creativa/portfolio, WebGL e intensidad alta. Anima solo
  `transform`/`opacity`, respeta `prefers-reduced-motion`, presupuesta 16,6 ms/frame (60 FPS).
- **Stack 2025-2026 verificado:** GSAP 100% gratis (incl. plugins Club) desde el 30/04/2025 tras
  la compra por Webflow; Lenis (<4 kB) estándar de smooth scroll; Framer Motion ahora es "Motion"
  (`motion/react`, ~34 kB o 4,6 kB con LazyMotion); ScrollMagic abandonada; Locomotive Scroll v5
  en beta (montada sobre Lenis); CSS scroll-driven animations usables con progressive enhancement.

## Key findings (verificados)

1. **GSAP 100% gratuito desde 30/04/2025** (blog oficial de Webflow): todos los plugins Club
   incluidos (ScrollTrigger, SplitText, MorphSVG, DrawSVG, ScrollSmoother, Inertia) y licencia
   comercial. Adquisición de GreenSock por Webflow anunciada el 15/10/2024.
2. **Lenis es el smooth scroll de facto:** <4 kB, envuelve el scroll nativo (mantiene
   `position: sticky`, anchors y accesibilidad), sincroniza con ScrollTrigger y WebGL desde un
   único rAF. Locomotive v5 se reconstruyó encima de Lenis.
3. **Framer Motion ahora es "Motion"** (`motion/react`). Docs oficiales: ~34 kB mínimo tree-shaken;
   con `m` + `LazyMotion` baja a ~4,6 kB para el primer render; `useAnimate` mini = 2,3 kB.
4. **CSS scroll-driven animations** (`animation-timeline: scroll()` / `view()`): corren en el
   compositor, sin JS, 60 FPS. Chrome/Edge desde 2023; Firefox tras flag; polyfill
   flackr/scroll-timeline. Usar con `@supports (animation-timeline: view())`.
5. **INP reemplazó a FID como Core Web Vital el 12/03/2024** (web.dev). Umbrales p75:
   INP ≤ 200 ms bueno / 200–500 mejorable / >500 pobre; LCP < 2,5 s; CLS < 0,1.
6. **`transform` y `opacity`** son las únicas propiedades que componen en GPU sin layout/paint.
   `will-change` es pista, no bala de plata: en exceso consume memoria (~19 MB por 10 imágenes
   800×600 promovidas a capa).
7. **Tendencias 2025-2026:** brutalismo táctil, tipografía cinética, grano/texturas CSS en lugar
   de WebGL pesado, scroll-driven nativo. El 3D/WebGL genérico "drenó presupuestos de
   rendimiento": usarlo solo cuando la marca ES la experiencia.

## 1. Vocabulario

- **Parallax:** capas a distinta velocidad con el scroll (fondo lento, frente rápido) = profundidad.
  Subtipo de scroll-linked. Cuándo: hero/branding.
- **Scrollytelling:** el scroll avanza una historia por pasos (texto + visual sincronizados).
  Ej.: BBC (citado por NN/g). Cuándo: editorial, ONG, explicaciones complejas.
- **Scroll-linked (scrubbing):** animación atada 1:1 al scroll; retroceder scroll = retroceder
  animación. Ej.: AirPods Pro. Cuándo: demo de producto paso a paso.
- **Scroll-reveal:** anima UNA vez al entrar en viewport. El efecto más seguro y universal.
- **Sticky/pin:** elemento fijo mientras el resto scrollea ("escenas", horizontal scroll, scrubbing).
- **Micro-interacciones de puntero:** hover magnético, cursor con lerp, tilt. Independientes del scroll.

Clave: *reveal* = por visibilidad, corre una vez (IntersectionObserver o `view()`);
*scroll-linked* = progreso continuo mapeado al scroll (ScrollTrigger `scrub` o `scroll()`).

## 2. Referencias de élite (20 webs, con tier)

### Tier 1: WebGL flagship
1. **Igloo Inc** igloo.inc: recorrido WebGL por paisaje helado. Three.js + three-mesh-bvh +
   Svelte + GSAP, texturas KTX2, LCP ~1 s. *Awwwards Site of the Year 2024 + Developer Award.*
2. **Lando Norris** (caso: itsoffbrand.com/our-work/lando-norris): secuencias cinemáticas por
   scroll, casco 3D. Webflow + WebGL + Rive + GSAP/SplitText. *Site of the Year 2025.*
3. **Messenger**: juego WebGL multijugador, UI en WebGL. Three.js + GSAP. *Developer SOTY 2025.*
4. **Lusion** lusion.co: 3D tiempo real, shaders fluido/tela. Three.js + GLSL + GSAP. *SOTY 2023.*
5. **Active Theory** activetheory.net: framework propio "Hydra", entornos 3D a 60 FPS.

### Tier 2: Portfolios creative-dev
6. **Bruno Simon** bruno-simon.com: conducir un coche 3D por el portfolio. Three.js + Cannon.js.
7. **Gen-02 / Samsy** samsy.ninja: "habitaciones" 3D a 120+ FPS. Vue + GSAP + WebGPU.
8. **Dennis Snellenberg** dennissnellenberg.com: parallax + máscaras + botones magnéticos +
   transiciones, SIN WebGL. GSAP + ScrollTrigger + Barba.js. **La referencia clonable.**
9. **Robin Payot** robinpayot.com: navegación 3D + sonido + distorsión de imagen.
10. **Aristide Benoist** aristidebenoist.com: transiciones WebGL de imagen, parallax.
11. **Rogier de Boevé** rogierdeboeve.com: sci-fi, cubos translúcidos. Three.js + GSAP + Astro.

### Tier 3: Estudios y herramientas de scroll
12. **Obys Agency** obys.agency: tipografía cinética con inercia de scroll, layouts
    horizontales. *Studio of the Year 2023.*
13. **Locomotive** locomotive.ca: smooth-scroll + parallax storytelling.
14. **Lenis demo** lenis.darkroom.engineering: referencia de sincronía WebGL+DOM.
15. **Zajno** zajno.com: fluidos WebGL, filtros shader. PixiJS.
16. **Unseen Studio** (⚠️ dominio no re-confirmado): reveals motion-led.

### Tier 4: Referencia / producto
17. **Apple AirPods Pro** apple.com/airpods-pro: el caso canónico de scrubbing de secuencia de
    imágenes a canvas + sticky. ⚠️ También ejemplo de advertencia (scrolljacking, 65 PNG ≈ 15,2 MB).
18. **Hashgraph Ventures** hashgraphvc.com: scroll-telling 3D. Three.js + WebGPU + GSAP. *SOTD+FWA 2025.*
19. **Linear** linear.app: restraint extremo, microestados de 50 ms. **Benchmark SaaS premium.**
20. **Vercel** vercel.com: grid "blueprint", reveals sutiles, movimiento funcional.

No verificadas (no enlazar sin comprobar): Cyanapse/"Panther", Resn, "KPR/KPREK".

## 3. Ecosistema técnico

| Librería | Para qué | Peso (gzip) | Curva | Combina con | Cuándo NO | Estado |
|---|---|---|---|---|---|---|
| GSAP + ScrollTrigger | timelines, scrubbing, pin, SVG | core ~50 kB (+ST aparte) | media | Lenis, Three.js, React (`useGSAP`) | si basta CSS o Motion | **gratis 100% desde 30/04/2025** |
| Lenis | smooth scroll sobre nativo | <4 kB | baja | ScrollTrigger, WebGL, Motion | si no quieres tocar el scroll | activo, estándar de facto |
| Motion (ex Framer) | React declarativo, gestos, layout | ~34 kB (4,6 kB LazyMotion; useAnimate mini 2,3 kB) | baja-media | React, Lenis | Cloudflare Workers; 3D | activo; `motion/react` |
| Locomotive Scroll | smooth + parallax por atributos |: | baja | GSAP | **producción crítica (v5 beta)** | v5 beta sobre Lenis |
| ScrollMagic | scroll-triggers legacy |: | media |: | **siempre** | **abandonada** |
| Rive | animación con state machines | runtime WASM | media | React, vanilla | decorativo simple | activo; ojo `cleanup()` |
| Theatre.js | editor visual de secuencias |: | media-alta | Three.js/R3F | proyectos simples | activo |
| Three.js / R3F | 3D/WebGL | ~150 kB+ | alta | GSAP, Lenis | si la marca no necesita 3D | activo |
| tsParticles | partículas, confeti | modular | baja | todo | si el fondo compite con el contenido | activo |

**Nativas:** CSS scroll-driven (`scroll()` / `view()`, compositor, 0 JS, con `@supports`) +
Intersection Observer (base de reveals accesibles y baratos).

## 4. Las 16 recetas (con dificultad y enfoque)

| # | Efecto | Disparador | Propiedades | Dif. | Enfoque |
|---|---|---|---|---|---|
| 1 | Hero parallax multicapa | scroll | translateY por capa | 2 | ScrollTrigger `scrub` con distinto `y`; o CSS `scroll()`; o `data-scroll-speed` |
| 2 | Scroll-reveal con stagger | visibilidad | opacity, translateY | 1 | Motion `whileInView`+`staggerChildren`; GSAP stagger; `view()`+delay nth-child |
| 3 | Sticky/pin + scrubbing de secuencia (AirPods) | scroll | frame de canvas | 4 | precargar frames WebP, sticky en canvas, de scrollFraction a índice y a drawImage |
| 4 | Texto que se rellena/desvela | scroll | background-clip/color, máscara | 3 | SplitText + `scrub`; o background-size animado |
| 5 | Horizontal scroll section | scroll | translateX | 3 | ScrollTrigger `pin`+`scrub` (de vertical a X) |
| 6 | Velocity skew | velocidad | skewY/scaleY | 3 | `ScrollTrigger.getVelocity()` o `lenis.velocity`, y skew con lerp a 0 |
| 7 | Marquee infinito | tiempo/scroll | translateX | 2 | duplicar contenido + loop; opcional velocidad por scroll |
| 8 | Cursor custom con lerp | puntero | translate | 2 | `pos += (mouse - pos) * 0.1` en rAF; **NO ocultar el cursor real** |
| 9 | Hover magnético | puntero | translate | 2 | offset del centro al cursor con lerp; reset en mouseleave |
| 10 | Zoom/scale al scroll | scroll | scale | 2 | `scrub` sobre scale; o `view()` |
| 11 | Clip-path reveal | visibilidad/scroll | clip-path, scale | 3 | `inset()`/`polygon()` + imagen con scale inverso |
| 12 | Tilt con puntero | puntero | rotateX/Y + perspective | 2 | del ratón a la rotación 3D con lerp |
| 13 | Contadores animados | visibilidad | número | 1 | IO dispara tween con snap a entero (number-flow en React) |
| 14 | Transiciones de página | navegación | opacity, translate, clip | 4 | Motion `AnimatePresence`; vanilla Barba.js + GSAP |
| 15 | Distorsión WebGL | hover/scroll | uniforms shader | 5 | Three.js/OGL displacement; GSAP anima `uProgress` |
| 16 | **Matrioska + parallax** (nueva, tendencia 2026) | scroll | scale, opacity por capa anidada | 4 | Capas anidadas (`position: sticky` o `scale` por `scrollYProgress`), cada una escala hacia dentro mientras la anterior se desvanece: la cámara "entra" en cada capa. Compone recetas 1+10+11: es un parallax de capas (1) donde el "avance" es un zoom (10) recortado con máscara (11), no una traslación. Candidata para el hero de un lanzamiento. |

## 4bis. Micro-interacciones táctiles y de gestos (Apple/WWDC vía skill `apple-design`)

Fuente: github.com/emilkowalski/skills: 17 principios de motion de Apple destilados para web.
Esto NO es scroll/parallax (el terreno ya cubierto arriba): es la física de **tocar y arrastrar**
algo (menús, tarjetas deslizables, modales, sliders): un terreno que FrontLaxWeb no cubría.
Selección de los principios más accionables para web:

- **Interrumpibilidad (el principio más importante de los 17):** cualquier animación debe poder
  agarrarse y redirigirse a media transición. Nunca bloquear la entrada durante una transición.
  Implica usar **springs** (con amortiguación/`damping` + `response`), no `transition` CSS de
  duración fija, para todo lo que el usuario pueda tocar.
- **Traspaso de velocidad:** al soltar un gesto, la animación continúa a la velocidad del dedo
  (no arranca de cero): evita la "costura" visual entre arrastre y animación.
  # (En Motion/Framer: `dragMomentum`, `useSpring` con velocity inicial del `PanInfo`.)
- **Rubber-banding:** en un límite, resistir progresivamente, no frenar en seco.
- **Consistencia espacial:** un panel que entra desde la derecha debe salir hacia la derecha;
  ancla el origen de la transición (`transform-origin`) al elemento que la disparó.
- **Materiales y profundidad:** capas translúcidas flotantes (`backdrop-filter: blur()`) para
  jerarquía: nunca dos superficies translúcidas apiladas directamente.
- Nota de rendimiento: su principio "Frame-Level Smoothness" es literalmente la misma regla de
  oro que ya teníamos (solo animar `transform`/`opacity`): confirmación cruzada, no receta nueva.

**Filosofía (los 8 fundamentos de diseño de Apple, principio #16):** Propósito, Agencia,
Responsabilidad, Familiaridad, Flexibilidad, Simplicidad, Oficio (*craft*), Deleite (resultado de
acertar los siete anteriores). Sirve como ethos de fondo, no como técnica a implementar.

**Tensión resuelta:** el principio #14 de Apple dice que `prefers-reduced-motion: reduce` debe
SUSTITUIR el movimiento por fundidos de opacidad. En este skill queda incorporado como el caso
extremo del dial `--motion-gain`: ver la política de movimiento en `SKILL.md`.

## 5. Rendimiento

- Solo `transform`/`opacity` (animar width/top/left/box-shadow/filter = layout/paint en main thread).
- `will-change` con criterio: activar/desactivar por JS antes/después; nunca global.
- rAF para scroll (ScrollTrigger ya lo hace); throttle/debounce solo para handlers caros (resize).
- Evitar layout thrashing: agrupar lecturas y luego escrituras.
- Lazy para secuencias/vídeo/WebGL; prioridad a frames de checkpoint (técnica Apple).
- **Presupuesto: 16,6 ms/frame.** Medir: DevTools Performance + Rendering > Frame Rendering Stats,
  paint flashing, layer borders.
- **CWV p75: LCP < 2,5 s · INP < 200 ms · CLS < 0,1.** Reservar espacio (`aspect-ratio`) contra CLS.

## 6. Accesibilidad

Lo estándar es esto. La política de este skill gradúa la amplitud con el dial `--motion-gain` en vez de
apagar el movimiento: ver `SKILL.md`, que manda.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- JS/Lenis: `const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;`
  y luego `new Lenis({ smooth: !reduce })`.
- Motion: `<MotionConfig reducedMotion="user">` o `useReducedMotion()`.
- GSAP: `gsap.matchMedia()` con `"(prefers-reduced-motion: no-preference)"`.
- **WCAG 2.3.3 (AAA):** el movimiento no esencial por interacción (incl. parallax) debe poder
  desactivarse. Dato: **35,4% de adultos EE.UU. ≥40 años (69 M) con disfunción vestibular**
  (Agrawal et al., Arch Intern Med 2009, NHANES 2001-2004).
- Preservar anchors y foco de teclado (Lenis lo respeta). Móvil: simplificar (batería/CPU).
- Fallback sin JS: contenido legible siempre; progressive enhancement.

## 7. Tendencias 2025-2026 / quemado

**En alza:** brutalismo táctil, tipografía cinética (variable fonts ligadas a scroll), grano/
texturas CSS, WebGL solo si la marca ES la experiencia, scroll-driven nativo, bento grids,
micro-delight con propósito.

**Quemado:** parallax genérico de hero, preloaders largos, scroll hijacking agresivo, cursores
que ocultan el real, animar TODO al entrar. *[criterio]* Tipografía cinética fuera del hero =
más polish que sustancia.

## 8. Anti-patrones

- Animar layout/paint o abusar de capas GPU da jank; parallax/WebGL constante gasta batería.
- Sin opt-out de movimiento se daña a ~1/3 de los adultos 40+ (WCAG 2.3.3).
- Secuencias sin optimizar bloquean LCP (AirPods: 65 PNG ≈ 15,2 MB; WebP reduce ~90%).
- SEO: contenido tras JS puede no indexarse; CWV degradados penalizan ranking.
- Scroll hijacking: NN/g documenta desorientación e "ilusión de completitud".
- Fondos que compiten con el mensaje.

## 9. MATRIZ DE ADECUACIÓN (la joya)

| Tipo de producto | Objetivo | Efectos recomendados | Efectos a evitar | Intensidad | Por qué |
|---|---|---|---|---|---|
| **SaaS / B2B** | convertir, explicar | reveal+stagger, sticky demo, contadores, hover micro, morph sutil de screenshots | hijacking, WebGL pesado, parallax exagerado | baja-media | claridad e INP mandan (Linear, Vercel) |
| **Fintech / salud** | confianza, lead | fade/slide sutil, reveals suaves, jerarquía tipográfica | parallax profundo, distorsión, cursores ocultos, scrolljacking | baja | público amplio y sensible; sobriedad = confianza |
| **E-commerce / producto físico** | vender, mostrar | sticky+scrubbing de producto, zoom al scroll, galería reveal, 3D ligero (glTF) | secuencias sin optimizar, hijacking en checkout | media | el scrubbing reduce dudas si no penaliza carga (AirPods, con cautela) |
| **Marca creativa / moda / agencia** | branding, impacto | WebGL/shaders, horizontal, tipografía cinética, cursor lerp, transiciones, matrioska+parallax (16) | lo genérico y tímido | alta | la marca ES la experiencia (Obys, Lusion) |
| **Portfolio personal** | demostrar skill | smooth scroll, máscaras, hover magnético, WebGL si es dev | copiar sin criterio, romper a11y | media-alta | debe demostrar oficio (Snellenberg, Bruno Simon) |
| **Herramienta dev / técnica** | confianza técnica | micro-interacciones precisas, reveals sutiles, grid blueprint, code demos | WebGL decorativo | baja-media | el público valora precisión (Vercel, Linear) |
| **Medio / editorial** | historia, retención | scrollytelling, parallax narrativo, reveals progresivos | hijacking ("ilusión de completitud") | media | el scroll es herramienta narrativa (BBC/NN-g) |
| **Landing lanzamiento / evento** | hype, registro | hero parallax, tipografía cinética, marquee, countdown, **matrioska+parallax (receta 16)** | preloaders largos, animar todo | media-alta | impacto efímero justifica más; cuidar primera carga |

## 10. Stack recomendada

**(A) React:** React + Vite + **Motion** (`motion/react` + LazyMotion,
~4,6 kB) + **Lenis**. Añadir **GSAP+ScrollTrigger** solo para scrubbing/pin/SplitText
(sincronizar Lenis con ScrollTrigger vía `gsap.ticker`). R3F solo si la marca justifica 3D.
Umbral: si `whileInView` o `view()` lo resuelven, no metas GSAP.

**(B) Vanilla:** por defecto **CSS scroll-driven** (`view()`/`scroll()`)
+ IntersectionObserver con `@supports` y fallback visible. Para scrubbing/pin/horizontal:
**GSAP + ScrollTrigger (+ Lenis)**. Evitar ScrollMagic y Locomotive v5 en producción.

## 11. Top 10 para estudiar

1. igloo.inc: UI en WebGL con narrativa; masterclass de rendimiento (KTX2, LCP ~1 s).
2. lusion.co: 3D tiempo real como prueba de oficio.
3. activetheory.net: la web como entorno navegable.
4. bruno-simon.com: gamificación con física 3D open source.
5. dennissnellenberg.com: polish sin WebGL; LA referencia clonable.
6. obys.agency: tipografía cinética con inercia.
7. apple.com/airpods-pro: patrón canónico de scrubbing (y sus límites).
8. linear.app: restraint y microestados; benchmark SaaS.
9. vercel.com: minimalismo sistemático.
10. hashgraphvc.com: scroll-telling WebGPU/GSAP verificable.

## 12. Benchmarks de decisión

INP p75 > 200 ms o LCP > 2,5 s en móvil: bajar intensidad un nivel y sustituir JS por CSS nativo.

## Caveats del informe

- Pesos gzip aproximados (dependen de tree-shaking); GSAP ~50 kB no incluye ScrollTrigger.
- CSS scroll-driven aún madura en Firefox: siempre `@supports` + fallback.
- Locomotive v5 beta: esperar breaking changes.
- Algunos stacks de las webs de referencia son "probables" (inferidos de casos de estudio).
- Las "tendencias" son criterio editorial; los datos de librerías/CWV sí son verificables.
- Verificar vigencia de dominios de premios antes de enlazar en producción.

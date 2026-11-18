---
name: frontlaxweb
description: >-
  Diseño de parallax, scroll interactivo, micro-interacciones y gestos premium para landings y
  webs, tanto en React (Motion + Lenis) como en HTML/CSS/JS puro (GSAP + Lenis). Úsalo al
  crear o mejorar hero sections, efectos ligados al scroll, reveals al entrar en viewport,
  sticky/stacking cards, smooth scroll, tilt 3D, arrastrar/soltar con springs, menús y modales
  interrumpibles, o cualquier web que deba sentirse como un "vídeo interactivo" que el usuario
  dirige con el scroll, el ratón o el dedo, siempre rápida (60fps), también sin tarjeta gráfica
  (modo ligero de serie), y con la política de la casa: las animaciones se muestran a TODOS los
  visitantes, ajustando la amplitud del movimiento en vez de apagarlo (dial --motion-gain, con
  válvula ?motion=off).
---

# FrontLaxWeb: parallax y scroll interactivo premium

> Este archivo es el "cerebro": el método. Las recetas y los snippets viven en `plantillas/` y se
> leen bajo demanda. Las rutas `plantillas/`, `references/`, `Designs/` y `Components/` son relativas
> a la carpeta de este archivo.

## Qué logra este skill
Convertir una landing normal en una **web-experiencia**: el scroll y el puntero se vuelven el mando
de una animación continua. Marca-agnóstico: recibe los colores/tokens de cada proyecto.

## Los 7 efectos (el catálogo)
1. **Smooth scroll (cimiento):** Lenis. Base de que todo se sienta premium.
2. **Parallax de capas:** fondos lentos / frente rápido = profundidad.
3. **Scroll-linked animation:** propiedades atadas al % de scroll.
4. **Scroll-reveal:** entrar/animar al aparecer en viewport.
5. **Sticky / pin:** algo se "pega" mientras cambia lo de alrededor (stacking cards).
6. **Micro-interacciones de puntero:** tilt 3D, cursor custom, hover.
7. **Gestos con springs:** arrastrar, soltar, tap: física de resorte
   interrumpible en vez de transiciones CSS de duración fija. Ver sección propia abajo.

## Gestos y springs (fusionado del skill `apple-design` de Emil Kowalski, WWDC destilado)

Terreno DISTINTO al scroll/parallax de arriba: es la física de **tocar y arrastrar** algo (un
menú, una tarjeta deslizable, un modal, un slider). Los principios más accionables para web (de
los 17 originales; el resumen vive en `references/recetas-y-matriz.md` §4bis):

- **Interrumpibilidad, el más importante de los 17:** cualquier animación debe poder agarrarse y
  redirigirse a media transición. Para todo lo que el usuario pueda TOCAR, usar **springs**
  (parámetros: `damping`/amortiguación + `response`/velocidad), nunca `transition` CSS de duración
  fija: un spring siempre sabe animar desde su posición ACTUAL, una transición fija no.
- **Traspaso de velocidad:** al soltar un gesto, la animación sigue a la velocidad del dedo (no
  arranca de cero), y así evita la "costura" visual. En Motion: `dragMomentum` + velocity del
  `PanInfo` como velocidad inicial del spring.
- **Rubber-banding:** en un límite, resistencia progresiva, nunca un tope seco.
- **Consistencia espacial:** un panel que entra desde la derecha sale hacia la derecha; ancla el
  origen (`transform-origin`) al elemento que disparó la transición.
- **Materiales y profundidad:** capas translúcidas flotantes (`backdrop-filter: blur()`) para
  jerarquía visual, nunca dos superficies translúcidas apiladas directamente. Sin tarjeta gráfica
  el modo ligero les quita el desenfoque: su fondo semitransparente tiene que leerse bien solo.
- Confirmación cruzada (no receta nueva): su regla "Frame-Level Smoothness" es la MISMA que ya
  teníamos en Cimientos NO negociables (solo `transform`/`opacity`): dos fuentes independientes
  llegan a la misma regla, más confianza en ella.
- **Filosofía de fondo (los 8 fundamentos de Apple):** Propósito, Agencia, Responsabilidad,
  Familiaridad, Flexibilidad, Simplicidad, Oficio, Deleite (consecuencia de acertar los 7
  anteriores). Es ethos, no una técnica que se implemente: úsalo para justificar decisiones de
  diseño ("¿esto tiene propósito o es ruido?"), no como checklist técnico.

✅ **Tensión resuelta.** El principio #14 de Apple (con
`prefers-reduced-motion: reduce`, sustituir el movimiento por fundidos de opacidad) chocaba de
frente con la política de la casa ("todo para todos", ignorar esa preferencia). Ganó una tercera
vía: **el movimiento no se apaga, se le baja la amplitud.** El principio 14 no queda descartado ni
copiado: queda incorporado como el caso extremo del mismo dial (`--motion-gain: 0` produce
justamente una web de solo fundidos), así que no hay dos versiones de cada efecto que mantener.
La mecánica completa está en "Política de movimiento de la casa" (sección propia, abajo).

## Cimientos NO negociables
- **Rendimiento:** animar SOLO `transform` y `opacity` (GPU). Nunca `top/left/width/height/margin`.
  Usar `will-change` con criterio, `requestAnimationFrame`, y evitar layout thrashing.
- **Sin tarjeta gráfica, modo ligero:** toda web nace con la detección del dibujo por software y su modo
  ligero (sin Lenis, sin desenfoques ni mezclas, 3D con su versión sin 3D). Sección propia abajo.
- **Política de movimiento de la casa:** OBLIGATORIA en todo proyecto. Tiene sección propia justo
  aquí abajo, porque es la regla que más se incumple por descuido.

## POLÍTICA DE MOVIMIENTO DE LA CASA (OBLIGATORIA)

**Todo para todos, con la amplitud justa.** Nadie ve una web muerta. Lo que cambia según el
visitante no es SI hay movimiento, sino CUÁNTO recorrido tiene. Un solo dial gobierna la web
entera: la variable CSS `--motion-gain`, puesta en `<html>` por un script del `<head>`.

| Situación | `--motion-gain` | Qué ve el visitante |
|---|---|---|
| Por defecto | `1` | La experiencia completa. |
| Sistema con `prefers-reduced-motion: reduce` | `0.25` | El mismo diseño con un cuarto de recorrido: el movimiento se lee como acento, no como cámara. |
| URL con `?motion=off` | `0` | Se queda quieto todo lo que se movía solo, y se retira la clase `motion`. Lo que el visitante arrastra con el dedo sigue respondiendo: una tarjeta deslizable que no se desliza no es una interfaz sobria, es una foto rota. Es la válvula de quien no quiere movimiento, no un modo de diseño. |
| URL con `?motion=full` | `1` forzado | Ignora la preferencia del sistema. Para revisar el trabajo desde un equipo con los efectos de animación de Windows desactivados. |

`0.25` es el valor de la casa, ajustable por proyecto si el efecto lo pide, pero nunca `1`:
si con `reduce` no cambia nada, no estás aplicando la política.

**Las tres reglas del dial**
1. `gain` multiplica **recorrido**: píxeles, escala, rotación, skew. En efectos continuos
   (marquee, loops) multiplica la **velocidad**.
2. `gain` **nunca** multiplica la opacidad. Un fundido no marea a nadie. Por eso, al bajar el dial,
   un efecto no se rompe: **degrada**. La matrioska con `gain: 0.25` sigue contando lo mismo, pero
   en forma de fundido encadenado en vez de zoom de cámara. Y por eso esta política no obliga a
   escribir una segunda versión de cada efecto, que es justo lo que costaba el principio 14.
3. `gain` **no escala el movimiento dirigido por el usuario**: arrastrar, hover, tilt con el
   puntero, cursor lerp, springs de gesto. El oído interno no protesta por lo que uno mismo
   provoca. Escala solo el movimiento **no solicitado**: parallax, zoom al scroll, matrioska,
   scrubbing de secuencia, horizontal, velocity skew, marquee.

**Y siempre, además**
4. **Válvula visible.** Aparte de `?motion=off`, un control alcanzable en la interfaz (basta en el
   pie). Una válvula que solo existe en la URL no la encuentra quien la necesita.
5. Foco de teclado y anchors intactos, y contenido legible sin JS (progressive enhancement).

**Accesibilidad, con rigor (verificado contra WCAG, MDN y web.dev, 2026-08-19):**
- Lo que hace CONFORME esta política no es el dial, es la **válvula**. WCAG 2.3.3 (nivel AAA) exige
  poder DESACTIVAR el movimiento, no solo reducirlo; `?motion=off` es ese mecanismo, y por eso es
  obligatoria y descubrible. Un dial que solo encoge, sin apagado real, no cumpliría la letra de 2.3.3.
- `0.25` bajo `reduce` es un PUNTO DE PARTIDA, no un absoluto. Lo que marea es el movimiento de gran
  amplitud (parallax, zoom, translación de gran superficie), no la opacidad ni el desplazamiento
  pequeño. Regla fina: bajo `reduce`, ese movimiento grande hay que llevarlo a ~cero o sustituirlo por
  un fundido, no dejarlo "más pequeño pero presente". Para un reveal de 16 px, `0.25` sobra; para un
  parallax de 300 px, `0.25` todavía marea y hay que ir más abajo o directo a opacidad. Es justo lo que
  respaldan MDN y web.dev: "remove, reduce OR replace".
- **WCAG 2.2.2 "Pause, Stop, Hide" (nivel A, OBLIGATORIO, no AAA):** toda animación automática en bucle
  de más de 5 s (marquee, vídeo de fondo, gradiente en movimiento) DEBE tener un control de pausa o
  stop, y esto el dial NO lo sustituye. Si metes un marquee infinito, lleva su botón de pausa aparte.

**Interruptor central (copiar tal cual en el `<head>`, antes de cualquier CSS de animación):**
```html
<script>
(function () {
  var h = document.documentElement;
  var q = new URLSearchParams(location.search).get('motion');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gain = q === 'off' ? 0 : q === 'full' ? 1 : reduce ? 0.25 : 1;
  h.style.setProperty('--motion-gain', String(gain));
  h.classList.toggle('motion', gain > 0);   // compatibilidad: los estados animados cuelgan de html.motion
})();
</script>
```
En CSS se usa dentro de `calc()`; en JS se lee una vez y se multiplica:
```js
const GAIN = parseFloat(getComputedStyle(document.documentElement)
  .getPropertyValue('--motion-gain')) || 0;
```

## SIN TARJETA GRÁFICA: EL MODO LIGERO (de serie en toda web nueva)

**El caso.** En un ordenador con la aceleración por hardware apagada (pasa igual en muchos ordenadores viejos o de
empresa), tres webs con scroll animado iban a tirones y cloudflare.com fluida.
Medido con la CPU 6x y sin gráfica, a 1920x1080, contando lo que llega a la pantalla:

| Web | Antes | Con el modo ligero | cloudflare.com, igual |
|---|---|---|---|
| SaaS (Lenis, cristal, 3D) | 1,7 fotogramas/s, parón de 2,4 s | 27,5 y 0,13 s | 42,6 y 47 ms |
| Portfolio (Lenis, orbes con blur, 3D) | 4,6 y 372 ms | 24,8 y 84 ms | 45,3 y 49 ms |
| Producto (sin Lenis; nubes con blur, grano en overlay, demo de cristal) | 30,1 y 260 ms | 42,6 y 74 ms | 46,5 y 46 ms |

Con gráfica, el modo ligero no se enciende y **nada cambia** (comprobado píxel a píxel en las tres).

**Por qué.** Sin gráfica, el procesador hace lo que hacía la tarjeta: los desenfoques, las mezclas, el 3D y
componer cada fotograma. Y con Lenis el scroll lo mueve NUESTRO código en cada fotograma: si el hilo principal va a
5 fotogramas por segundo, la página se mueve a 5. El scroll del navegador lo mueve otro hilo y sigue fluido aunque
el principal esté ocupado (por eso cloudflare.com va bien: su código va a 2 fotogramas y su pantalla a 86).

**1. Detectar** (`plantillas/react/dibujoPorSoftware.ts`, o `plantillas/vanilla/modo-ligero.js`): se pide un contexto
con `getContext("webgl2"|"webgl", { failIfMajorPerformanceCaveat: true })`; `null` es dibujo por software. Si da
contexto, se suelta en el acto (`WEBGL_lose_context`). **Una vez por visita y después del primer pintado**, nunca
antes del LCP. `?ligero=1` lo fuerza y `?ligero=0` lo quita; dentro de un `<iframe>` del mismo origen se mira también
la dirección de fuera. En jsdom y en el prerender, se da por hecho que hay gráfica.

**2. Solo en ese caso:**
- **(a) No arrancar Lenis**: scroll del navegador, y en su sitio una pieza nativa con la misma cara (`scrollTo` con
  `smooth`, `stop`/`start` con `overflow: hidden` en `<html>` para los menús, `on("scroll")`, `animatedScroll`). Lo
  hace solo `plantillas/react/useLenis.ts` (y `arrancarScroll()` en vanilla). Los anclajes y los menús no llevan un
  `if` cada uno. No se cuelga de `window.lenis`: Lenis 1.3 ya guarda ahí sus datos.
- **(b) `<html data-ligero>`** y el CSS de `plantillas/vanilla/modo-ligero.css`: `backdrop-filter: none`; un halo de
  `filter: blur()` pasa a un `radial-gradient` que ya nace difuminado (a doble tamaño con la propiedad `scale`, que no
  pisa el `transform` del parallax); un `mix-blend-mode` (el grano en `overlay`) pasa a mezcla normal con menos
  opacidad. Se ve casi igual y se sigue moviendo igual.
- **(c) 3D**: CADA `getContext` WebGL de la web se pide con `failIfMajorPerformanceCaveat: true`, y así cae solo en su
  versión sin 3D, que **tiene que existir** (una imagen, el logo plano o, si era adorno de fondo, nada).
- **(d) Las animaciones, NO.** La política de la casa no cambia: animaciones para todos, se ajusta la amplitud, no se
  apagan. Y está medido: en el SaaS de la tabla, quitar el fondo animado o pausar las de CSS no cambiaba nada (de 28 a 29-30
  fotogramas); en el producto, las motas y la luz del haz, tampoco. Lo que pesa es (a), (b) y (c).

**3. Medir, no suponer** (`plantillas/medir-scroll-visible.mjs`, se lanza desde una carpeta con `playwright-core`):
cuenta los fotogramas que llegan a la pantalla con el scroll movido (emisión de pantalla de Chrome), no los
`requestAnimationFrame`, que con el scroll nativo mienten. Dos medidas, siempre con cloudflare.com al lado en la misma
tanda: `SIN_GRAFICA=1 node medir-scroll-visible.mjs <url> 3 6` (un ordenador sin gráfica) y sin `SIN_GRAFICA` con CPU 4
(un portátil normal). Chrome sin pantalla (el de Lighthouse) dibuja CON gráfica: no vale para esto. **Para encontrar
al culpable, quitar cosas una a una** con CSS inyectado (`display: none`, `filter: none`, `mix-blend-mode: normal`) y
volver a medir: así salieron las nubes del producto de la tabla (de 0,8 s a 0,35 s hasta el primer fotograma), su grano y su demo,
y así se vio que su cristal de la portada y sus motas no pintaban nada.

## Rendimiento con gráfica: cinco reglas para cualquier web con scroll animado

Medidas en dos webs reales (en una, de 580 a 355 ms de trabajo en fotogramas lentos a CPU 4x).
Ninguna quita ni frena una animación: quitan trabajo que no se veía.
1. **Nada de `getAnimations()` en un `animationend`**: obliga a recalcular los estilos de toda la página (~50 ms a 4x,
   a menudo en mitad del scroll). Contar los `animationstart` y `animationend` del elemento.
2. **No pausar al hacer scroll las animaciones que solo mueven `transform`/`opacity`**: van en el compositor y no
   ahorra nada, y pausar y reanudar son dos recálculos grandes por cada scroll.
3. **Nada de montar secciones «en un rato libre» mientras se hace scroll**: Lenis deja huecos libres entre fotogramas
   y `requestIdleCallback` cae justo ahí. Esperar a que el scroll pare.
4. **Nada de escribir estilos en cada fotograma del scroll si no cambian** (`--bn: 0` en cada tarjeta, en cada
   fotograma): guardar el último valor y escribir solo al cambiar.
5. **Una variable de CSS en un padre de la que cuelgan cien hijos se recalcula en los cien** cada vez que cambia. El
   texto que se encendía palabra a palabra escribía `--p` en el bloque y recalculaba todas las palabras
   en cada fotograma; ahora escribe la opacidad solo en las palabras que cambian (con la misma cuenta). Y en el mismo
   fotograma, **leer todo antes de escribir nada** (`getBoundingClientRect` en un bucle que escribe `transform`
   recalcula la página en cada vuelta), y el alto de la página se guarda (con `ResizeObserver`), no se lee en cada
   evento de scroll.

## Cuándo SÍ y cuándo NO
- ✅ SÍ: hero de producto, storytelling de features, "cómo funciona", secciones largas de scroll.
- ❌ NO: formularios, dashboards densos, tablas, checkout, páginas legales, o si baja el LCP/FPS.
- Regla de oro: **el efecto sirve al mensaje, no al revés.** Si distrae o marea, sobra.

## Lo que este skill puede romper: la indexación (cruce con SiteIndex)

El movimiento que se construye aquí toca de lleno lo que la skill `siteindex` mide, así que en
cualquier web pública las dos se leen juntas y **en este orden: primero indexable, luego bonita**.
Si la web no se encuentra, el efecto más cuidado del mundo lo ve solo quien ya sabía la dirección.

- **El contenido tiene que estar en el HTML servido.** Es el fallo más caro y el más fácil de
  cometer justo aquí: en una web de storytelling al scroll, los textos suelen vivir dentro de
  componentes que solo existen cuando el JavaScript monta y el elemento entra en viewport. Los
  buscadores acaban renderizando, pero los asistentes que responden preguntas (Claude, ChatGPT,
  Perplexity) **no ejecutan JavaScript** y se van con las manos vacías. Regla concreta: un reveal
  oculta por CSS algo que YA está en el HTML; nunca decide en JavaScript si el texto existe.
- **INP.** El smooth scroll y el scrubbing interceptan la entrada del usuario. Un scroll
  secuestrado que responde tarde se mide como interacción lenta, y esa métrica es de campo: la
  paga el visitante real, no el laboratorio.
- **LCP.** Las secuencias de imágenes al scroll son el peor delincuente: una animación de 120
  fotogramas son 120 peticiones. Se precargan aparte y jamás por delante del elemento mayor.
- **CLS.** Un reveal que empuja el layout en vez de moverse con `transform` cuenta como
  desplazamiento inesperado, que es exactamente lo que la métrica penaliza.

**Caso propio, para no discutirlo en abstracto:** Vibeset servía `<div id="root"></div>` y nada
más en sus 136 direcciones. Se arregló el 2026-08-17 cocinando el contenido en el build
(`redesign/vite.config.js`, plugin `prerenderMeta`), y `/languages` pasó de cero palabras a 1.112
sin ejecutar JavaScript. La lección que se lleva este skill: el HTML plano y el movimiento no son
enemigos, pero el movimiento no puede ser quien decide qué texto existe.


## EL CUESTIONARIO DE ARRANQUE (obligatorio, antes de tocar una línea)

**Regla dura: FLW no escribe ni una línea de diseño o movimiento hasta que el usuario responde este
cuestionario.** Es la puerta de entrada, no un trámite saltable. Construir sin contexto es exactamente
como sale el diseño genérico. Si el usuario dice "hazlo ya" o "tú decides", se le pasa igual la versión
corta (las tres primeras preguntas): sin eso, no hay brief y no hay obra. Se hace UNA vez por proyecto
y su resultado se guarda como brief.

**Cómo se hace:** una tanda de preguntas en lenguaje de persona, no de sistema. No abrumes, agrupa y
deja responder a su ritmo. Al terminar se DEVUELVE un brief (formato abajo) y solo entonces se construye.

### Las preguntas
1. **El producto en una frase.** ¿Qué es esta web y qué hace? ¿Cuál es la UNA acción que quieres que
   haga el visitante (comprar, registrarse, leer, contactar)?
2. **Para quién y en qué nicho.** ¿Quién la va a ver? ¿Sector? (fintech, moda, SaaS, portfolio, evento).
3. **El tono, en dos ejes.** ¿Más funcional (confianza, sobrio) o más expresivo (impacto, marca)?
   ¿Vende rápido, capta un lead, o cuenta una historia?
4. **La marca.** Tres adjetivos que quieras transmitir. Colores y tipografía si ya los tienes; si no,
   los proponemos.
5. **Tu gusto (aquí entra VibeSet).** Abre **vibeset.dev/components** y **vibeset.dev/concepts** y dime
   2 o 3 efectos o conceptos que te gusten, y por qué. Si tienes 1 o 2 webs que te vuelen la cabeza,
   pégalas. Esto es lo que separa tu web de una plantilla: sin gusto de referencia salen tokens
   genéricos. Las referencias las pone el USUARIO, no la casa.
6. **Lo práctico.** ¿React o HTML/CSS/JS puro? ¿Alguna restricción (rendimiento estricto, público
   sensible al movimiento, plazo)?

### Lo que se entrega al terminar: el brief
Con las respuestas, FLW sitúa el arquetipo en la matriz (abajo) y devuelve un brief corto y accionable:
- **Arquetipo e intensidad** (de la matriz).
- **Dirección de tokens:** tipografía, escala de color y espaciado propuestos (o los de marca), anclados
  a las referencias que dio el usuario. Honestidad: esta capa es la más floja de FLW; sin referencias,
  se marca "a validar", no se inventa.
- **1 o 2 efectos protagonistas** del catálogo, coherentes con el arquetipo. No más.
- **Componentes sugeridos:** de `Components/` y del catálogo de VibeSet, filtrados por arquetipo.
- **Las tres paradas del dial** que tendrá la web.

El brief se enseña y se aprueba ANTES de construir. Es el contrato.

## El contexto del producto MANDA (la teoría detrás del cuestionario)
El efecto no se elige por "molar", se elige por el producto. Sitúa cada web en dos ejes:
- **Funcional frente a expresivo:** fintech/salud/B2B (confianza), sobrio; marca creativa/moda/portfolio, expresivo.
- **Conversión frente a branding/narrativa:** ¿la página vende rápido, capta lead, o cuenta una historia?

Matriz de adecuación (destilada de una investigación de 395 fuentes, 2026-07):
| Arquetipo | Intensidad | Efectos SÍ | Efectos NO | Referente |
|---|---|---|---|---|
| SaaS / B2B | baja-media | reveal+stagger, sticky demo, contadores, hover micro | hijacking, WebGL pesado, parallax exagerado | Linear, Vercel |
| Fintech / salud | baja | fade/slide sutil, jerarquía tipográfica | parallax profundo, distorsión, scrolljacking | - |
| E-commerce / producto físico | media | sticky+scrubbing de producto, zoom al scroll | secuencias sin optimizar, hijack en checkout | Apple (con cautela) |
| Herramienta dev | baja-media | micro-interacciones precisas, grid blueprint, code demos | WebGL decorativo | Vercel, Linear |
| Marca creativa / moda / agencia | alta | WebGL/shaders, horizontal, tipografía cinética, cursor lerp | lo genérico y tímido | Obys, Lusion |
| Portfolio personal | media-alta | máscaras, hover magnético, WebGL si es dev | copiar sin criterio | Snellenberg, Bruno Simon |
| Medio / editorial | media | scrollytelling, parallax narrativo | hijacking | BBC (NN/g) |
| Landing lanzamiento / evento | media-alta | hero parallax, marquee, countdown | preloaders largos, animar todo | - |

Matriz completa con el "por qué" en `references/recetas-y-matriz.md` §9.

## Flujo de trabajo (cómo aplico el skill a una web)
0. **Pasar el cuestionario de arranque** (obligatorio, arriba) y entregar el brief. Manda sobre todo lo demás.
1. **Detectar stack** del proyecto (React+Motion o vanilla) y elegir motor.
2. **Elegir 1–2 efectos protagonistas** coherentes con el arquetipo (no los metas todos; menos es más).
3. Instalar cimiento (Lenis) si procede, **siempre con su modo ligero**: `plantillas/react/useLenis.ts` en React,
   `plantillas/vanilla/modo-ligero.js` + `modo-ligero.css` en vanilla. Nunca un `new Lenis()` suelto.
4. Montar el efecto desde `plantillas/` adaptando tokens de marca.
5. **Pasar el checklist** (abajo) antes de dar por bueno.
6. Antes de cerrar, revisar en cámara lenta (DevTools, throttle de animaciones, o grabar y
   reproducir a 0.25×) y, si es posible, probarlo con alguien real, no solo leerlo en el código
   (principio "Process" de Apple, #17: prototipar interactivamente vale más que diseño estático).

## El kitchen sink: de un nicho a una web entera (flujo completo)

El flujo de arriba resuelve UN efecto. Este resuelve una WEB: parte de por qué existe la página y
de qué va, y encadena todas las capas hasta el resultado. FrontLaxWeb es el cerebro que decide;
las piezas y el conocimiento vienen de fuera. No es una capa mágica nueva, es cablear lo que ya
hay en un solo embudo, y decir en voz alta el eslabón que todavía falta.

**El embudo, capa por capa:**
1. **Contexto: el cuestionario de arranque (obligatorio).** No es opcional ni son tres preguntas
   sueltas: es la puerta descrita arriba, y de ella sale el brief con arquetipo, tokens, efectos y
   componentes. Sin pasar por ahí, todo lo que sigue es decoración.
2. **Tokens de diseño estático: el eslabón que falta, ya con su primer contenido.**
   Tipografía, escala de color, espaciado, jerarquía. FrontLaxWeb es fuerte en movimiento y
   **débil aquí**.
   **Lo que sí existe:** `Designs/INDEX.md`, la librería de LENGUAJES
   visuales completos, cada uno con sus reglas duras y su «cuándo NO». Empieza con el plano
   técnico, y `references/enlaces.md` ya trae las webs de las que sale, leídas de su CSS
   en vivo. Antes de proponer una dirección visual, mirar ahí: si el brief encaja con un lenguaje
   guardado, se aplica ENTERO, porque media adopción se ve peor que ninguna.
   **Lo que sigue sin estar:** generar la escala tipográfica y de color desde cero para un
   arquetipo que no case con ningún lenguaje guardado. Eso se hace a mano (candidato pendiente:
   `senlindesign/taste-skill`). **No fingir que esa parte ya está automatizada.**
3. **Componentes (el almacén, ahora por el MCP de VibeSet).** Para cada bloque de la página,
   mirar ANTES de construir, en este orden: primero el lenguaje elegido en el paso 2
   (`Designs/INDEX.md` dice qué piezas lo forman), después `Components/INDEX.md` (piezas propias
   con su porqué), y luego el catálogo de VibeSet **consultándolo por el MCP**, no a ojo. Con el
   brief ya fijado, se llama a la tool `search` con el arquetipo, `dial: "ok"` y `source: "all"`
   para traer candidatos propios y federados ya filtrados, y a `get_item` para el comando de
   instalación de origen. El propio MCP descarta lo que no cumple: los WebGL decorativos de gran
   amplitud (`cumpleDial:false`, `costeMovimiento:'alto'`) no salen para SaaS ni fintech, que es
   la regla de la matriz hecha dato.
   **La puerta de aceptación:** ninguna pieza que devuelva el MCP entra sin pasar el criterio de
   auditoría de `Components/INDEX.md` (teclado, área pulsable de 24x24 como mínimo, tokens del
   proyecto frente a hex que se rompe en oscuro, si arrastra una librería entera por un efecto de
   nada, y la decisión de copiar o rehacer). El MCP trae candidatos; el juicio de si entran lo
   pone FrontLaxWeb.
   **Cómo se conecta:** `npx mcp-remote https://vibeset.dev/api/mcp`. **Fallback:** si el MCP no
   responde, siguen valiendo las URLs estáticas de `references/enlaces.md`; no bloquea.
4. **Movimiento (lo que FrontLaxWeb sí domina).** Elegir 1–2 efectos del catálogo coherentes con
   el arquetipo y montarlos desde `plantillas/`, con el dial `--motion-gain` de serie.
5. **Cierre.** Pasar el checklist y las tres paradas del dial.

**La regla que sostiene el embudo:** cada capa la manda la de arriba. El nicho decide el
arquetipo; el arquetipo decide qué tokens, qué componentes y qué movimiento entran. Ir de abajo
arriba (elegir un efecto chulo y buscarle un sitio) es justo el error que la matriz existe para
frenar.

**Relación con la skill `/animar-scroll` de VibeSet:** son dos cosas distintas a propósito, no un
duplicado a fusionar. `/animar-scroll` es la versión ligera y de consenso (respeta
`prefers-reduced-motion` apagando el movimiento, que es lo correcto para un consejo general).
FrontLaxWeb es la versión completa, con la política del dial y este embudo. Regla: en una web hecha
con FrontLaxWeb manda FrontLaxWeb; `/animar-scroll` es la puerta de entrada para quien solo quiere
apariciones sencillas. Ninguna debe copiar la regla de accesibilidad de la otra sin querer.

## Checklist final (Definition of Done del efecto)
- [ ] ¿Solo anima transform/opacity? (revisar DevTools, pestaña Performance y paint flashing)
- [ ] ¿60fps (16,6 ms/frame), sin jank, también en móvil?
- [ ] ¿Medido con `medir-scroll-visible.mjs` sin gráfica (`SIN_GRAFICA=1`, CPU 6x) y con gráfica (CPU 4x), con
      cloudflare.com al lado? Sin gráfica, el modo ligero tiene que dejarla cerca de cloudflare.com; con gráfica,
      la web se ve igual con `?ligero=0` que antes de añadirlo.
- [ ] ¿Cada `getContext` WebGL lleva `failIfMajorPerformanceCaveat: true` y su versión sin 3D existe?
- [ ] Core Web Vitals p75: ¿LCP < 2,5 s · INP < 200 ms · CLS < 0,1? Si falla, bajar intensidad
      un nivel y sustituir JS por CSS nativo.
- [ ] ¿Dial aplicado? Todo recorrido no solicitado multiplicado por `--motion-gain`, la opacidad sin
      tocar, y el movimiento que dirige el usuario (gestos, hover, tilt) sin escalar.
- [ ] ¿Válvula visible en la interfaz, y no solo en la URL?
- [ ] ¿Funciona con teclado, anchors y no rompe el foco?
- [ ] ¿Contenido legible sin JS (progressive enhancement)?
- [ ] Si una animación de entrada depende de `requestAnimationFrame` o de un evento, ¿hay
      cinturón de seguridad (`setTimeout` de rescate)? En pestañas en segundo plano rAF NO
      dispara y el contenido se quedaría oculto.
- [ ] ¿Las tres paradas del dial probadas? `?motion=full` (completa), sistema en reduce y
      `?motion=off` (0). En las tres, la web se entiende y no queda contenido invisible.
      Para probar la de en medio en Windows: Configuración > Accesibilidad > Efectos visuales >
      Efectos de animación OFF. Con reduce, el contenido se ve completo y el movimiento de GRAN
      amplitud (parallax, zoom) está neutralizado o pasado a fundido, no solo encogido.
- [ ] ¿Hay algún bucle automático de más de 5 s (marquee, vídeo de fondo, gradiente en movimiento)?
      Si lo hay, ¿tiene su control de pausa/stop? WCAG 2.2.2 (nivel A) lo exige, y el dial no lo cubre.
- [ ] ¿El efecto refuerza el mensaje y encaja con el arquetipo del producto (paso nº0)?

## Motores por stack (verificado con fuentes primarias 2026-08-19)
- **React:** **Motion** (el antiguo Framer Motion; el renombrado fue en noviembre de 2024). Paquete
  `motion`, import `motion/react`, hoy **v14**. Con `LazyMotion` y el componente `m` el arranque baja
  a algo más de 5 kB. Más **Lenis** (paquete `lenis`, ya NO `@studio-freight`; el componente de React es
  `ReactLenis`, import `lenis/react`). Añadir GSAP+ScrollTrigger SOLO para scrubbing/pin/SplitText.
  Umbral: si `whileInView` o CSS `view()` lo resuelven, no metas GSAP.
  - **Sincronizar Lenis con GSAP** (patrón vigente): `lenis.on('scroll', ScrollTrigger.update)` +
    `gsap.ticker.add(t => lenis.raf(t * 1000))` + `gsap.ticker.lagSmoothing(0)`, y arrancar Lenis con
    **`autoRaf: false`**. Si no pones eso, corres dos bucles de rAF a la vez: es el fallo típico.
- **Vanilla:** para reveals y parallax, **CSS scroll-driven** (`animation-timeline: view()`/`scroll()`)
  es la opción de 0 KB y ya va en los tres grandes: Chrome/Edge desde 115, Safari desde 26 y **Firefox
  desde 159** (27-oct-2026, [notas de MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/159)),
  ~89% de soporte global a 11-nov-2026. Sigue siendo **mejora progresiva, no base**, por los navegadores
  viejos. Regla de oro: el estado base es el VISIBLE, y el efecto se monta encima con
  `@supports (animation-timeline: view())`. Si el estado base es `opacity: 0`, el navegador que no lo
  trae no ve NADA (el efecto no degrada solo). Anima solo `transform` y `opacity`: es lo que Chrome y
  Safari mueven fuera del hilo principal (en Firefox, sin comprobar). `@property` sí
  es universal (~94%). Complétalo con IntersectionObserver. Para scrubbing/pin/horizontal: **GSAP +
  ScrollTrigger (+ Lenis)**. Ojo con scroll timeline: `animation-duration` debe ser `auto`, no segundos.
- **GSAP es 100% gratis** desde abril de 2025 (v3.13), tras la compra por **Webflow** (octubre de
  2024): SplitText, MorphSVG y ScrollSmoother incluidos, uso comercial cubierto. Ya no hay Club que
  pagar, pero su licencia prohíbe usar GSAP en constructores visuales sin código que compitan con Webflow.
- **⛔ No usar:** ScrollMagic 2 (versión antigua, y la 3 sigue en beta). Locomotive Scroll 5 ya es estable, pero el motor de la casa es Lenis.
- **WebGL (Three.js/R3F):** solo si la marca ES la experiencia; módulo opt-in con chequeo de
  `matchMedia` y capacidad del dispositivo. El contexto, SIEMPRE con `failIfMajorPerformanceCaveat: true`
  (en Three.js, `new WebGLRenderer({ failIfMajorPerformanceCaveat: true })`), y con su versión sin 3D lista
  para cuando el navegador lo niegue (modo ligero, arriba).

## Transiciones entre páginas: View Transitions API (nativo, verificado 2026-08-19)
El territorio que el scroll no toca: el paso de UNA página a OTRA. Ya es nativo y merece entrar antes
que Barba.js o AnimatePresence para navegación.
- **Same-document (SPA):** `document.startViewTransition(() => actualizarDOM())`. Ya está en las
  cuatro ramas estables (~93%), efectivamente Baseline.
- **Multipágina (MPA), el caso de una landing con varias páginas:** dos líneas de CSS y **cero JS**:
  ```css
  @view-transition { navigation: auto; }
  .hero { view-transition-name: hero; }   /* elementos que persisten entre páginas */
  ```
  Cubre ~88% (Chrome/Edge 126, Safari 18.2). **Firefox aún no** hace la variante MPA, pero **degrada
  solo** a una navegación normal sin animación. Por eso mismo: nunca la uses como ÚNICA señal de un
  cambio de estado, y recuerda que exige **mismo origen**. Encaja con la política de la casa: estado
  final visible siempre, efecto encima donde el navegador lo soporte.

## Trucos de taller (cicatrices reales, aprendidas en casos de uso)
- **"Una web de terceros se ve plana / sin efectos":** mira si el equipo tiene los "Efectos de
  animación" de Windows DESACTIVADOS: las webs que respetan `prefers-reduced-motion` se muestran
  estáticas. En las webs con el dial eso no obliga a tocar Windows: `?motion=full` fuerza la
  experiencia completa desde ese mismo equipo.
- **Interruptor central de movimiento**: el script exacto está en la política de la casa (arriba).
  La clase `motion` en `<html>` sigue siendo el punto único de control de los estados animados, y
  ahora convive con `--motion-gain`, que es quien gradúa la amplitud.
- **Webs anteriores al dial**: un interruptor que solo conoce `?motion=off` trata el movimiento como
  un binario. Al copiar de una web así, traer el motor y sustituir el interruptor por el de la
  política de arriba.
- **Watchdog del observer**: tras `load` + 400ms, añadir `.in` a todo `[data-reveal]` que ya esté
  en viewport. Los IntersectionObserver pueden quedar mudos (pestañas en segundo plano, webviews
  incrustados). Regla de oro: nunca dejes contenido invisible a merced de un observer.
- **Viewport de 0px**: un IO jamás dispara si `innerHeight` es 0 (paneles de preview sin
  dimensionar). Si los reveals no saltan en un entorno embebido, mirar `window.innerHeight` primero.
- **`translate` (propiedad CSS individual) para magnetismo**: no pisa el `transform` de los
  estados hover; ambos se componen.
- **En un efecto de capas anidadas, el centro va VACÍO** (cicatriz de la receta 16):
  la capa siguiente aparece a la mitad de tamaño, es decir, exactamente en el centro de la actual.
  Si ahí pones el titular, padre e hija se pisan y no se lee ninguno de los dos. Contenido en el
  perímetro, centro libre: ese hueco ES el túnel. Se comprueba en un segundo midiendo si el rect
  de la cabecera solapa con el del marco de la capa hija.
- **Si al probar en un panel embebido no se mueve NADA, sospecha del panel antes que del código:**
  `requestAnimationFrame` no dispara en superficies que no componen frames (paneles
  ocultos, pestañas en segundo plano). Se distingue del bug de verdad mirando si el ESTADO avanza
  (eventos, telemetría, clases) aunque el `transform` se quede clavado. Es la misma raíz que la
  regla del watchdog, vista desde el banco de pruebas.
- **Parámetros de spring de la casa** (medidos, no intuidos): respuesta 0,42 s y amortiguación
  0,62 para algo que se agarra con el dedo. Se asienta en ~0,7 s con un rebote corto de unos 8 px.
  Amortiguación 1 es la crítica: llega y para sin rebotar. Nunca por debajo de ~0,5 salvo que el
  producto sea deliberadamente juguetón.
- **Cuanto menos zoom, más corto el cruce**: al bajar el dial, dos capas quedan casi del mismo
  tamaño y un fundido largo las convierte en un borrón de dos titulares. La ventana de solape debe
  depender del dial, no ser una constante. Y con meseta: en cada momento debe mandar una sola capa.

## Plan de plantillas (orden de construcción, de la investigación)
- **Fase 1, núcleo seguro (80% de landings):** hero parallax multicapa · reveal+stagger ·
  cursor lerp · hover magnético · contadores. Dos backends (Motion y vanilla) + reduced-motion de serie.
- **Fase 2, scroll avanzado:** scrubbing de secuencia · horizontal scroll · velocity skew ·
  zoom al scroll · clip-path reveal.
- **Fase 3, WebGL opt-in:** distorsión de imagen · tilt 3D.
- **Fase 4, matrioska + gestos:** receta 16 (matrioska+parallax) ✓ vanilla y React; y una plantilla
  de tarjeta arrastrable con spring interrumpible ✓ vanilla y React. **Fase 4 completa.**

## Índice de recursos (rutas relativas a esta carpeta, leer bajo demanda)
- `references/recetas-y-matriz.md`: **documento maestro**: 16 recetas (§4) + gestos/springs de Apple (§4bis), matriz
  de adecuación completa, 20 referencias con tier, comparativa de motores, reglas CWV/a11y. ✓
- `references/enlaces.md`: librerías para robar patrones (ReactBits, Aceternity, MagicUI, KokonutUI, uiverse), efectos
  OSS concretos (shadergradient v2, liquid-glass-js, liquid-logo, react-three-fiber), herramientas de apoyo (Type
  Scale, Storyset, Squoosh) y notas de tendencias 2026. Revisar antes de construir un efecto desde cero: puede que ya
  exista un componente OSS que hace el 80% del trabajo (ojo a la licencia antes de copiar código literal, la mayoría
  son solo para robar patrón/técnica). **Incluye el almacén de VibeSet** (`vibeset.dev/components`, 43 componentes con
  código copiable) con su criterio de uso.
- `Components/INDEX.md`: librería de piezas de interfaz, cada una con su porqué. Mirar aquí ANTES de construir un
  componente desde cero. Regla de entrada: sin el porqué explicado, la pieza no entra (el código acumulado no mejora
  el diseño, el patrón explicado sí).
- `Designs/INDEX.md`: librería de LENGUAJES visuales completos, que no es lo mismo que la de piezas: `Components/`
  guarda una palabra y `Designs/` un idioma. Cada ficha trae sus reglas duras, sus piezas y un «cuándo NO» obligatorio.
  Se aplica entero o no se aplica: un lenguaje a medias no parece una decisión, parece un descuido. Empieza con el
  plano técnico (líneas de 1px que estructuran, cruces en los nudos, monocromo, esquina recta), que es el que está
  puesto en la portada de Vibeset.
- **Skills de diseño de terceros** (comparadas en `references/enlaces.md`). **Nunca instalar más de un manual de estilo
  a la vez:** dos skills de diseño activos se contradicen entre sí y con este.
- `plantillas/react/RevealStagger.tsx`: receta nº2 React (Motion, variants). ✓
- `plantillas/react/useMotionGain.ts`: **el dial en React**, en un solo archivo que importan las demás plantillas. ✓
  Devuelve el dial como MotionValue (no como estado, o cada `useTransform` se quedaría con el valor viejo en su
  closure) y traduce los parámetros de spring de la casa al vocabulario de Motion: respuesta 0,42 y amortiguación 0,62
  equivalen a `visualDuration: 0.42` y `bounce: 0.38`.
- `plantillas/react/MatrioskaParallax.tsx`: receta nº16 en React. ✓ Misma matemática que la vanilla, con `useScroll` +
  `useTransform`, y el rescate del viewport de 0 px como caída a modo legible.
- `plantillas/react/TarjetaArrastrable.tsx`: gestos en React. ✓ Lo que en vanilla es un integrador escrito a mano, aquí
  lo pone Motion: `drag` da la interrumpibilidad, `info.velocity` de `onDragEnd` da el traspaso de velocidad, y
  `dragElastic` la goma. Leer las dos versiones seguidas es la mejor forma de entender qué hace la librería por debajo.
- `plantillas/react/useLenis.ts` y `dibujoPorSoftware.ts`: **el cimiento en React**, Lenis con el modo ligero de serie
  (sin gráfica o con `?motion=off`, la pieza nativa con su misma cara, `scrollDeLaCasa()`). ✓ Compila con TypeScript
  estricto contra `lenis` 1.3.25.
- `plantillas/vanilla/modo-ligero.js` y `modo-ligero.css`: **lo mismo en vanilla** (`arrancarScroll()` y
  `window.scrollDeLaCasa`), y el CSS de `<html data-ligero>` con el porqué de cada regla. ✓ Probado sin gráfica, con
  gráfica, con `?ligero=1` y con `?motion=off`: anclaje, `stop` y `start` en los cuatro.
- `plantillas/medir-scroll-visible.mjs`: **la medida** de lo que ve el ojo al bajar, sin gráfica y con gráfica. ✓
- `plantillas/vanilla/reveal-stagger.html`: receta nº2 vanilla, comentada. ✓
- `plantillas/vanilla/matrioska-parallax.html`: receta nº16 vanilla, sin dependencias. ✓ Es además la **implementación
  de referencia del dial `--motion-gain`**: lleva el interruptor central de la política nueva, la válvula visible, el
  rescate del viewport de 0 px y el criterio de qué se escala y qué no (parallax de scroll sí, parallax de ratón no).
- `plantillas/vanilla/tarjeta-arrastrable-spring.html`: **plantilla de gestos** (efecto nº7), sin dependencias. ✓ Motor
  de spring propio (respuesta + amortiguación), medición de la velocidad del dedo sobre una ventana de 80 ms, rubber
  banding, reentrada por el mismo lado y control por teclado usando el MISMO spring. Copiar de aquí el motor para
  cualquier cosa que se pueda agarrar: menús, hojas modales, sliders, tarjetas.
- **Implementación de referencia completa (vanilla, en producción, MIT):**
  <https://github.com/Mun1to/Expoal/blob/main/site/index.html>: motor de parallax multicapa (receta nº1: capas
  `data-speed`/`data-mouse` + capas relativas `data-parallax`), line-mask hero, reveal+stagger, botones magnéticos
  (nº9), tilt 3D con CSS scroll-driven, watchdog. Ante la duda en proyectos vanilla, copiar de aquí el MOTOR, pero no el
  interruptor: el suyo es `?motion=off` a secas, anterior al dial `--motion-gain`.
- Pendientes: plantillas sueltas de parallax multicapa, cursor lerp y contadores (Fase 1); envolver las plantillas
  React en `LazyMotion` para bajar el peso, que el skill recomienda y ninguna aplica todavía.

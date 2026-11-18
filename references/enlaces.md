# Enlaces de referencia

Webs, librerías y herramientas para mirar antes de construir un efecto desde cero. Se usan para
estudiar el patrón: antes de copiar código literal, comprueba la licencia de cada proyecto.

**Formato para añadir una referencia del proyecto en curso:**

```
- URL: https://...
  Qué me gusta: (el efecto, la sensación, la sección concreta)
  Tipo: parallax / scroll-linked / sticky / reveal / puntero / estructura
```

## Sitios donde cazar referencias premium

- https://www.awwwards.com/ (Site of the Day)
- https://godly.website/
- https://tympanus.net/codrops/ (demos con código)
- https://thefwa.com/
- https://www.lapa.ninja/
- https://tilda.cc/madeontilda/ (las mejores webs hechas en Tilda)

## Librerías de componentes y efectos (verificadas 2026-07-18)

Colecciones para estudiar patrones:

- https://reactbits.dev/showcase (ReactBits: hero sections y animaciones React)
- https://ui.aceternity.com/ (Aceternity UI: landings con efectos premium. Su licencia no permite redistribuir sus archivos fuente, ni siquiera modificados)
- https://kokonutui.com/ (KokonutUI: componentes de dashboard)
- https://magicui.design/showcase (MagicUI: landings minimalistas)
- https://www.8bitcn.com/ (retro 8-bit sobre shadcn)
- https://uiverse.io/elements (elementos UI abiertos, CSS/Tailwind)

Efectos concretos de código abierto:

- https://github.com/ruucm/shadergradient (gradientes 3D animados; la v2 separa `@shadergradient/react`, solo el renderer, sobre react-three-fiber)
- https://github.com/dashersw/liquid-glass-js (efecto Liquid Glass en WebGL vanilla, sin build step; alternativas: rdev/liquid-glass-react, naughtyduk/liquidGL)
- https://github.com/paper-design/liquid-logo (cualquier logo convertido en metal líquido animado; demo en liquid.paper.design)
- https://github.com/pmndrs/react-three-fiber (three.js declarativo para React)
- https://github.com/emilkowalski/skills (skill `apple-design` de Emil Kowalski: 17 principios de motion de las WWDC destilados para web)

## El catálogo de VibeSet (verificado navegando, 2026-08-19)

`vibeset.dev/components`: efectos en vivo con los mandos a la vista y el código copiable con tus
valores. Código en `github.com/Mun1to/Vibeset`.

**Criterio de uso, más importante que la lista:** son efectos de alto impacto y coste (WebGL,
distorsión de puntero o scroll, canvas). Por la matriz de adecuación, casan con **marca creativa,
portfolio y landing de lanzamiento**, y **chocan** con SaaS, fintech, dashboards y cualquier sitio
donde mande el rendimiento o la sobriedad. Meter `Cloth` o `Bend` en un checkout es exactamente el
error que la matriz existe para evitar. Antes de copiar código literal, mira el `LICENSING.md` del
repositorio.

- `/components/bubble`: gota de cristal que sigue al cursor (puntero)
- `/components/cloth`: tu HTML colgado de una tela al viento (WebGL)
- `/components/dithered`: objeto 3D tramado a un bit (WebGL)
- `/components/ascii-object`: objeto 3D dibujado con letras (WebGL)
- `/components/asciify`: lente que reescribe la web en ASCII (puntero)
- `/components/peel`: la web se despega como una pegatina (scroll)
- `/components/bend`: la web scrollea sobre la cara de un cubo (scroll)
- `/components/particle-scroll`: la web se deshace en arena (scroll)
- `/components/laser`: el contenido se imprime tras un rayo (texto)
- `/components/chroma-glow`: palabra de neón con borde arcoíris (texto)
- `/components/emboss`: palabra prensada en una pared (texto)
- `/components/color-depth`: diez materiales para un botón (interfaz)

## Skills de diseño para el agente (comparadas leyendo sus repositorios, 2026-07-22)

**Elige una, no instales varias.** Se solapan tanto que ya existen repositorios que las fusionan, y
varios manuales de estilo a la vez se contradicen entre sí y con este skill. FrontLaxWeb es fuerte en
movimiento y en el criterio de cuándo aplicarlo, y débil en diseño estático: ahí es donde tiene
sentido buscar ayuda fuera.

- https://github.com/senlindesign/taste-skill: ingeniería inversa del diseño de una web. Extrae tokens con el porqué de cada decisión y no se solapa con este skill. Es la primera candidata.
- https://github.com/pbakaus/impeccable: comandos de auditoría y un detector de reglas deterministas contra los tics del diseño hecho por IA. Sirve para auditar páginas ya construidas, no para investigar referencias.
- https://github.com/leonxlnx/taste-skill: tres diales (layout, movimiento, densidad) que compiten con la matriz por arquetipo de este skill. Descartada por duplicar lo que ya hay. No tiene relación con `senlindesign/taste-skill`, aunque se llamen igual.
- https://github.com/emilkowalski/skills: ya incorporada aquí como séptimo efecto (gestos con springs). No hace falta instalarla aparte.

## Herramientas de apoyo

- https://typescale.com/ (jerarquía tipográfica calculada por ratio)
- https://storyset.com/ (ilustraciones personalizables y animables; gratis con atribución, exporta SVG y Lottie)
- https://squoosh.app/ (optimizador de imágenes de Google, corre en el navegador)

## Tendencias 2026

- Animaciones de carga e imágenes reales flotando por la página.
- Más parallax y overlays (capas superpuestas).
- Imágenes de la vida real con parallax, no solo ilustraciones planas.
- El vídeo de fondo vuelve a estar de moda; carruseles ligados al scroll.
- Matrioska + parallax: efecto de anidamiento, la cámara entra en cada capa. Candidato para heros premium.

## Referencias premium para estudiar

Estúdialas observando un efecto cada vez:

- **Apple** (páginas de producto, por ejemplo AirPods Pro): el patrón rey de *scroll-linked storytelling*, el producto gira o se arma según bajas.
- **Firewatch** (firewatchgame.com): parallax multicapa de manual, capas de bosque a distinta velocidad.
- **The Boat** (SBS): *scrollytelling* narrativo, el scroll cuenta una historia.
- **PORSCHEvolution**: línea de tiempo controlada por scroll.
- **B/UXSTUDIO**: Awwwards Honorable 2024, denso en scroll-triggered.
- **Custo**: parallax sutil y elegante, la lección de que menos es más.

### Demos con código (Codrops)

Comprueba la licencia de cada demo antes de copiar código literal.

- 3D scroll-driven text: https://tympanus.net/codrops/2025/11/04/creating-3d-scroll-driven-text-animations-with-css-and-gsap/
- Sticky Grid Scroll: https://tympanus.net/codrops/2026/03/02/sticky-grid-scroll-building-a-scroll-driven-animated-grid/
- On-Scroll 3D Stack: https://tympanus.net/codrops/2024/03/06/on-scroll-3d-stack-motion-effect/
- Todas: https://tympanus.net/codrops/tag/scroll/

## Estructura de plano técnico (blueprint grid), verificado abriendo cada web el 2026-08-20

Aquí la referencia no es un efecto de movimiento: es cómo se organiza la página. La pieza está
destilada en `Components/snippets/rejilla-tecnica.html` con su porqué.

- URL: https://peership.dev/es
  Qué me gusta: las líneas que enmarcan cada sección y las cruces en las esquinas.
  Tipo: estructura (sin movimiento).
  Cómo: canal centrado con `border-x`, sección con `border-b`, cruces SVG `M8 3V13M3 8H13` desplazadas media cruz hacia fuera, puntos de fondo a 14px, botones de esquina recta con marcas en L. Paleta Flexoki.

- URL: https://www.cloudflare.com/
  Qué me gusta: el mega-menú de columnas con divisoria vertical y pie separado.
  Tipo: navegación.
  Cómo: rejilla de seis columnas, rótulo de categoría en gris pequeño, item en dos líneas (nombre en negrita y qué hace debajo) y una horizontal que separa el pie del panel.

- URL: https://tailwindcss.com/
  Qué me gusta: es la versión más limpia de las tres, aunque no la más vistosa.
  Tipo: estructura.
  Cómo: las líneas NO son bordes, son filas y columnas de 1px del propio grid (`grid-rows-[1fr_1px_auto_1px_auto]`), un solo token `--pattern-fg` las colorea todas, y los márgenes van rayados con `repeating-linear-gradient(315deg, ...)` a 10px.

**Lo que dicen los blogs y no es verdad.** A este estilo lo llaman «Vercel aesthetic», pero se
abrieron las dos webs que más se citan y **ni vercel.com ni resend.com lo usan ya**: Vercel se pasó a
shaders y degradados. Si hace falta una referencia viva, son las tres de arriba.

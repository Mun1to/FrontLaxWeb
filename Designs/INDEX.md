# Designs: lenguajes visuales completos

Aquí no van piezas sueltas, van **lenguajes completos**: la forma entera de vestir una web, con
sus reglas duras, de dónde sale y cuándo NO se usa.

## Por qué existe esto aparte de `Components/`

Es la diferencia entre una palabra y un idioma, y confundirlas es justo lo que produce webs a
medias:

- **`Components/`** guarda **una pieza**: un menú con la píldora que se desliza, una rejilla
  técnica. Se copia y funciona sola.
- **`Designs/`** guarda **un lenguaje**: la esquina recta, el rótulo monoespaciado, el color
  monocromo, la retícula. Nada de eso funciona solo. **Media adopción se ve peor que ninguna**,
  porque un lenguaje aplicado a medias no parece una decisión, parece un descuido.

Regla que sale de ahí: cuando se coge un diseño de esta carpeta, se aplican sus reglas duras
enteras a la zona que se toque, o no se coge.

## Formato de la ficha

```
## Nombre del lenguaje
De dónde sale: las webs reales que lo usan hoy, comprobadas abriéndolas.
Qué comunica: la sensación en una frase, que es lo que decide si encaja.
Reglas duras: lo que no se negocia. Si una se rompe, el lenguaje se cae.
Cuándo NO: los sitios donde este lenguaje estorba. Esta parte es la más útil.
Piezas: qué archivos de `Components/` lo implementan.
Dónde está puesto: webs reales que ya lo usan.
```

**La sección «Cuándo NO» no es opcional.** Un lenguaje sin contraindicaciones escritas se acaba
usando en todo, y entonces todas sus webs se parecen entre ellas en vez de parecerse a lo que
cada una es. Es el mismo criterio de la matriz de adecuación de `references/recetas-y-matriz.md`.

## Cuándo partir esto en subcarpetas

Con menos de unos 8 lenguajes, una lista plana se lee de un vistazo y `Ctrl+F` basta. A partir de
ahí, se parte por **sensación** (sobrio, expresivo, editorial), nunca por tecnología.

## Relación con Vibeset

Igual que `Components/`: **Vibeset es el escaparate**. Un lenguaje sale
al público cuando tiene sus reglas duras escritas, su «cuándo NO» y al menos una pieza que se
pueda tocar. Con un solo lenguaje documentado no hay sección que publicar: la puerta se abre
cuando haya tres o cuatro, y entonces cada ficha lleva su ejemplo en vivo, como ya hacen los
componentes.

---

## Los lenguajes

## Plano técnico (blueprint grid)

**De dónde sale:** `tailwindcss.com`, `peership.dev` y el mega-menú de `cloudflare.com`, leídos de
su CSS en vivo el 2026-08-20. ⚠️ Los blogs lo llaman «Vercel aesthetic» y ya no es cierto: se
abrieron las dos webs que más se citan y **ni vercel.com ni resend.com lo usan**; Vercel se pasó a
shaders y degradados.

**Qué comunica:** que esto está medido y montado por alguien que sabe. Rigor, no espectáculo.

**Reglas duras:**

1. **Las verticales del canal no se cortan nunca** al pasar de una sección a otra. Esta es la
   regla que sostiene el lenguaje entero: la sensación de plano no la da la trama de fondo, la
   dan esas dos líneas. La trama al 8% se puede quitar y casi no se nota.
2. **Esquina recta** en todo lo que forme parte de la retícula. Las tarjetas y los botones que ya
   existían pueden seguir redondeados (Cloudflare y Tailwind lo hacen así), pero la retícula no.
3. **Monocromo con un solo acento.** Las cruces y las marcas van en tinta, negro sobre claro y
   blanco sobre oscuro. Si el proyecto ya usa el color para clasificar, una cruz de color se lee
   como una categoría más en vez de como la retícula.
4. **Un solo token colorea todas las líneas**, bordes y trama incluidos (`--pattern-fg` en
   Tailwind). Con un token por pieza, el día que la línea queda fuerte siempre queda una sin tocar.
5. **La trama nunca pasa del 10% de opacidad.** Si se lee como textura, ya está mal. Y necesita
   más opacidad en claro que en oscuro para verse igual, así que se decide mirando la pantalla.
6. **Nunca bordes en los cuatro lados de una celda de retícula:** `border-right` y
   `border-bottom`, y el último sin. Con los cuatro salen 2px donde dos celdas se tocan.

**Cuándo NO:** en una web que vende **calidez** (una marca personal, algo hecho a mano, comida,
cuidados). Este lenguaje es frío por diseño y ahí resta. Tampoco en una web donde el color ya
carga significado propio y abundante, porque el monocromo de la regla 3 obliga a elegir. Y no en
un sitio con contenido escaso: la retícula deja al descubierto lo vacío que está, que es
justamente lo que hace que funcione cuando hay mucho que enseñar.

**Piezas:** `Components/snippets/rejilla-tecnica.html` (las cuatro técnicas por separado, con el
porqué de cada una y el detalle que se pierde al copiarlas de memoria).

**Dónde está puesto:** la portada de **Vibeset** desde el 2026-08-20
(`redesign/src/components/Plano.jsx`, con `Banda`, `Canal`, `Nudos` y `Encuadre`). Las vistas de
catálogo no lo llevan y es a propósito: tienen menú lateral, así que no son una columna y el
canal centrado no tiene dónde agarrarse.

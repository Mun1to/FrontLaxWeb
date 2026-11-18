# Components: librería de piezas

Piezas gráficas y de interfaz para reutilizar en webs y apps.

**Vive dentro de FrontLaxWeb a propósito.** No es un proyecto aparte: es el arsenal del skill.

## La regla que da sentido a esta carpeta

Cada pieza se guarda **con su porqué en una línea**. Sin el porqué, esto sería una carpeta de
código acumulado, y el código acumulado no mejora el diseño: solo da más cosas que pegar.

Lo que de verdad reduce el diseño genérico es **el patrón explicado**. Por eso el índice es el
archivo importante, no los snippets. Si un día hay que elegir entre mantener actualizado el
índice o los archivos, se mantiene el índice.

Es exactamente el mismo criterio que `references/enlaces.md` aplica a las webs de
referencia, pero aquí aplicado a piezas concretas.

## Formato del índice

```
- `snippets/nombre-descriptivo.html`: qué es en pocas palabras.
  Por qué: la razón por la que esta pieza es buena y no genérica.
  Cómo: (opcional) el detalle de implementación que la salva. Va aparte del porqué
  porque una idea buena mal ejecutada se siente barata, y ese detalle suele ser
  justo lo que se pierde al copiarla de memoria.
  Visto en: (opcional) de dónde salió la idea.
```

## Cómo se busca aquí

No hay categorías todavía, y es deliberado: crear carpetas por tipo (botones, tarjetas, fondos)
antes de tener piezas sería inventar estructura para una necesidad que aún no existe. Con pocas
piezas, una lista plana se lee de un vistazo y `Ctrl+F` basta.

**Cuándo partir esto en subcarpetas:** cuando el índice pase de unas 25 piezas o cuando una
categoría clara acumule 6 o más. Entonces se parte por tipo de pieza, no por tecnología.

## Reglas para añadir una pieza

1. Un archivo por pieza en `snippets/`, con nombre descriptivo en español y en minúsculas.
2. Autocontenido: que se pueda abrir o pegar sin dependencias raras. Si necesita una librería,
   se dice en la primera línea del archivo.
3. Su línea en este índice, con el porqué. Sin porqué, la pieza no entra.
4. Si la pieza es de otro (una colección OSS, un demo de Codrops), se anota la fuente y se
   revisa la licencia antes de copiar código literal. Para robar el patrón no hace falta licencia;
   para copiar el código, sí.

## Relación con `plantillas/`

- `plantillas/` son las **recetas de movimiento** del skill: implementaciones de referencia del
  catálogo de efectos, pensadas para enseñar la técnica.
- `Components/` es la **colección de piezas**: cualquier pieza de interfaz que valga la pena,
  se mueva o no.

Si una pieza de aquí acaba siendo una receta canónica del catálogo, se promueve a `plantillas/`.

## Relación con `Designs/` (una palabra no es un idioma)

`Components/` guarda **una pieza**, que se copia y funciona sola. `Designs/` guarda **un lenguaje
visual completo**, que no funciona en trozos: la esquina recta, el monocromo, el rótulo
monoespaciado y la retícula solo significan algo juntos.

Cuando una pieza de aquí forma parte de un lenguaje de allá, su ficha lo dice y la de allá lista
sus piezas. **Al coger la pieza suelta hay que mirar antes el lenguaje**, porque casi siempre
trae reglas que la pieza sola no puede contar: `rejilla-tecnica.html` se ve rara sobre esquinas
redondeadas, y eso está escrito en `Designs/INDEX.md`, no aquí.

## Relación con Vibeset (la puerta de salida)

**Vibeset es el escaparate** de estas piezas. El circuito, en las dos direcciones:

- **De aquí a Vibeset.** Una pieza sale al público cuando su porqué está escrito y aguanta que
  la lea un desconocido. Si la recreamos nosotros, se publica en `vibeset.dev/components` como
  código propio. Si es de otro y está bien construida, se enseña con crédito, enlace y licencia,
  que es como ya están los 12 efectos de canvasui y arlan.
- **De Vibeset a aquí.** La sección `vibeset.dev/resources` tiene la cantera ya ordenada:
  «Botones y efectos», «Componentes y librerías UI» y «Inspiración». De ahí no se copia en
  bloque; se saca una pieza, se le busca el porqué y entra por la regla de arriba.
- **El criterio para elegir entre copiar y rehacer** (el criterio de la casa): si el
  componente está bien construido y no le falta nada, se copia con crédito al autor; si se puede
  mejorar de verdad, se rehace con código propio. Quien lo decide es una revisión de código de
  la pieza, no la primera impresión. En piezas pequeñas eso casi nunca es el rendimiento: es si
  arrastra una librería entera por un efecto de nada, si funciona con teclado, si el área
  pulsable llega a 24x24 y si usa los tokens del proyecto en vez de un hex que se rompe en tema
  oscuro.


---

## Las piezas

- `snippets/header-pildora-deslizante.html`: menú de navegación en el que una sola píldora
  viaja hasta el item señalado, tanto con el ratón como con el tabulador.
  Por qué: lo genérico es dar a cada item su propio fondo, y entonces el ojo ve cinco luces
  encendiéndose y apagándose, que no significan nada. Con un único objeto que se mueve, el ojo
  lee continuidad: es la misma cosa, que ahora está en otro sitio. El menú deja de ser cinco
  luces y pasa a ser un objeto que tú mueves. Cuesta lo mismo y comunica más.
  Cómo: la mueve un spring, no una transición, así que al recorrer el menú deprisa redirige a
  media trayectoria en vez de encadenar viajes. Y el radio de las esquinas se divide por la
  escala en cada frame; sin esa compensación, al escalar en X la píldora se deforma en elipse.
  Ese es el detalle que separa esta pieza de la versión de andar por casa.
  Visto en: capturas de un header oscuro (Catalog, Schedule, Case study, Blog, Pricing), sin URL
  anotada. La idea viene de ahí; el código es propio.

- `snippets/rejilla-tecnica.html`: el lenguaje de plano técnico, con sus cuatro piezas por
  separado: el canal de dos verticales continuas, las cruces en los nudos, la trama de fondo y
  las marcas de encuadre en L.
  Por qué: lo que casi todo el mundo copia de este estilo es el fondo de rejilla, que es
  justamente la pieza que menos hace. La sensación de plano no la da la trama, la dan las **dos
  líneas verticales que recorren la página entera sin cortarse** entre secciones: son las que
  convierten una pila de bloques sueltos en un documento con márgenes. La trama al 8% se puede
  quitar y casi no se nota; quita el canal y se cae el estilo entero.
  Cómo: tres detalles que se pierden al copiarlo de memoria. **(1)** Las verticales van en un
  contenedor interior centrado y las horizontales en la banda de fuera; si las verticales se
  ponen por sección, en cada empalme se ven dos líneas de 1px pegadas donde debería haber una.
  **(2)** La cruz se desplaza media cruz hacia fuera con `translate(±50%,±50%)`, para que su
  centro caiga sobre el cruce de las líneas; sin ese desplazamiento queda dentro de la caja y
  parece un icono decorativo suelto, no un nudo de la retícula. **(3)** Un único token
  (`--pattern-fg` en Tailwind, `--plano` aquí) colorea bordes, rayado y puntos a la vez: con un
  token por pieza, el día que la línea queda fuerte hay que tocar cinco sitios y siempre se
  queda uno. Y la esquina es recta siempre: un solo `border-radius` y el lenguaje se cae.
  Visto en: cloudflare.com y peership.dev. Leído del CSS en vivo de
  las dos, más `tailwindcss.com`, el 2026-08-20. **Cuidado con la lista que circula por los
  blogs:** llaman a esto «Vercel aesthetic», pero se comprobó abriendo las webs y ni vercel.com
  ni resend.com lo usan ya. Quien lo tiene mejor montado hoy es Tailwind, que dibuja las líneas
  como **filas y columnas de 1px del propio grid** (`grid-rows-[1fr_1px_auto_1px_auto]`) en vez
  de como bordes, y raya los márgenes con `repeating-linear-gradient(315deg, ...)`.

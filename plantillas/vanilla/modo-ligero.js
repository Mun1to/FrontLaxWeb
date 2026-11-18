/* ============================================================================
   FrontLaxWeb · modo-ligero.js (vanilla, sin dependencias salvo Lenis si lo usas)
   SIN TARJETA GRÁFICA, LA WEB VA LIGERA. CON GRÁFICA, NO CAMBIA NADA.

   El caso: con la aceleración por hardware apagada, dos webs con Lenis iban a 1,7
   y 4,6 fotogramas por segundo y otra daba parones de 260 ms; cloudflare.com,
   a 45. Sin gráfica,
   el procesador hace lo que hacía la tarjeta: desenfoques, mezclas, 3D, y
   pintar cada fotograma. Y con Lenis el scroll lo mueve el hilo principal.

   Qué hace este archivo, y nada más:
     1. Mira UNA vez, después del primer pintado, si el navegador dibuja por
        software: pide un contexto WebGL con `failIfMajorPerformanceCaveat`, que
        se niega (null) cuando solo habría SwiftShader. `?ligero=1` lo fuerza y
        `?ligero=0` lo quita; dentro de un <iframe> del mismo origen mira también
        la dirección de fuera.
     2. Si es así, pone <html data-ligero> (el CSS: modo-ligero.css) y NO
        arranca Lenis: deja el scroll del navegador, que va en otro hilo.
     3. En `window.scrollDeLaCasa` deja siempre algo con la cara de Lenis (el
        de verdad, o una pieza nativa con scrollTo, stop, start, on y
        animatedScroll), para que los anclajes y los menús no necesiten un `if`
        cada uno. (No en `window.lenis`: Lenis 1.3 ya guarda ahí sus datos.)

   Las animaciones NO se apagan: medido en una web real, quitarlas no cambiaba
   nada (de 28 a 29-30 fotogramas). Lo que pesa es lo de arriba.

   Uso, al final del <body> (y Lenis antes, si lo usas):
     <script src="https://unpkg.com/lenis@1.3.25/dist/lenis.min.js"></script>
     <script src="modo-ligero.js"></script>
     <script>
       arrancarScroll({ duration: 1.1 }).then((scroll) => {
         // scroll.scrollTo('#precios', { offset: -72 })
       })
     </script>
   ========================================================================= */

(function () {
  'use strict'

  var calculado = null

  function pedido() {
    var ventanas = [window, window.parent]
    for (var i = 0; i < ventanas.length; i++) {
      try {
        var v = new URLSearchParams(ventanas[i].location.search).get('ligero')
        if (v) return v
      } catch (e) {
        /* un marco de otro origen: no se mira */
      }
    }
    return null
  }

  function dibujoPorSoftware() {
    if (calculado !== null) return calculado
    calculado = (function () {
      try {
        var forzado = pedido()
        if (forzado === '1') return true
        if (forzado === '0') return false
        if (typeof WebGLRenderingContext === 'undefined') return false
        var lienzo = document.createElement('canvas')
        var op = { failIfMajorPerformanceCaveat: true }
        var gl = lienzo.getContext('webgl2', op) || lienzo.getContext('webgl', op)
        if (!gl) return true
        var perder = gl.getExtension('WEBGL_lose_context')
        if (perder) perder.loseContext()
        return false
      } catch (e) {
        return false
      }
    })()
    return calculado
  }

  /** El scroll del navegador con la cara de Lenis. */
  function scrollNativo(suave) {
    var raiz = document.documentElement
    return {
      get animatedScroll() { return window.scrollY },
      get scroll() { return window.scrollY },
      scrollTo: function (destino, o) {
        o = o || {}
        var el = typeof destino === 'string' ? document.querySelector(destino) : destino
        var y = typeof el === 'number' ? el : el && el.getBoundingClientRect ? el.getBoundingClientRect().top + window.scrollY : null
        if (y === null) return
        window.scrollTo({ top: y + (o.offset || 0), behavior: o.immediate || !suave ? 'auto' : 'smooth' })
      },
      stop: function () { raiz.style.overflow = 'hidden' },
      start: function () { raiz.style.overflow = '' },
      resize: function () {},
      on: function (evento, fn) {
        if (evento !== 'scroll') return function () {}
        var oyente = function () { fn() }
        window.addEventListener('scroll', oyente, { passive: true })
        return function () { window.removeEventListener('scroll', oyente) }
      },
    }
  }

  /** Arranca el scroll de la casa después del primer pintado. Devuelve una promesa con él. */
  function arrancarScroll(opciones) {
    return new Promise(function (listo) {
      requestAnimationFrame(function () {
        setTimeout(function () {
          var raiz = document.documentElement
          var gain = parseFloat(getComputedStyle(raiz).getPropertyValue('--motion-gain')) || 0
          var ligero = dibujoPorSoftware()
          if (ligero && gain > 0) raiz.setAttribute('data-ligero', '')
          if (ligero || gain === 0 || typeof window.Lenis !== 'function') {
            window.scrollDeLaCasa = scrollNativo(gain > 0)
          } else {
            window.scrollDeLaCasa = new window.Lenis(Object.assign({
              duration: 1.1,
              easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)) },
              smoothWheel: true,
              autoRaf: true,
            }, opciones || {}))
          }
          listo(window.scrollDeLaCasa)
        }, 0)
      })
    })
  }

  window.dibujoPorSoftware = dibujoPorSoftware
  window.arrancarScroll = arrancarScroll
})()

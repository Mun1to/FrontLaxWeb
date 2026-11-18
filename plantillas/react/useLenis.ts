/**
 * FrontLaxWeb · El cimiento: Lenis, con su modo ligero de serie
 * ------------------------------------------------------------------------------------------
 * Se llama UNA vez, en la raíz de la app: `useLenis()`. Con gráfica arranca Lenis como siempre
 * (los números son los de la casa: 1,1 s y easeOutExpo; por debajo de 0,8 s se siente
 * demasiado rápido y deja de parecer suave). Lo que el usuario sintió suyo no se toca para optimizar: si va
 * lento, el culpable casi nunca es Lenis (ver «Rendimiento con gráfica» en SKILL.md).
 *
 * SIN TARJETA GRÁFICA (dibujoPorSoftware.ts) no arranca Lenis: con Lenis el scroll lo mueve el
 * hilo principal en cada fotograma, y por software ese hilo no da abasto; el scroll del
 * navegador lo mueve otro hilo y va fluido aunque el principal esté ocupado (medido con CPU 6x
 * y sin gráfica: de 1,7 a 27,5 fotogramas por segundo). Pone además <html data-ligero>, del que
 * cuelga el CSS que quita desenfoques y mezclas (SKILL.md). Las animaciones NO se apagan.
 *
 * `scrollDeLaCasa()` devuelve siempre algo con la misma cara: el Lenis de verdad o, sin gráfica,
 * una pieza hecha con el scroll del navegador con lo que una web suele usar de Lenis (bajar a un
 * sitio, parar el fondo con un menú encima, saber dónde está). Así los anclajes y los menús
 * funcionan igual en los dos casos, sin un `if` en cada componente. (No se cuelga de
 * `window.lenis`: Lenis 1.3 ya guarda ahí sus propios datos y su tipo choca.)
 *
 * Con `?motion=off` (dial a 0) tampoco arranca Lenis: queda la misma pieza nativa, sin `smooth`.
 */
import { useEffect } from "react";
import Lenis from "lenis";
import { dibujoPorSoftware } from "./dibujoPorSoftware";

export type ScrollDeLaCasa = {
  readonly animatedScroll: number;
  readonly scroll: number;
  scrollTo(destino: number | string | Element, o?: { offset?: number; immediate?: boolean }): void;
  stop(): void;
  start(): void;
  resize(): void;
  on(evento: string, fn: (...args: unknown[]) => void): () => void;
};

let actual: ScrollDeLaCasa | Lenis | null = null;

/** El scroll que hay ahora: Lenis, la pieza nativa, o null antes de montar useLenis. */
export function scrollDeLaCasa(): ScrollDeLaCasa | Lenis | null {
  return actual;
}

/** El scroll del navegador con la cara de Lenis. `suave: false` con el dial a 0. */
export function scrollNativo(suave = true): ScrollDeLaCasa {
  const raiz = document.documentElement;
  return {
    get animatedScroll() {
      return window.scrollY;
    },
    get scroll() {
      return window.scrollY;
    },
    scrollTo(destino, o = {}) {
      const el = typeof destino === "string" ? document.querySelector(destino) : destino;
      const y = typeof el === "number" ? el : el instanceof Element ? el.getBoundingClientRect().top + window.scrollY : null;
      if (y === null) return;
      window.scrollTo({ top: y + (o.offset ?? 0), behavior: o.immediate || !suave ? "auto" : "smooth" });
    },
    // Para un menú o una ventana encima: el fondo no se mueve con la rueda ni con el dedo.
    stop() {
      raiz.style.overflow = "hidden";
    },
    start() {
      raiz.style.overflow = "";
    },
    resize() {},
    on(evento, fn) {
      if (evento !== "scroll") return () => {};
      const oyente = () => fn();
      window.addEventListener("scroll", oyente, { passive: true });
      return () => window.removeEventListener("scroll", oyente);
    },
  };
}

export function useLenis(): void {
  useEffect(() => {
    const raiz = document.documentElement;
    const gain = parseFloat(getComputedStyle(raiz).getPropertyValue("--motion-gain")) || 0;

    if (dibujoPorSoftware() || gain === 0) {
      if (gain > 0) raiz.setAttribute("data-ligero", "");
      actual = scrollNativo(gain > 0);
      return () => {
        raiz.removeAttribute("data-ligero");
        raiz.style.overflow = "";
        actual = null;
      };
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // NO syncTouch: saca el scroll táctil del compositor y lo mete en el hilo principal,
      // donde cualquier tirón se nota en el dedo (probado). En el móvil manda el
      // scroll nativo; Lenis solo suaviza la rueda.
      autoRaf: true,
    });
    actual = lenis;
    return () => {
      lenis.destroy();
      actual = null;
    };
  }, []);
}

/* -------------------------------------------------------------------------------------------
 * EJEMPLO DE USO
 * -------------------------------------------------------------------------------------------
 * function App() {
 *   useLenis();
 *   return <Rutas />;
 * }
 *
 * // un anclaje del menú, igual con gráfica o sin ella:
 * scrollDeLaCasa()?.scrollTo("#precios", { offset: -72 });
 *
 * // un menú que tapa la página:
 * useEffect(() => { if (abierto) scrollDeLaCasa()?.stop(); else scrollDeLaCasa()?.start(); }, [abierto]);
 *
 * Si la web usa GSAP con ScrollTrigger, NO autoRaf: `autoRaf: false`, y el patrón de SKILL.md
 * («Sincronizar Lenis con GSAP»). Sin gráfica, ScrollTrigger escucha el scroll nativo él solo.
 * ----------------------------------------------------------------------------------------- */

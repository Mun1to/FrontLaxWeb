/**
 * FrontLaxWeb · ¿Dibuja este navegador sin la tarjeta gráfica?
 * ------------------------------------------------------------------------------------------
 * Nació de un caso medido: con la aceleración por hardware apagada, dos webs con Lenis iban a 1,7
 * y 4,6 fotogramas por segundo al bajar y otra daba parones de un cuarto de segundo, mientras
 * cloudflare.com iba a 45. Les pasa igual a ordenadores viejos o de empresa. Sin gráfica, lo que en un ordenador normal hace la tarjeta lo
 * hace el procesador: los desenfoques, las mezclas, el 3D y pintar cada fotograma. Y con Lenis el
 * scroll lo mueve el hilo principal, así que si ese hilo va a 5 fotogramas, la página va a 5.
 *
 * Cómo se sabe: se pide un contexto WebGL con `failIfMajorPerformanceCaveat`, que el navegador
 * niega (null) si solo podría dárselo por software (SwiftShader). Con gráfica se suelta en el
 * acto. `?ligero=1` lo fuerza y `?ligero=0` lo quita, para probarlo; dentro de un <iframe> del
 * mismo origen mira también la dirección de la página de fuera. Sin `window` (prerender, SSR) y
 * en jsdom (las pruebas) se da por hecho que hay gráfica.
 *
 * CUÁNDO se llama: una vez por visita y DESPUÉS del primer pintado (en un useEffect), nunca
 * antes del LCP: crear el contexto cuesta unos milisegundos que no se le quitan a la carga.
 * Lo usan useLenis.ts (no arranca Lenis) y la marca <html data-ligero> (el CSS, en SKILL.md).
 */
let calculado: boolean | null = null;

export function dibujoPorSoftware(): boolean {
  if (calculado !== null) return calculado;
  calculado = mirar();
  return calculado;
}

function pedido(): string | null {
  for (const w of [window, window.parent]) {
    try {
      const v = new URLSearchParams(w.location.search).get("ligero");
      if (v) return v;
    } catch {
      /* un marco de otro origen: no se mira */
    }
  }
  return null;
}

function mirar(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  try {
    const forzado = pedido();
    if (forzado === "1") return true;
    if (forzado === "0") return false;
    if (typeof WebGLRenderingContext === "undefined") return false;
    const lienzo = document.createElement("canvas");
    const op = { failIfMajorPerformanceCaveat: true } as WebGLContextAttributes;
    const gl = (lienzo.getContext("webgl2", op) ?? lienzo.getContext("webgl", op)) as WebGLRenderingContext | null;
    if (!gl) return true;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return false;
  } catch {
    return false;
  }
}

/** Solo para las pruebas. */
export function olvidarDibujoPorSoftware(): void {
  calculado = null;
}

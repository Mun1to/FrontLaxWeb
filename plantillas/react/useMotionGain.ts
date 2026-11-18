/**
 * FrontLaxWeb · El dial de movimiento en React
 * ------------------------------------------------------------------------------------------
 * Un solo sitio para la política de la casa. Lo importan todas las plantillas React.
 *
 * LA POLÍTICA EN UNA FRASE: todo para todos, con la amplitud justa. Lo que cambia según el
 * visitante no es SI hay movimiento, sino cuánto recorrido tiene.
 *
 *   gain 1     experiencia completa
 *   gain 0.25  el sistema pidió menos movimiento: mismo diseño, un cuarto de recorrido
 *   gain 0     ?motion=off: se queda quieto lo que se movía solo
 *   ?motion=full  fuerza el 1 aunque el sistema pida lo contrario (para revisar el trabajo
 *                 desde un equipo con los efectos de animación de Windows desactivados)
 *
 * LAS TRES REGLAS
 *   1. El dial multiplica RECORRIDO (px, escala, rotación), o velocidad en efectos continuos.
 *   2. NUNCA multiplica la opacidad. Un fundido no marea a nadie, y es lo que hace que un
 *      efecto con el dial bajo degrade en vez de romperse.
 *   3. NO escala el movimiento que dirige el usuario (arrastrar, hover, tilt, cursor): el
 *      oído interno no protesta por lo que uno mismo provoca.
 */

import { useEffect } from "react";
import { useMotionValue, type MotionValue } from "motion/react";

/**
 * Lee el dial del documento. Lo normal es que lo haya fijado el interruptor central del
 * `<head>` (ver SKILL.md); si la app no lo trae, se deduce aquí con el mismo criterio.
 */
export function leerGain(): number {
  const declarado = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--motion-gain")
  );
  if (!Number.isNaN(declarado)) return declarado;

  const q = new URLSearchParams(window.location.search).get("motion");
  if (q === "off") return 0;
  if (q === "full") return 1;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.25 : 1;
}

/**
 * El dial como MotionValue.
 *
 * Arranca en 1, también en el servidor, y se corrige tras montar: así el HTML del servidor y
 * el del primer render del cliente coinciden y no salta el aviso de hidratación.
 *
 * Es un MotionValue y no un useState a propósito. Como estado, cada `useTransform` capturaría
 * el valor viejo en su closure hasta el siguiente render. Como MotionValue, se lee en cada
 * frame, Motion rastrea la dependencia sola, y cambiar el dial en caliente reajusta la escena
 * sin provocar un solo re-render.
 */
export function useMotionGain(): MotionValue<number> {
  const gain = useMotionValue(1);
  useEffect(() => {
    gain.set(leerGain());
  }, [gain]);
  return gain;
}

/**
 * Los parámetros de spring de la casa, traducidos al vocabulario de Motion.
 *
 * En la plantilla vanilla el spring se describe con respuesta (0,42 s) y amortiguación (0,62).
 * Motion usa `visualDuration` (lo que tarda en PARECER que ha llegado) y `bounce` (0 = llega y
 * para, 1 = rebota sin parar). La equivalencia es directa: bounce ≈ 1 - amortiguación.
 *
 * El dial entra retirando el rebote, que es lo que más molesta a quien pidió menos movimiento,
 * y nunca acortando el trayecto: la distancia la decide el gesto del visitante.
 *
 * Cuidado al tocarlo: si añades `stiffness`, `damping` o `mass`, Motion ignora `visualDuration`
 * y `bounce`. Son dos formas de decir lo mismo y no se mezclan.
 */
export function springGesto(gain: number) {
  return { type: "spring" as const, visualDuration: 0.42, bounce: 0.38 * gain };
}

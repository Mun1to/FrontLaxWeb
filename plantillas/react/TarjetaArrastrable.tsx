/**
 * FrontLaxWeb · Plantilla React: "TarjetaArrastrable" (efecto nº7: gestos y springs)
 * ------------------------------------------------------------------------------------------
 * Gemela de `plantillas/vanilla/tarjeta-arrastrable-spring.html`. Allí el motor de spring está
 * escrito a mano, integrando la ecuación frame a frame; aquí lo pone Motion. La física es la
 * misma: merece la pena leer las dos y comparar.
 *
 * Requisitos: React 18 + Motion.
 *   npm i motion
 *
 * LOS CUATRO PRINCIPIOS, Y QUÉ LOS IMPLEMENTA
 *
 *  1. INTERRUMPIBILIDAD (el más importante de los 17 de Apple)
 *     La da `drag` de serie: si agarras la tarjeta mientras vuelve, Motion cancela la
 *     animación en curso y sigue desde la posición y la velocidad actuales. Esa es la razón
 *     de animar con springs y no con transiciones de duración fija: el spring guarda posición
 *     Y velocidad, así que siempre sabe salir desde donde está.
 *
 *  2. TRASPASO DE VELOCIDAD
 *     `onDragEnd` entrega `info.velocity`, y esa velocidad se pasa como `velocity` inicial del
 *     spring. Sin esto, el dedo va a 900 px/s, se levanta, y la animación arranca quieta: el
 *     ojo lo lee como un tirón. Usamos `dragMomentum={false}` porque el destino lo decidimos
 *     nosotros (volver o descartar), no la inercia libre.
 *
 *  3. RUBBER BANDING
 *     `dragConstraints` + `dragElastic`: pasado el límite, cada píxel de dedo mueve menos
 *     tarjeta. Nunca un tope seco.
 *
 *  4. CONSISTENCIA ESPACIAL
 *     Si se va por la derecha, vuelve a entrar por la derecha.
 *
 * EL DIAL (política de la casa)
 * El arrastre y la vuelta al centro NO se escalan: los dirige el visitante y la distancia la
 * decide su gesto. Lo que sí depende del dial:
 *   - el REBOTE, vía `bounce` (ver springGesto en ./useMotionGain),
 *   - y la REENTRADA de la tarjeta descartada, que es movimiento no solicitado: su recorrido
 *     se multiplica por el dial, y con gain 0 se queda en un fundido.
 */

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { animate, motion, useMotionValue, type PanInfo } from "motion/react";
import { springGesto, useMotionGain } from "./useMotionGain";

const LIMITE_Y = 60; // a partir de aquí, en vertical, empieza la goma
const VEL_DESCARTE = 800; // px/s a partir de los cuales se descarta al soltar
const FRACCION_UMBRAL = 0.34; // parte del ancho que hay que recorrer para descartar

type TarjetaArrastrableProps = {
  children: ReactNode;
  /** Se avisa al descartar, por si la app quiere pasar a la siguiente tarjeta. */
  onDescartar?: (lado: "izquierda" | "derecha") => void;
  className?: string;
};

export function TarjetaArrastrable({
  children,
  onDescartar,
  className = "",
}: TarjetaArrastrableProps) {
  const pista = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const gain = useMotionGain();
  const [estado, setEstado] = useState("en reposo");
  const [velocidad, setVelocidad] = useState(0);

  function soltar(_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    const ancho = pista.current?.clientWidth ?? 0;
    const g = gain.get();
    const spring = springGesto(g);
    const vx = info.velocity.x;
    setVelocidad(Math.round(Math.hypot(vx, info.velocity.y)));

    const seVa = Math.abs(x.get()) > ancho * FRACCION_UMBRAL || Math.abs(vx) > VEL_DESCARTE;

    if (!seVa) {
      setEstado("volviendo");
      /* La velocidad del dedo entra como velocidad inicial del spring: ahí está el traspaso. */
      animate(x, 0, { ...spring, velocity: vx });
      animate(y, 0, { ...spring, velocity: info.velocity.y });
      return;
    }

    /* Se va por el lado hacia el que iba, no por el lado en el que está: con el dedo
       mandando, ganan las manos. */
    const lado = Math.abs(vx) > VEL_DESCARTE ? Math.sign(vx) : Math.sign(x.get());
    setEstado("descartando");
    animate(x, lado * ancho * 1.4, {
      ...spring,
      velocity: vx,
      onComplete: () => {
        onDescartar?.(lado < 0 ? "izquierda" : "derecha");
        reentrar(lado, g);
      },
    });
  }

  /* REENTRADA. Esto SÍ es movimiento no solicitado (la tarjeta se mueve sola por la pantalla),
     así que su recorrido se multiplica por el dial. Con gain 0 reaparece en su sitio y solo
     queda el fundido. La opacidad nunca se escala: es lo que garantiza que el visitante vea
     que algo ha vuelto. */
  function reentrar(lado: number, g: number) {
    const ancho = pista.current?.clientWidth ?? 0;
    x.jump(lado * ancho * 1.4 * g);
    y.jump(0);
    setEstado("volviendo");
    animate(x, 0, springGesto(g));
  }

  function teclear(e: KeyboardEvent<HTMLDivElement>) {
    const g = gain.get();
    const salto = 40;
    const destino = (v: number) => animate(x, x.get() + v, springGesto(g));

    if (e.key === "ArrowLeft") destino(-salto);
    else if (e.key === "ArrowRight") destino(salto);
    else if (e.key === "ArrowUp") animate(y, Math.max(-LIMITE_Y, y.get() - salto), springGesto(g));
    else if (e.key === "ArrowDown") animate(y, Math.min(LIMITE_Y, y.get() + salto), springGesto(g));
    else if (e.key === "Enter" || e.key === " ") {
      const lado = Math.sign(x.get()) || 1;
      const ancho = pista.current?.clientWidth ?? 0;
      setEstado("descartando");
      animate(x, lado * ancho * 1.4, {
        ...springGesto(g),
        onComplete: () => reentrar(lado, g),
      });
    } else if (e.key === "Escape") {
      setEstado("volviendo");
      animate(x, 0, springGesto(g));
      animate(y, 0, springGesto(g));
    } else return;
    e.preventDefault();
  }

  return (
    <div className={className} style={{ display: "grid", gap: "1.5rem", justifyItems: "center" }}>
      <div
        ref={pista}
        style={{
          position: "relative",
          width: "min(92vw, 420px)",
          height: 300,
          display: "grid",
          placeItems: "center",
        }}
      >
        <motion.div
          drag
          /* Solo el eje vertical tiene tope. El horizontal va libre: es el eje del descarte. */
          dragConstraints={{ top: -LIMITE_Y, bottom: LIMITE_Y }}
          dragElastic={0.35}
          dragMomentum={false}
          onDragStart={() => setEstado("arrastrando")}
          onDragEnd={soltar}
          onKeyDown={teclear}
          tabIndex={0}
          role="button"
          aria-label="Tarjeta arrastrable. Flechas para mover, Enter para descartar."
          style={{ x, y, cursor: "grab", touchAction: "none", willChange: "transform" }}
          whileTap={{ cursor: "grabbing" }}
        >
          {children}
        </motion.div>
      </div>

      {/* Telemetría. No es decoración: es la prueba visible de que la velocidad se hereda. */}
      <p style={{ margin: 0, fontVariantNumeric: "tabular-nums", opacity: 0.7 }}>
        {estado} · {velocidad} px/s
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------
 * EJEMPLO DE USO
 * -------------------------------------------------------------------------------------------
 * <TarjetaArrastrable onDescartar={(lado) => console.log("se fue por la", lado)}>
 *   <div style={{
 *     width: 220, height: 150, borderRadius: 18, padding: "1.2rem",
 *     display: "grid", placeItems: "center", background: "#151a24",
 *     border: "1px solid rgba(110,231,209,.3)",
 *   }}>
 *     <strong>Tarjeta</strong>
 *   </div>
 * </TarjetaArrastrable>
 *
 * CUÁNDO USAR ESTE MOTOR: para cualquier cosa que el visitante pueda agarrar, no solo tarjetas.
 * Hojas modales que se cierran deslizando, menús laterales, sliders, carruseles. Lo que cambia
 * es el destino al soltar; el criterio (spring, velocidad heredada, goma en los topes) es el
 * mismo siempre.
 * ----------------------------------------------------------------------------------------- */

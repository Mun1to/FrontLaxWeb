/**
 * FrontLaxWeb · Plantilla React: "MatrioskaParallax" (receta nº16 del catálogo)
 * ------------------------------------------------------------------------------------------
 * Gemela de `plantillas/vanilla/matrioska-parallax.html`. Misma matemática, distinto motor.
 *
 * Qué hace: el scroll deja de mover la página y pasa a mover una cámara que avanza por un
 * túnel de capas anidadas. Cada capa está "dentro" de la anterior, como una muñeca rusa.
 * Compone las recetas 1 (parallax), 10 (zoom al scroll) y 11 (máscara).
 *
 * Requisitos: React 18 + Motion.
 *   npm i motion
 *
 * LA MATEMÁTICA, QUE ES TODA LA RECETA
 *   camara = progreso * (N - 1)     posición de la cámara, medida en capas
 *   d      = camara - i             a cuántas capas de distancia queda la capa i
 *   escala = 2 ^ d                  cada capa que avanzas, el mundo duplica su tamaño
 * Con d = -1 la capa se ve a la mitad (dentro de la anterior). Con d = 0 la cámara está en
 * ella. Con d = +1 ya la ha atravesado.
 *
 * POLÍTICA DE LA CASA (dial --motion-gain)
 *   escala = 1 + (2^d - 1) * gain
 * Con gain 1 el rango es [0.5, 2]. Con 0.25 pasa a [0.87, 1.25]. Con 0 la escala es 1 y el
 * efecto degrada a un fundido encadenado: no se rompe, se queda sin trayecto.
 * La opacidad NUNCA se multiplica por el dial: es lo que sostiene el efecto con el dial bajo.
 *
 * El dial llega como MotionValue desde `./useMotionGain`, y ahí está explicado por qué no es
 * un useState: como estado, cada `useTransform` se quedaría con el valor viejo en su closure.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";
import { useMotionGain } from "./useMotionGain";

/* -------------------------------------------------------------------------------------------
 * UNA CAPA
 * ---------------------------------------------------------------------------------------- */

const MESETA = 0.3; // radio en el que una capa manda sola, a opacidad plena

type CapaProps = {
  indice: number;
  total: number;
  progreso: MotionValue<number>;
  gain: MotionValue<number>;
  children: ReactNode;
};

function Capa({ indice, total, progreso, gain, children }: CapaProps) {
  const distancia = () => progreso.get() * (total - 1) - indice;

  const escala = useTransform(() => 1 + (Math.pow(2, distancia()) - 1) * gain.get());

  const opacidad = useTransform(() => {
    /* La ventana de solape depende del dial, y no es capricho: con el zoom completo la capa
       vecina se ve a la mitad de tamaño y solaparla es lo que produce la matrioska; con el
       dial bajo todas quedan casi del mismo tamaño y ese solape convierte dos titulares en un
       borrón. Menos zoom, cruces más cortos. La meseta garantiza que en cada momento mande
       una sola capa. */
    const ventana = 0.55 + 0.6 * gain.get();
    const t = Math.min(1, Math.max(0, (Math.abs(distancia()) - MESETA) / (ventana - MESETA)));
    return 1 - t * t * (3 - 2 * t);
  });

  /* Una capa apagada no debe robar clics ni foco a la que sí se ve. Es el único punto en el
     que sale del mundo de los motion values, y solo cambia al cruzar el 0.5. */
  const [presente, setPresente] = useState(indice === 0);
  useMotionValueEvent(opacidad, "change", (v) => setPresente(v > 0.5));

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        scale: escala,
        opacity: opacidad,
        pointerEvents: presente ? "auto" : "none",
        willChange: "transform, opacity",
      }}
      aria-hidden={!presente}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------------------------
 * EL TÚNEL
 * ---------------------------------------------------------------------------------------- */

type MatrioskaParallaxProps = {
  /** Una entrada por capa, de fuera hacia dentro. El contenido de cada una debe dejar
   *  su CENTRO VACÍO: ahí es exactamente donde asoma la capa siguiente. */
  capas: ReactNode[];
  /** Pantallas de scroll por capa. Menos de 1 acelera el viaje. Def: 1. */
  pantallasPorCapa?: number;
  className?: string;
};

export function MatrioskaParallax({
  capas,
  pantallasPorCapa = 1,
  className = "",
}: MatrioskaParallaxProps) {
  const ref = useRef<HTMLElement>(null);
  const gain = useMotionGain();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  /* RESCATE DEL VIEWPORT DE 0 px (cicatriz real, ver Trucos de taller del SKILL).
     En un panel de preview sin dimensionar o en un webview incrustado no hay recorrido que
     medir, y las capas se quedarían invisibles para siempre. Si no se puede animar con
     garantías, se cae al modo legible: capas en flujo, una debajo de otra. */
  const [animable, setAnimable] = useState(true);
  useEffect(() => {
    const seccion = ref.current;
    if (!seccion) return;
    const medir = () =>
      setAnimable(window.innerHeight > 0 && seccion.offsetHeight > window.innerHeight);
    medir();
    const observer = new ResizeObserver(medir);
    observer.observe(document.documentElement);
    window.addEventListener("resize", medir);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", medir);
    };
  }, []);

  if (!animable) {
    return (
      <section ref={ref} className={className}>
        {capas.map((capa, i) => (
          <div key={i} style={{ display: "grid", placeItems: "center", padding: "8vh 6vw" }}>
            {capa}
          </div>
        ))}
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className={className}
      style={{ position: "relative", height: `${capas.length * pantallasPorCapa * 100}vh` }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "grid",
          placeItems: "center",
        }}
      >
        {capas.map((capa, i) => (
          <Capa key={i} indice={i} total={capas.length} progreso={scrollYProgress} gain={gain}>
            {capa}
          </Capa>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------------------------
 * EJEMPLO DE USO
 * -------------------------------------------------------------------------------------------
 * const marco: React.CSSProperties = {
 *   width: "min(78vw, 62vh)", aspectRatio: "1", padding: "clamp(1rem, 2.6vw, 2rem)",
 *   border: "2px solid currentColor", borderRadius: 28, textAlign: "center",
 *   display: "grid", gridTemplateRows: "auto 1fr auto", justifyItems: "center",
 * };
 *
 * <MatrioskaParallax
 *   capas={[
 *     <div style={{ ...marco, color: "#6ee7d1" }}>
 *       <div><span>Capa 01</span><h1>El titular que abre la historia</h1></div>
 *       <div />                                        // el hueco: NO lo rellenes
 *       <p>Cada capa es una idea.</p>
 *     </div>,
 *     <div style={{ ...marco, color: "#8ab4ff" }}> … </div>,
 *   ]}
 * />
 *
 * REGLA DE COMPOSICIÓN, la que más se incumple: el centro de cada capa va VACÍO. La capa
 * siguiente aparece a la mitad de tamaño, o sea justo en el centro de la actual; si pones ahí
 * el titular, padre e hija se pisan y no se lee ninguno de los dos. Contenido en el perímetro.
 *
 * Y el cimiento: para que el scroll se sienta mantecoso, inicializa Lenis una vez en tu app,
 * con su modo ligero de serie: useLenis() de plantillas/react/useLenis.ts.
 * ----------------------------------------------------------------------------------------- */

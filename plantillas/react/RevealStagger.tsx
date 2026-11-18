/**
 * FrontLaxWeb · Receta nº2: SCROLL-REVEAL CON STAGGER (versión React / Motion)
 * -----------------------------------------------------------------------------
 * Mismo efecto que plantillas/vanilla/reveal-stagger.html, pero con Motion
 * (ex Framer Motion). Aquí el stagger no se calcula a mano: el padre orquesta
 * a los hijos con `staggerChildren`: es el patrón "variants" de Motion.
 *
 * Instalar:  npm i motion   (se importa de "motion/react")
 * (En proyectos con el paquete antiguo framer-motion: import from "framer-motion", misma API.)
 *
 * Uso:
 *   <RevealGroup>
 *     <RevealItem><h2>Titular</h2></RevealItem>
 *     <RevealItem><p>Subtítulo</p></RevealItem>
 *     <RevealItem><Card /></RevealItem>   ← cada Item entra 90ms después del anterior
 *   </RevealGroup>
 *
 * POLÍTICA DE LA CASA: las animaciones se muestran a TODOS
 * los visitantes: NO usar useReducedMotion ni gates de prefers-reduced-motion. La válvula
 * de escape es ?motion=off a nivel de app (interruptor central `motion` en <html>).
 */

import { type ReactNode } from "react";
import { motion, type Variants } from "motion/react";

// La curva premium: rápida al inicio, aterrizaje suave (ease-out-quint)
const EASE = [0.22, 1, 0.36, 1] as const;

type RevealGroupProps = {
  children: ReactNode;
  /** Segundos entre cada hijo. Def: 0.09 (90ms, el ritmo "cascada" clásico). */
  stagger?: number;
  /** Cuánto del grupo debe asomar para disparar (0–1). Def: 0.2. */
  amount?: number;
  /** true = anima solo la primera vez (recomendado). */
  once?: boolean;
  className?: string;
};

export function RevealGroup({
  children,
  stagger = 0.09,
  amount = 0.2,
  once = true,
  className,
}: RevealGroupProps) {
  // El padre no anima nada él mismo: solo ORQUESTA los tiempos de sus hijos.
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger } },
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"          // ← el IntersectionObserver, resuelto por Motion
      viewport={{ once, amount }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  // Cada hijo declara sus dos estados; el padre decide CUÁNDO pasa cada uno a "show".
  const item: Variants = {
    hidden: { opacity: 0, y: 26 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: EASE },
    },
  };

  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------------
 * POR QUÉ ASÍ (para aprender):
 * - "variants" = estados con nombre compartidos entre padre e hijos. El padre pasa
 *   de "hidden" a "show" al entrar en viewport, y `staggerChildren` retrasa a cada
 *   hijo en cadena. Un solo observer para todo el grupo (más barato que uno por item).
 * - Solo animamos `opacity` y `y` (transform): GPU, 60fps.
 * - `once: true` evita que el contenido "reaparezca" al hacer scroll arriba/abajo,
 *   que en páginas de producto se siente nervioso.
 * ----------------------------------------------------------------------------- */

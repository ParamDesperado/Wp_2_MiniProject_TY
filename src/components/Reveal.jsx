import React from 'react';
import { useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';

/**
 * Reveals its children the first time they enter the viewport.
 *
 * Backed by Motion's spring physics rather than a fixed-duration CSS
 * transition: a spring settles rather than stopping dead, which is what
 * reads as smooth. Variants: 'up' | 'scale' | 'left' | 'right'.
 */
const FROM = {
  up:    { y: 34, x: 0,   scale: 1 },
  scale: { y: 18, x: 0,   scale: 0.94 },
  left:  { y: 0,  x: -44, scale: 1 },
  right: { y: 0,  x: 44,  scale: 1 },
};

const Reveal = ({
  children,
  className = '',
  delay = 0,
  as = 'div',
  variant = 'up',
  amount = 0.2,
}) => {
  const reduced = useReducedMotion();
  const Tag = as;

  // Honour the OS setting by rendering the resting state outright.
  if (reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = m[as] || m.div;
  const from = FROM[variant] || FROM.up;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...from }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount, margin: '0px 0px -60px 0px' }}
      transition={{
        type: 'spring',
        stiffness: 105,
        damping: 20,
        mass: 0.9,
        delay: delay / 1000,
        opacity: { type: 'tween', duration: 0.5, delay: delay / 1000 },
      }}
    >
      {children}
    </MotionTag>
  );
};

export default Reveal;

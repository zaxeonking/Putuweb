"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin marigold progress bar fixed to the very top of the viewport,
 * tracking scroll position. Sits above the sticky navbar's blur layer.
 * A small, ever-present piece of scroll feedback across every page.
 */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-marigold dark:bg-marigold-light"
    />
  );
}

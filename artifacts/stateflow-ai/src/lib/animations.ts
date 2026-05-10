export const animations = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
  },
  stagger: {
    animate: { transition: { staggerChildren: 0.1 } }
  },
  glassReveal: {
    initial: { opacity: 0, y: 40, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.8, ease: "easeOut" as const }
  },
  glowPulse: {
    animate: {
      boxShadow: [
        "0 0 10px rgba(0, 245, 255, 0.2)",
        "0 0 25px rgba(0, 245, 255, 0.6)",
        "0 0 10px rgba(0, 245, 255, 0.2)"
      ],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  },
  pageTransition: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 },
    transition: { duration: 0.4 }
  }
};

import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { animations } from "@/lib/animations";

interface GlassPanelProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function GlassPanel({ children, className, delay = 0, ...props }: GlassPanelProps) {
  return (
    <motion.div
      className={cn("glass-panel rounded-xl overflow-hidden", className)}
      variants={animations.glassReveal}
      initial="initial"
      animate="animate"
      transition={{ ...animations.glassReveal.transition, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
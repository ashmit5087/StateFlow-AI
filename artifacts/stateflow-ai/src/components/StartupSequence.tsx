import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function StartupSequence({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return p + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0F1A]"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, filter: "blur(10px)" }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <div className="w-full max-w-md px-8 flex flex-col gap-6">
          <motion.h1 
            className="text-2xl md:text-4xl font-display text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] to-[#7A5CFF] text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Initializing StateFlow Engine...
          </motion.h1>
          
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-[#00F5FF]"
              style={{ width: `${progress}%` }}
              layout
            />
          </div>
          
          <div className="font-mono text-[#00F5FF] text-sm text-center opacity-70">
            {progress < 100 ? `Loading modules... ${Math.min(progress, 100)}%` : "System Ready."}
          </div>
        </div>

        {/* Scanlines */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] opacity-20" />
      </motion.div>
    </AnimatePresence>
  );
}
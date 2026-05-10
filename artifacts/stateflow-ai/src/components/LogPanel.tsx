import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { GlassPanel } from "./GlassPanel";
import { LogEntry } from "@/lib/useSimulation";

interface LogPanelProps {
  log: LogEntry[];
  title?: string;
}

export function LogPanel({ log, title = "EXECUTION LOG" }: LogPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [log.length]);

  return (
    <GlassPanel className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2 flex-shrink-0">
        <Terminal className="w-4 h-4 text-[#00F5FF]" />
        <h3 className="font-display text-xs tracking-widest text-white/70">{title}</h3>
        <span className="ml-auto text-[10px] font-mono text-white/30">{log.length} entries</span>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-1 min-h-0"
      >
        <AnimatePresence initial={false}>
          {log.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white/30 italic text-[11px] p-2"
            >
              {">"} Awaiting simulation. Press RUN to begin.
              <span className="inline-block w-2 h-3 bg-[#00F5FF] ml-1 animate-pulse" />
            </motion.div>
          )}
          {log.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -8, filter: "blur(2px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.25 }}
              className={`flex gap-2 items-start py-0.5 ${
                entry.kind === "error"
                  ? "text-[#FF4D6D]"
                  : entry.kind === "output"
                    ? "text-[#FF4D9D]"
                    : entry.kind === "transition"
                      ? "text-[#00F5FF]"
                      : "text-white/50"
              }`}
            >
              <span className="text-white/20 select-none">›</span>
              <span className="flex-1 leading-snug">{entry.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </GlassPanel>
  );
}

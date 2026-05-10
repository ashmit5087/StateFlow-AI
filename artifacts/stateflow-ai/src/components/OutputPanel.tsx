import { AnimatePresence, motion } from "framer-motion";
import { Zap, Radio } from "lucide-react";
import { GlassPanel } from "./GlassPanel";
import { MachineType } from "@/lib/fsm-engine";

interface OutputPanelProps {
  output: string | null;
  outputBurstId: number;
  mode: MachineType;
  outputs: string[];
}

export function OutputPanel({ output, outputBurstId, mode, outputs }: OutputPanelProps) {
  const isMoore = mode === "moore";

  // Moore: delayed pulse; Mealy: immediate slide
  const burstAnim = isMoore
    ? {
        initial: { opacity: 0, scale: 0.6, filter: "blur(6px)" },
        animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
        exit: { opacity: 0, scale: 0.95 },
        transition: { duration: 0.55, delay: 0.25, ease: [0.22, 1, 0.36, 1] as const },
      }
    : {
        initial: { opacity: 0, x: -40, filter: "blur(2px)" },
        animate: { opacity: 1, x: 0, filter: "blur(0px)" },
        exit: { opacity: 0, x: 40 },
        transition: { duration: 0.25, ease: "easeOut" as const },
      };

  return (
    <GlassPanel className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2 flex-shrink-0">
        {isMoore ? (
          <Radio className="w-4 h-4 text-[#7A5CFF]" />
        ) : (
          <Zap className="w-4 h-4 text-[#FF4D9D]" />
        )}
        <h3 className="font-display text-xs tracking-widest text-white/70">
          {isMoore ? "MOORE OUTPUT (after state)" : "MEALY OUTPUT (during transition)"}
        </h3>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 flex items-center justify-center px-4 min-h-[80px] relative overflow-hidden">
          <AnimatePresence mode="wait">
            {output ? (
              <motion.div
                key={`${output}-${outputBurstId}`}
                {...burstAnim}
                className="text-center w-full"
              >
                <div
                  className="font-display font-bold tracking-wide leading-tight"
                  style={{
                    fontSize: "clamp(20px, 3.2vw, 36px)",
                    background:
                      "linear-gradient(90deg, #00F5FF 0%, #7A5CFF 50%, #FF4D9D 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    filter: isMoore
                      ? "drop-shadow(0 0 18px rgba(0, 245, 255, 0.55))"
                      : "drop-shadow(0 0 18px rgba(255, 77, 157, 0.55))",
                  }}
                >
                  {output}
                </div>
                <motion.div
                  className="mt-2 mx-auto h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(0,245,255,0.6), transparent)",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white/30 text-sm font-mono italic"
              >
                Awaiting output…
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {outputs.length > 0 && (
          <div className="px-4 pb-3 pt-2 border-t border-white/5">
            <div className="text-[10px] font-display tracking-widest text-white/40 mb-1.5">
              SEQUENCE
            </div>
            <div className="flex flex-wrap gap-1.5">
              {outputs.map((o, i) => (
                <motion.span
                  key={`${o}-${i}`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.04] border border-white/10 text-white/70"
                >
                  {o}
                </motion.span>
              ))}
            </div>
          </div>
        )}
      </div>
    </GlassPanel>
  );
}

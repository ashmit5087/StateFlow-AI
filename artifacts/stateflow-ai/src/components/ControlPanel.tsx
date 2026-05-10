import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, SkipForward, Sparkles, Cpu, ShoppingCart, MessageSquare } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "./GlassPanel";
import { scenarios } from "@/lib/scenarios";
import { animations } from "@/lib/animations";

interface ControlPanelProps {
  scenarioId: string;
  onScenarioChange: (id: string) => void;
  sequenceText: string;
  onSequenceTextChange: (s: string) => void;
  parsedSequence: string[];
  speed: number;
  onSpeedChange: (n: number) => void;
  onRun: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  isRunning: boolean;
  isFinished: boolean;
  alphabet: string[];
}

const scenarioMeta: Record<string, { icon: React.ReactNode; gradient: string }> = {
  otp: {
    icon: <Cpu className="w-5 h-5" />,
    gradient: "from-[#00F5FF]/20 to-[#7A5CFF]/20",
  },
  ecommerce: {
    icon: <ShoppingCart className="w-5 h-5" />,
    gradient: "from-[#7A5CFF]/20 to-[#FF4D9D]/20",
  },
  chatbot: {
    icon: <MessageSquare className="w-5 h-5" />,
    gradient: "from-[#FF4D9D]/20 to-[#00F5FF]/20",
  },
};

export function ControlPanel({
  scenarioId,
  onScenarioChange,
  sequenceText,
  onSequenceTextChange,
  parsedSequence,
  speed,
  onSpeedChange,
  onRun,
  onPause,
  onStep,
  onReset,
  isRunning,
  isFinished,
  alphabet,
}: ControlPanelProps) {
  const [localText, setLocalText] = useState(sequenceText);

  useEffect(() => {
    setLocalText(sequenceText);
  }, [sequenceText]);

  return (
    <GlassPanel className="flex flex-col h-full">
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-[#00F5FF]" />
          <h3 className="font-display text-sm tracking-widest text-white/70">CONTROL DECK</h3>
        </div>
        <p className="text-[11px] text-white/40 font-mono">Configure & run the simulation</p>
      </div>

      <div className="p-5 flex flex-col gap-5 overflow-y-auto">
        {/* Scenarios */}
        <div>
          <label className="text-[10px] font-display tracking-widest text-white/50 mb-2 block">
            SCENARIOS
          </label>
          <div className="flex flex-col gap-2">
            {Object.values(scenarios).map((s, i) => {
              const meta = scenarioMeta[s.id];
              const isActive = s.id === scenarioId;
              return (
                <motion.button
                  key={s.id}
                  onClick={() => onScenarioChange(s.id)}
                  className={`relative text-left p-3 rounded-lg border transition-all overflow-hidden group ${
                    isActive
                      ? "border-[#00F5FF]/50 bg-gradient-to-br " + meta.gradient
                      : "border-white/8 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15"
                  }`}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${
                        isActive ? "text-[#00F5FF]" : "text-white/50"
                      }`}
                      style={{
                        background: isActive
                          ? "rgba(0, 245, 255, 0.12)"
                          : "rgba(255,255,255,0.04)",
                      }}
                    >
                      {meta.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`text-[13px] font-medium ${isActive ? "text-white" : "text-white/80"}`}>
                        {s.name}
                      </div>
                      <div className="text-[10px] text-white/40 leading-tight mt-0.5 line-clamp-2">
                        {s.description}
                      </div>
                    </div>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeScenario"
                      className="absolute inset-0 rounded-lg pointer-events-none"
                      style={{ boxShadow: "inset 0 0 18px rgba(0,245,255,0.2)" }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Input sequence */}
        <div>
          <label className="text-[10px] font-display tracking-widest text-white/50 mb-2 block">
            INPUT SEQUENCE
          </label>
          <div className="relative">
            <textarea
              value={localText}
              onChange={(e) => {
                setLocalText(e.target.value);
                onSequenceTextChange(e.target.value);
              }}
              placeholder="login, otp, verify"
              spellCheck={false}
              className="w-full h-20 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-[#E6EAF2] placeholder:text-white/30 resize-none focus:outline-none focus:border-[#00F5FF]/50 focus:shadow-[0_0_12px_rgba(0,245,255,0.25)] transition-all"
            />
          </div>
          {parsedSequence.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {parsedSequence.map((kw, i) => (
                <motion.span
                  key={`${kw}-${i}`}
                  initial={{ opacity: 0, y: -4, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="px-2 py-0.5 rounded-md text-[10px] font-mono border bg-white/[0.04] border-white/10 text-white/70"
                >
                  {kw}
                </motion.span>
              ))}
            </div>
          )}
          <div className="text-[10px] text-white/30 mt-1.5 font-mono">
            Alphabet: {alphabet.join(" • ")}
          </div>
        </div>

        {/* Speed */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-display tracking-widest text-white/50">
              SPEED
            </label>
            <span className="text-xs font-mono text-[#00F5FF]">{speed.toFixed(2)}x</span>
          </div>
          <Slider
            min={0.25}
            max={3}
            step={0.05}
            value={[speed]}
            onValueChange={(v) => onSpeedChange(v[0])}
            className="[&_[data-slot=slider-track]]:!bg-white/10 [&_[data-slot=slider-range]]:!bg-gradient-to-r [&_[data-slot=slider-range]]:!from-[#00F5FF] [&_[data-slot=slider-range]]:!to-[#7A5CFF]"
          />
        </div>

        {/* Actions */}
        <motion.div className="flex flex-col gap-2" {...animations.fadeInUp}>
          <Button
            onClick={isRunning ? onPause : onRun}
            className="relative overflow-hidden h-11 font-display tracking-wider text-sm bg-gradient-to-r from-[#00F5FF] to-[#7A5CFF] text-[#0B0F1A] hover:opacity-95 hover:shadow-[0_0_24px_rgba(0,245,255,0.55)] transition-all border-0"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" /> PAUSE
              </>
            ) : isFinished ? (
              <>
                <RotateCcw className="w-4 h-4 mr-2" /> RUN AGAIN
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2 fill-current" /> RUN SIMULATION
              </>
            )}
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={onStep}
              variant="outline"
              className="h-9 bg-white/[0.02] border-white/10 text-white/80 hover:bg-white/[0.06] hover:text-white hover:border-[#00F5FF]/40 hover:shadow-[0_0_10px_rgba(0,245,255,0.25)]"
            >
              <SkipForward className="w-3.5 h-3.5 mr-1.5" /> Step
            </Button>
            <Button
              onClick={onReset}
              variant="outline"
              className="h-9 bg-white/[0.02] border-white/10 text-white/80 hover:bg-white/[0.06] hover:text-white hover:border-[#FF4D9D]/40 hover:shadow-[0_0_10px_rgba(255,77,157,0.25)]"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset
            </Button>
          </div>
        </motion.div>
      </div>
    </GlassPanel>
  );
}

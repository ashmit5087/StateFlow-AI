import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronDown } from "lucide-react";
import { GraphCanvas } from "@/components/GraphCanvas";
import { LogPanel } from "@/components/LogPanel";
import { OutputPanel } from "@/components/OutputPanel";
import { GlassPanel } from "@/components/GlassPanel";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { scenarios } from "@/lib/scenarios";
import { useSimulation } from "@/lib/useSimulation";
import { useSimulator } from "@/lib/store";

function parseSequence(s: string): string[] {
  return s
    .split(/[,\n→>]+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default function Compare() {
  const [scenarioId, setScenarioId] = useState<string>("otp");
  const fsm = scenarios[scenarioId];
  const [sequenceText, setSequenceText] = useState<string>(fsm.defaultSequence.join(", "));
  const [speed, setSpeed] = useState<number>(1);
  const { setExportData } = useSimulator();

  useEffect(() => {
    setSequenceText(scenarios[scenarioId].defaultSequence.join(", "));
  }, [scenarioId]);

  const parsedSequence = useMemo(() => parseSequence(sequenceText), [sequenceText]);

  const moore = useSimulation(fsm, "moore", parsedSequence, speed);
  const mealy = useSimulation(fsm, "mealy", parsedSequence, speed);

  const isRunning = moore.isRunning || mealy.isRunning;

  const runBoth = () => {
    moore.run();
    mealy.run();
  };
  const pauseBoth = () => {
    moore.pause();
    mealy.pause();
  };
  const resetBoth = () => {
    moore.reset();
    mealy.reset();
  };

  // export
  useEffect(() => {
    setExportData({
      mode: "moore",
      scenario: scenarioId,
      sequence: parsedSequence,
      log: [
        ...moore.log.map((l) => ({ time: l.time, text: `[MOORE] ${l.text}` })),
        ...mealy.log.map((l) => ({ time: l.time, text: `[MEALY] ${l.text}` })),
      ],
    });
  }, [scenarioId, parsedSequence, moore.log, mealy.log, setExportData]);

  const mooreOutputs = useMemo(
    () => moore.log.filter((l) => l.kind === "output").map((l) => l.text.replace(/^↳ Output:\s*/, "")),
    [moore.log]
  );
  const mealyOutputs = useMemo(
    () => mealy.log.filter((l) => l.kind === "output").map((l) => l.text.replace(/^↳ Output:\s*/, "")),
    [mealy.log]
  );

  return (
    <motion.div
      className="pt-[88px] pb-6 px-4 md:px-6 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-[1700px] mx-auto">
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-[11px] font-display tracking-widest text-[#FF4D9D] mb-1">
            COMPARE
          </div>
          <h1 className="font-display text-2xl md:text-3xl text-white">
            Moore <span className="text-white/30 mx-2">vs</span> Mealy
          </h1>
          <p className="text-xs text-white/45 mt-0.5">
            Same FSM, same input. Watch when each machine emits its output.
          </p>
        </motion.div>

        {/* Control bar */}
        <GlassPanel className="mb-4 p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[180px]">
              <label className="text-[10px] font-display tracking-widest text-white/50 mb-1.5 block">
                SCENARIO
              </label>
              <div className="relative">
                <select
                  value={scenarioId}
                  onChange={(e) => setScenarioId(e.target.value)}
                  className="w-full appearance-none bg-black/40 border border-white/10 rounded-lg px-3 py-2 pr-8 text-sm text-white focus:outline-none focus:border-[#00F5FF]/50"
                >
                  {Object.values(scenarios).map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#0B0F1A]">
                      {s.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              </div>
            </div>
            <div className="flex-[2] min-w-[260px]">
              <label className="text-[10px] font-display tracking-widest text-white/50 mb-1.5 block">
                INPUT SEQUENCE
              </label>
              <input
                value={sequenceText}
                onChange={(e) => setSequenceText(e.target.value)}
                spellCheck={false}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-[#00F5FF]/50 focus:shadow-[0_0_12px_rgba(0,245,255,0.25)]"
              />
            </div>
            <div className="min-w-[160px]">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-display tracking-widest text-white/50">
                  SPEED
                </label>
                <span className="text-[11px] font-mono text-[#00F5FF]">{speed.toFixed(2)}x</span>
              </div>
              <Slider
                min={0.25}
                max={3}
                step={0.05}
                value={[speed]}
                onValueChange={(v) => setSpeed(v[0])}
                className="[&_[data-slot=slider-range]]:!bg-gradient-to-r [&_[data-slot=slider-range]]:!from-[#00F5FF] [&_[data-slot=slider-range]]:!to-[#FF4D9D]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={isRunning ? pauseBoth : runBoth}
                className="h-10 font-display tracking-wider text-xs bg-gradient-to-r from-[#00F5FF] to-[#FF4D9D] text-[#0B0F1A] hover:opacity-95 hover:shadow-[0_0_22px_rgba(255,77,157,0.45)] border-0"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5 mr-1.5" /> PAUSE BOTH
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 mr-1.5 fill-current" /> RUN BOTH
                  </>
                )}
              </Button>
              <Button
                onClick={resetBoth}
                variant="outline"
                className="h-10 bg-white/[0.02] border-white/10 text-white/80 hover:bg-white/[0.06] hover:text-white"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </GlassPanel>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[
            {
              label: "MOORE",
              color: "#00F5FF",
              sim: moore,
              outputs: mooreOutputs,
              mode: "moore" as const,
              caption: "Output depends on the current STATE.",
            },
            {
              label: "MEALY",
              color: "#FF4D9D",
              sim: mealy,
              outputs: mealyOutputs,
              mode: "mealy" as const,
              caption: "Output depends on the current TRANSITION.",
            },
          ].map((side) => (
            <motion.div
              key={side.label}
              className="flex flex-col gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: side.label === "MOORE" ? 0.1 : 0.2 }}
            >
              <GlassPanel className="overflow-hidden">
                <div
                  className="px-4 py-3 border-b border-white/5 flex items-center justify-between"
                  style={{ borderColor: `${side.color}30` }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: side.color, boxShadow: `0 0 10px ${side.color}` }}
                    />
                    <div>
                      <div
                        className="font-display text-sm tracking-widest"
                        style={{ color: side.color }}
                      >
                        {side.label}
                      </div>
                      <div className="text-[10px] text-white/40">{side.caption}</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-white/40">
                    {Math.max(0, side.sim.currentStepIndex + 1)} / {side.sim.steps.length}
                  </div>
                </div>
                <div style={{ height: 360 }}>
                  <GraphCanvas
                    fsm={fsm}
                    mode={side.mode}
                    currentStateId={side.sim.currentStateId}
                    activeEdge={side.sim.activeEdge}
                    errorState={side.sim.errorState}
                    height={360}
                  />
                </div>
              </GlassPanel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-[230px]">
                <LogPanel log={side.sim.log} title={`${side.label} LOG`} />
                <OutputPanel
                  output={side.sim.output}
                  outputBurstId={side.sim.outputBurstId}
                  mode={side.mode}
                  outputs={side.outputs}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

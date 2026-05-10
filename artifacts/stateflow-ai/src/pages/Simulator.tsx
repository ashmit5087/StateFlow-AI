import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ControlPanel } from "@/components/ControlPanel";
import { GraphCanvas } from "@/components/GraphCanvas";
import { LogPanel } from "@/components/LogPanel";
import { OutputPanel } from "@/components/OutputPanel";
import { GlassPanel } from "@/components/GlassPanel";
import { scenarios } from "@/lib/scenarios";
import { useSimulation } from "@/lib/useSimulation";
import { useSimulator } from "@/lib/store";

function parseSequence(s: string): string[] {
  return s
    .split(/[,\n→>]+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default function Simulator() {
  const [scenarioId, setScenarioId] = useState<string>("otp");
  const fsm = scenarios[scenarioId];
  const [sequenceText, setSequenceText] = useState<string>(fsm.defaultSequence.join(", "));
  const [speed, setSpeed] = useState<number>(1);

  const { mode, setExportData, resetSignal, loadDemoSignal } = useSimulator();

  // When user picks a different scenario, reset its default sequence too
  useEffect(() => {
    setSequenceText(scenarios[scenarioId].defaultSequence.join(", "));
  }, [scenarioId]);

  const parsedSequence = useMemo(() => parseSequence(sequenceText), [sequenceText]);

  const sim = useSimulation(fsm, mode, parsedSequence, speed);

  // Aggregate outputs collected so far
  const outputs = useMemo(
    () => sim.log.filter((l) => l.kind === "output").map((l) => l.text.replace(/^↳ Output:\s*/, "")),
    [sim.log]
  );

  // Sync export data
  useEffect(() => {
    setExportData({
      mode,
      scenario: scenarioId,
      sequence: parsedSequence,
      log: sim.log.map((l) => ({ time: l.time, text: l.text })),
    });
  }, [mode, scenarioId, parsedSequence, sim.log, setExportData]);

  // External reset / demo
  useEffect(() => {
    if (resetSignal > 0) {
      sim.reset();
      setSequenceText(scenarios[scenarioId].defaultSequence.join(", "));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal]);

  useEffect(() => {
    if (loadDemoSignal > 0) {
      const ids = Object.keys(scenarios);
      const next = ids[(ids.indexOf(scenarioId) + 1) % ids.length];
      setScenarioId(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadDemoSignal]);

  return (
    <motion.div
      className="pt-[88px] pb-6 px-4 md:px-6 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-[1500px] mx-auto">
        {/* Header strip */}
        <motion.div
          className="flex flex-wrap items-end justify-between gap-3 mb-4 px-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div>
            <div className="text-[11px] font-display tracking-widest text-[#00F5FF] mb-1">
              SIMULATOR
            </div>
            <h1 className="font-display text-2xl md:text-3xl text-white">{fsm.name}</h1>
            <p className="text-xs text-white/45 mt-0.5">{fsm.description}</p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <div className="flex items-center gap-1.5 text-white/50">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF] animate-pulse" />
              {sim.isRunning ? "RUNNING" : sim.isFinished ? "DONE" : "READY"}
            </div>
            <div className="text-white/30">·</div>
            <div className="text-white/50">
              MODE: <span className="text-[#00F5FF] font-bold">{mode.toUpperCase()}</span>
            </div>
            <div className="text-white/30">·</div>
            <div className="text-white/50">
              STEP: <span className="text-white">{Math.max(0, sim.currentStepIndex + 1)}</span>
              <span className="text-white/30"> / {sim.steps.length}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-12 gap-4" style={{ minHeight: "calc(100vh - 200px)" }}>
          {/* LEFT PANEL */}
          <div className="col-span-12 lg:col-span-3 flex flex-col" style={{ minHeight: 540 }}>
            <ControlPanel
              scenarioId={scenarioId}
              onScenarioChange={setScenarioId}
              sequenceText={sequenceText}
              onSequenceTextChange={setSequenceText}
              parsedSequence={parsedSequence}
              speed={speed}
              onSpeedChange={setSpeed}
              onRun={sim.run}
              onPause={sim.pause}
              onStep={sim.step}
              onReset={sim.reset}
              isRunning={sim.isRunning}
              isFinished={sim.isFinished}
              alphabet={fsm.alphabet}
            />
          </div>

          {/* CENTER + BOTTOM */}
          <div className="col-span-12 lg:col-span-9 flex flex-col gap-4">
            <GlassPanel className="overflow-hidden" style={{ minHeight: 480 }}>
              <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="font-display text-xs tracking-widest text-white/70">
                  STATE GRAPH
                </div>
                <div className="text-[10px] font-mono text-white/40">
                  {fsm.states.length} states · {fsm.transitions.length} transitions
                </div>
              </div>
              <div style={{ height: 480 }}>
                <GraphCanvas
                  fsm={fsm}
                  mode={mode}
                  currentStateId={sim.currentStateId}
                  activeEdge={sim.activeEdge}
                  errorState={sim.errorState}
                  height={480}
                />
              </div>
            </GlassPanel>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ minHeight: 240 }}>
              <div className="md:col-span-1 h-[260px]">
                <LogPanel log={sim.log} />
              </div>
              <div className="md:col-span-1 h-[260px]">
                <OutputPanel
                  output={sim.output}
                  outputBurstId={sim.outputBurstId}
                  mode={mode}
                  outputs={outputs}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

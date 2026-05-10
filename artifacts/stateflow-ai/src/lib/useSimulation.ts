import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FSM, FSMEngine, MachineType, SimulationStep } from "./fsm-engine";

export interface LogEntry {
  id: number;
  time: number;
  text: string;
  kind: "info" | "transition" | "output" | "error";
}

export interface UseSimulationResult {
  steps: SimulationStep[];
  currentStepIndex: number;
  currentStateId: string;
  activeEdge: { from: string; to: string; input: string } | null;
  output: string | null;
  outputKind: MachineType | null;
  outputBurstId: number;
  isRunning: boolean;
  isFinished: boolean;
  log: LogEntry[];
  errorState: string | null;
  run: () => void;
  pause: () => void;
  step: () => void;
  reset: () => void;
}

export function useSimulation(
  fsm: FSM,
  mode: MachineType,
  sequence: string[],
  speed: number = 1
): UseSimulationResult {
  const engine = useMemo(() => new FSMEngine(fsm, mode), [fsm, mode]);
  const steps = useMemo(() => engine.simulateSequence(sequence), [engine, sequence]);

  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [currentStateId, setCurrentStateId] = useState<string>(engine.getInitialState());
  const [activeEdge, setActiveEdge] = useState<{ from: string; to: string; input: string } | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [outputKind, setOutputKind] = useState<MachineType | null>(null);
  const [outputBurstId, setOutputBurstId] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [errorState, setErrorState] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const stateRef = useRef({ index: -1, currentState: engine.getInitialState() });

  // Reset on FSM/mode/sequence change
  useEffect(() => {
    stop();
    setCurrentStepIndex(-1);
    setCurrentStateId(engine.getInitialState());
    setActiveEdge(null);
    setOutput(null);
    setOutputKind(null);
    setLog([]);
    setErrorState(null);
    stateRef.current = { index: -1, currentState: engine.getInitialState() };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine, sequence]);

  const stop = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
  };

  const applyStep = useCallback(
    (step: SimulationStep, index: number) => {
      const id = Date.now() + Math.random();
      switch (step.type) {
        case "stateEnter": {
          if (step.to) {
            setCurrentStateId(step.to);
            stateRef.current.currentState = step.to;
          }
          setActiveEdge(null);
          if (index === 0) {
            setLog((l) => [
              ...l,
              { id, time: step.timestamp, text: `Initial state: ${step.to}`, kind: "info" },
            ]);
          }
          break;
        }
        case "transition": {
          if (step.from && step.to && step.input) {
            setActiveEdge({ from: step.from, to: step.to, input: step.input });
            setLog((l) => [
              ...l,
              {
                id,
                time: step.timestamp,
                text: `[Input: ${step.input}]  ${step.from}  →  ${step.to}`,
                kind: "transition",
              },
            ]);
          }
          break;
        }
        case "output": {
          if (step.output) {
            setOutput(step.output);
            setOutputKind(mode);
            setOutputBurstId((n) => n + 1);
            setLog((l) => [
              ...l,
              {
                id,
                time: step.timestamp,
                text: `↳ Output: ${step.output}`,
                kind: "output",
              },
            ]);
          }
          break;
        }
        case "error": {
          setErrorState(step.from ?? null);
          setLog((l) => [
            ...l,
            {
              id,
              time: step.timestamp,
              text: `⚠ No transition for '${step.input}' from ${step.from}`,
              kind: "error",
            },
          ]);
          break;
        }
      }
    },
    [mode]
  );

  const advance = useCallback(() => {
    const next = stateRef.current.index + 1;
    if (next >= steps.length) {
      stop();
      return;
    }
    stateRef.current.index = next;
    setCurrentStepIndex(next);
    const step = steps[next];
    applyStep(step, next);

    // Determine delay until the next step based on the upcoming step type
    const upcoming = steps[next + 1];
    let baseDelay = 700;
    if (upcoming) {
      if (upcoming.type === "transition") baseDelay = 700;
      else if (upcoming.type === "stateEnter") baseDelay = 500;
      else if (upcoming.type === "output") baseDelay = mode === "moore" ? 600 : 200;
      else baseDelay = 600;
    }
    const delay = Math.max(80, baseDelay / speed);

    if (next < steps.length - 1) {
      timerRef.current = window.setTimeout(() => {
        advance();
      }, delay);
    } else {
      stop();
    }
  }, [steps, applyStep, speed, mode]);

  const run = useCallback(() => {
    if (steps.length === 0) return;
    if (stateRef.current.index >= steps.length - 1) {
      // already done — restart
      doReset();
    }
    setIsRunning(true);
    timerRef.current = window.setTimeout(() => advance(), 60);
  }, [advance, steps.length]);

  const pause = useCallback(() => {
    stop();
  }, []);

  const step = useCallback(() => {
    stop();
    const next = stateRef.current.index + 1;
    if (next >= steps.length) return;
    stateRef.current.index = next;
    setCurrentStepIndex(next);
    applyStep(steps[next], next);
  }, [steps, applyStep]);

  const doReset = useCallback(() => {
    stop();
    setCurrentStepIndex(-1);
    setCurrentStateId(engine.getInitialState());
    setActiveEdge(null);
    setOutput(null);
    setOutputKind(null);
    setLog([]);
    setErrorState(null);
    stateRef.current = { index: -1, currentState: engine.getInitialState() };
  }, [engine]);

  const reset = doReset;

  useEffect(() => {
    return () => stop();
  }, []);

  const isFinished = currentStepIndex >= steps.length - 1 && currentStepIndex >= 0;

  return {
    steps,
    currentStepIndex,
    currentStateId,
    activeEdge,
    output,
    outputKind,
    outputBurstId,
    isRunning,
    isFinished,
    log,
    errorState,
    run,
    pause,
    step,
    reset,
  };
}

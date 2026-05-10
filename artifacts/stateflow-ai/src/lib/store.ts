import { create } from "zustand";
import { MachineType } from "./fsm-engine";

export interface ExportData {
  mode: MachineType;
  scenario: string;
  sequence: string[];
  log: { time: number; text: string }[];
}

interface SimulatorState {
  mode: MachineType;
  setMode: (m: MachineType) => void;
  exportData: ExportData | null;
  setExportData: (d: ExportData | null) => void;
  resetSignal: number;
  triggerReset: () => void;
  loadDemoSignal: number;
  triggerLoadDemo: () => void;
}

export const useSimulator = create<SimulatorState>((set) => ({
  mode: "moore",
  setMode: (m) => set({ mode: m }),
  exportData: null,
  setExportData: (d) => set({ exportData: d }),
  resetSignal: 0,
  triggerReset: () => set((s) => ({ resetSignal: s.resetSignal + 1 })),
  loadDemoSignal: 0,
  triggerLoadDemo: () => set((s) => ({ loadDemoSignal: s.loadDemoSignal + 1 })),
}));

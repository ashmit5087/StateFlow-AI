import { createContext, useContext, useState, ReactNode } from "react";
import { MachineType } from "./fsm-engine";

interface SimulatorState {
  mode: MachineType;
  setMode: (mode: MachineType) => void;
  exportData: any;
  setExportData: (data: any) => void;
}

const SimulatorContext = createContext<SimulatorState | null>(null);

export function SimulatorProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<MachineType>("moore");
  const [exportData, setExportData] = useState<any>(null);

  return (
    <SimulatorContext.Provider value={{ mode, setMode, exportData, setExportData }}>
      {children}
    </SimulatorContext.Provider>
  );
}

export function useSimulator() {
  const ctx = useContext(SimulatorContext);
  if (!ctx) throw new Error("useSimulator must be used within SimulatorProvider");
  return ctx;
}

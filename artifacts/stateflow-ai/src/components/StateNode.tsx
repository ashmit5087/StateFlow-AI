import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { motion } from "framer-motion";

export interface StateNodeData {
  label: string;
  isInitial?: boolean;
  isActive: boolean;
  isError: boolean;
  mooreOutput?: string;
  mode: "moore" | "mealy";
}

function StateNodeBase({ data }: NodeProps<StateNodeData>) {
  const { label, isInitial, isActive, isError, mooreOutput, mode } = data;

  const accent = isError ? "#FF4D6D" : isActive ? "#00F5FF" : "#7A5CFF";
  const glow = isActive
    ? "0 0 28px rgba(0, 245, 255, 0.85), 0 0 60px rgba(0, 245, 255, 0.45), inset 0 0 20px rgba(0, 245, 255, 0.25)"
    : isError
      ? "0 0 24px rgba(255, 77, 109, 0.65), inset 0 0 14px rgba(255, 77, 109, 0.18)"
      : "0 0 16px rgba(122, 92, 255, 0.35), inset 0 0 8px rgba(122, 92, 255, 0.15)";

  return (
    <div className="relative flex flex-col items-center select-none">
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-1 !h-1" />
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-1 !h-1" />
      <Handle type="target" position={Position.Left} id="lt" className="!bg-transparent !border-0 !w-1 !h-1" />
      <Handle type="source" position={Position.Right} id="rs" className="!bg-transparent !border-0 !w-1 !h-1" />

      <motion.div
        className="relative w-[80px] h-[80px] rounded-full flex items-center justify-center font-display font-bold text-base"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08), rgba(11,15,26,0.95))",
          border: `2px solid ${accent}`,
          color: "#E6EAF2",
          boxShadow: glow,
        }}
        animate={
          isActive
            ? {
                scale: [1, 1.08, 1],
                boxShadow: [
                  glow,
                  "0 0 36px rgba(0, 245, 255, 1), 0 0 80px rgba(0, 245, 255, 0.6), inset 0 0 24px rgba(0, 245, 255, 0.3)",
                  glow,
                ],
              }
            : isError
              ? { scale: [1, 1.04, 1] }
              : { scale: 1 }
        }
        transition={
          isActive
            ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
            : isError
              ? { duration: 0.7, repeat: 3 }
              : { duration: 0.3 }
        }
      >
        {isInitial && (
          <div
            className="absolute -left-7 top-1/2 -translate-y-1/2 text-[10px] font-display tracking-widest"
            style={{ color: "#00F5FF" }}
          >
            ▶
          </div>
        )}
        <span className="relative z-10">{label}</span>
      </motion.div>

      {/* Moore output beneath the node */}
      {mode === "moore" && mooreOutput && (
        <motion.div
          key={`${label}-${isActive}`}
          className="mt-2 px-2 py-1 rounded-md text-[10px] font-mono tracking-wide max-w-[160px] text-center"
          style={{
            background: isActive
              ? "rgba(0, 245, 255, 0.18)"
              : "rgba(255,255,255,0.05)",
            color: isActive ? "#E6EAF2" : "#8A93A7",
            border: `1px solid ${isActive ? "rgba(0,245,255,0.5)" : "rgba(255,255,255,0.08)"}`,
            boxShadow: isActive ? "0 0 16px rgba(0,245,255,0.45)" : "none",
          }}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {mooreOutput}
        </motion.div>
      )}
    </div>
  );
}

export const StateNode = memo(StateNodeBase);

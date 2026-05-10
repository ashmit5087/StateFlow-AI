import { motion } from "framer-motion";
import { MachineType } from "@/lib/fsm-engine";

export function MachineToggle({ value, onChange }: { value: MachineType; onChange: (v: MachineType) => void }) {
  return (
    <div className="flex items-center bg-black/40 rounded-full p-1 border border-white/10 relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
      <button
        onClick={() => onChange("moore")}
        className={`relative z-10 px-4 py-1.5 text-sm font-bold font-display rounded-full transition-colors ${value === "moore" ? "text-[#0B0F1A]" : "text-white/60 hover:text-white"}`}
      >
        MOORE
      </button>
      <button
        onClick={() => onChange("mealy")}
        className={`relative z-10 px-4 py-1.5 text-sm font-bold font-display rounded-full transition-colors ${value === "mealy" ? "text-[#0B0F1A]" : "text-white/60 hover:text-white"}`}
      >
        MEALY
      </button>
      <motion.div
        className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-[#00F5FF] to-[#7A5CFF] rounded-full shadow-[0_0_10px_rgba(0,245,255,0.5)]"
        animate={{ left: value === "moore" ? "4px" : "calc(50% + 0px)" }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    </div>
  );
}

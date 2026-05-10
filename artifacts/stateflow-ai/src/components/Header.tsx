import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Download, RefreshCw, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useSimulator } from "@/lib/store";
import { MachineToggle } from "./MachineToggle";

export function Header() {
  const [location] = useLocation();
  const { mode, setMode, exportData } = useSimulator();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => {
      setIsScrolled(window.scrollY >= 100);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollState);
    };
  }, []);

  const handleExport = () => {
    if (!exportData) return;
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stateflow-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 transition-all duration-300 ease-out ${
        isScrolled
          ? "h-[58px] bg-[linear-gradient(180deg,rgba(7,19,33,0.62)_0%,rgba(7,28,48,0.48)_100%)] backdrop-blur-2xl border-b border-cyan-200/10 shadow-[0_12px_40px_rgba(1,12,24,0.28),inset_0_1px_0_rgba(255,255,255,0.08)]"
          : "h-[72px] bg-transparent border-b border-transparent shadow-none"
      }`}
      initial={{ y: -72 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#00F5FF] to-[#7A5CFF] flex items-center justify-center shadow-[0_0_15px_rgba(0,245,255,0.5)]">
            <span className="font-display font-bold text-white text-xl">S</span>
          </div>
          <span className="font-display font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] to-[#7A5CFF] neon-text-blue">
            StateFlow AI
          </span>
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-1">
        {[
          { path: "/", label: "Home" },
          { path: "/simulator", label: "Simulator" },
          { path: "/compare", label: "Compare" },
          { path: "/learn", label: "Learn" },
        ].map((link) => {
          const isActive = location === link.path;
          return (
            <Link key={link.path} href={link.path} className="relative px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors group">
              {link.label}
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00F5FF] shadow-[0_0_8px_rgba(0,245,255,0.8)]"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-4">
        {(location === "/simulator" || location === "/compare") && (
          <MachineToggle value={mode} onChange={setMode} />
        )}
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.location.reload()}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all hover:scale-105 active:scale-95"
            title="Reset App"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          
          {(location === "/simulator" || location === "/compare") && (
            <button 
              onClick={handleExport}
              disabled={!exportData}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-[#00F5FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100"
              title="Export JSON"
            >
              <Download className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </motion.header>
  );
}

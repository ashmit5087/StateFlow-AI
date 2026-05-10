import { Link } from "wouter";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 pt-[72px]">
      <motion.div
        className="glass-panel rounded-2xl p-10 max-w-md w-full text-center relative overflow-hidden"
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="absolute -top-20 -left-20 w-40 h-40 rounded-full blur-3xl opacity-40"
          style={{ background: "#FF4D9D" }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-40"
          style={{ background: "#00F5FF" }}
        />
        <div className="relative">
          <motion.div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-5"
            style={{
              background: "rgba(255, 77, 109, 0.15)",
              border: "1px solid rgba(255, 77, 109, 0.4)",
              boxShadow: "0 0 20px rgba(255, 77, 109, 0.4)",
            }}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <AlertCircle className="w-7 h-7 text-[#FF4D6D]" />
          </motion.div>
          <h1
            className="font-display font-bold mb-2"
            style={{
              fontSize: "clamp(48px, 6vw, 80px)",
              background: "linear-gradient(90deg, #00F5FF 0%, #FF4D9D 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            404
          </h1>
          <div className="font-display tracking-widest text-xs text-white/60 mb-3">
            STATE NOT REACHABLE
          </div>
          <p className="text-white/55 text-sm mb-6">
            No transition found from your current state to this route.
          </p>
          <Link href="/">
            <motion.span
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-display tracking-wider text-xs font-bold text-[#0B0F1A]"
              style={{
                background: "linear-gradient(90deg, #00F5FF 0%, #7A5CFF 100%)",
                boxShadow: "0 0 22px rgba(0, 245, 255, 0.5)",
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              RETURN TO INITIAL STATE
            </motion.span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

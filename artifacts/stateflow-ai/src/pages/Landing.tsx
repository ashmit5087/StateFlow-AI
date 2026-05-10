import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, GitBranch, Sparkles, Zap, Layers, Cpu } from "lucide-react";
import { StartupSequence } from "@/components/StartupSequence";

const HERO_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4";

function FloatingPreview() {
  const states = [
    { id: "S0", x: 50, y: 180, label: "IDLE" },
    { id: "S1", x: 200, y: 80, label: "AUTH" },
    { id: "S2", x: 360, y: 160, label: "OTP" },
    { id: "S3", x: 460, y: 280, label: "OK" },
  ];
  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="rounded-3xl p-5 relative overflow-hidden bg-transparent border border-white/10"
      style={{ transform: "rotateX(6deg) rotateY(-8deg)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#FF4D9D]" />
          <span className="h-2 w-2 rounded-full bg-[#7A5CFF]" />
          <span className="h-2 w-2 rounded-full bg-[#00F5FF]" />
        </div>
        <span className="font-display text-[10px] tracking-[0.4em] text-white/60">
          LIVE PREVIEW
        </span>
      </div>
      <div className="relative rounded-2xl bg-transparent overflow-hidden h-[340px]">
        <svg viewBox="0 0 520 360" className="w-full h-full">
          <defs>
            <linearGradient id="hg" x1="0" x2="1">
              <stop offset="0%" stopColor="#00F5FF" />
              <stop offset="100%" stopColor="#7A5CFF" />
            </linearGradient>
          </defs>
          {[
            ["S0", "S1"],
            ["S1", "S2"],
            ["S2", "S3"],
          ].map(([a, b], i) => {
            const A = states.find((s) => s.id === a)!;
            const B = states.find((s) => s.id === b)!;
            return (
              <line
                key={i}
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                stroke="url(#hg)"
                strokeWidth={2}
                strokeDasharray="6 6"
                style={{ animation: "flow 1.6s linear infinite" }}
                opacity={0.85}
              />
            );
          })}
          {states.map((s, i) => (
            <g key={s.id}>
              <circle
                cx={s.x}
                cy={s.y}
                r={32}
                fill="rgba(11,15,26,0.85)"
                stroke="#7A5CFF"
                strokeWidth={1.5}
              >
                <animate
                  attributeName="r"
                  values="30;34;30"
                  dur={`${2 + i * 0.3}s`}
                  repeatCount="indefinite"
                />
              </circle>
              <text
                x={s.x}
                y={s.y + 5}
                textAnchor="middle"
                fontSize={14}
                fontWeight={800}
                fontFamily="Orbitron"
                fill="#E6EAF2"
              >
                {s.id}
              </text>
              <text
                x={s.x}
                y={s.y + 52}
                textAnchor="middle"
                fontSize={9}
                fontFamily="Inter"
                fill="#8A93A7"
                letterSpacing={2}
              >
                {s.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-white/60">
        <span>
          λ(S2,verify) = <span className="text-[#FF4D9D]">"OTP Sent"</span>
        </span>
        <span className="text-[#00F5FF]">▌RUNNING</span>
      </div>
    </motion.div>
  );
}

const features = [
  {
    icon: <GitBranch className="w-5 h-5" />,
    title: "Visualize Automata",
    body: "Watch state graphs come alive — neon nodes pulse, edges flow with current, every transition rendered as motion.",
    color: "#00F5FF",
  },
  {
    icon: <Layers className="w-5 h-5" />,
    title: "Moore vs Mealy",
    body: "See exactly how output timing differs — Moore fires after a state activates, Mealy fires during the transition itself.",
    color: "#7A5CFF",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Real-time Simulation",
    body: "Step through inputs, control playback speed from 0.25x to 3x, pause and inspect any moment of the run.",
    color: "#FF4D9D",
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "Built-in Scenarios",
    body: "Preloaded with OTP authentication, e-commerce checkout, and chatbot greeting — or define your own input sequence.",
    color: "#00F5FF",
  },
];

export default function Landing() {
  const [showStartup, setShowStartup] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const skip =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("skipIntro");
    const seen = localStorage.getItem("stateflow.startupSeen");
    if (!seen && !skip) {
      setShowStartup(true);
    } else {
      setReady(true);
    }
  }, []);

  if (showStartup) {
    return (
      <StartupSequence
        onComplete={() => {
          localStorage.setItem("stateflow.startupSeen", "1");
          setShowStartup(false);
          setReady(true);
        }}
      />
    );
  }

  if (!ready) return null;

  return (
    <div className="relative">
      {/* HERO — replicated from stateflow-weaver */}
      <section className="relative min-h-screen w-full overflow-hidden bg-[color:var(--bg-primary)]">
        {/* Video background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 z-0 h-full w-full object-cover"
          src={HERO_VIDEO_URL}
        />
        {/* Cyberpunk overlay */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,15,26,0.55) 0%, rgba(11,15,26,0.65) 40%, rgba(11,15,26,0.92) 100%), radial-gradient(900px 500px at 80% 10%, rgba(122,92,255,0.35), transparent 60%), radial-gradient(900px 500px at 10% 90%, rgba(255,77,157,0.28), transparent 60%)",
          }}
        />
        <div className="absolute inset-0 z-[2] grid-bg opacity-60" />
        <div className="absolute inset-0 z-[2] scanlines" />

        {/* Floating glow orbs */}
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute z-[3] top-32 left-[10%] h-3 w-3 rounded-full bg-[#00F5FF]"
          style={{ boxShadow: "0 0 30px #00F5FF, 0 0 60px #00F5FF" }}
        />
        <motion.div
          animate={{ y: [0, 25, 0], x: [0, -15, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute z-[3] top-1/2 right-[12%] h-2 w-2 rounded-full bg-[#FF4D9D]"
          style={{ boxShadow: "0 0 30px #FF4D9D, 0 0 60px #FF4D9D" }}
        />

        {/* Hero content */}
        <div className="relative z-10 mx-auto max-w-[1500px] px-6 lg:px-10 pt-[112px] lg:pt-[128px] pb-32 grid lg:grid-cols-12 gap-10 items-center min-h-screen">
          {/* Left */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#00F5FF] animate-pulse" />
              <span className="text-[10px] tracking-[0.4em] uppercase text-white/85 font-display">
                v2.4 · Moore × Mealy
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="font-display text-5xl md:text-7xl xl:text-8xl font-black leading-[0.95] tracking-[-0.04em] text-white"
            >
              See the
              <br />
              <span className="gradient-text">state machines</span>
              <br />
              <span className="text-white/70">come alive.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="mt-5 text-xl md:text-2xl text-white/85"
            >
              <span className="font-serif-italic text-white/75">see</span>{" "}
              state become{" "}
              <span className="font-serif-italic text-white/75">motion</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="mt-6 max-w-xl text-base md:text-lg text-white/70 leading-relaxed"
            >
              A cinematic, interactive simulator for{" "}
              <span className="text-[#00F5FF] font-semibold">Moore</span> and{" "}
              <span className="text-[#FF4D9D] font-semibold">Mealy</span>{" "}
              machines. Type a sequence, watch your input{" "}
              <span className="font-serif-italic text-white/90">flow</span>{" "}
              through neon state graphs in real time.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link href="/simulator">
                <motion.span
                  className="group relative inline-flex items-center gap-2 pl-7 pr-2 py-2 !rounded-full font-display tracking-wider text-sm font-bold text-white liquid-glass-strong"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  LAUNCH SIMULATOR
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(0,245,255,0.9), rgba(122,92,255,0.9))",
                      boxShadow: "0 0 18px rgba(0,245,255,0.55)",
                    }}
                  >
                    <ArrowRight className="w-4 h-4 text-[#0B0F1A] transition-transform group-hover:translate-x-0.5" />
                  </span>
                </motion.span>
              </Link>
              <Link href="/learn">
                <motion.span
                  className="liquid-glass inline-flex items-center gap-2 px-7 py-3.5 !rounded-full font-display tracking-wider text-sm text-white/80 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  LEARN THE THEORY
                </motion.span>
              </Link>
            </motion.div>

            {/* feature pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.95, duration: 0.7 }}
              className="mt-10 flex flex-wrap gap-2"
            >
              {[
                { i: <Zap className="h-3 w-3" />, t: "Real-time animations" },
                { i: <GitBranch className="h-3 w-3" />, t: "3 preset scenarios" },
                { i: <Cpu className="h-3 w-3" />, t: "Custom sequences" },
                { i: <Sparkles className="h-3 w-3" />, t: "Glassmorphic UI" },
              ].map((p, i) => (
                <motion.span
                  key={p.t}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 + i * 0.08 }}
                  className="glass rounded-full px-3 py-1.5 text-[11px] text-white/80 inline-flex items-center gap-1.5"
                >
                  {p.i}
                  {p.t}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Right — floating preview card */}
          <motion.div
            initial={{ opacity: 0, x: 60, rotateY: 12 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 hidden lg:block perspective-[1200px]"
          >
            <FloatingPreview />
          </motion.div>
        </div>

        {/* Bottom marquee */}
        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 glass overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 py-3 whitespace-nowrap font-display text-[11px] tracking-[0.5em] text-white/60"
          >
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex gap-12">
                {[
                  "S0 → S1 → S2 → S3",
                  "OUTPUT: ACCESS GRANTED",
                  "MOORE = STATE OUTPUT",
                  "MEALY = EDGE OUTPUT",
                  "δ(q, a) = q'",
                  "λ(q) = output",
                  "λ(q, a) = output",
                  "INITIALIZE · SIMULATE · OBSERVE",
                ].map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative px-6 py-20 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-[11px] font-display tracking-widest text-[#00F5FF] mb-3">
            CAPABILITIES
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-white mb-4">
            Built for <span className="font-serif-italic text-white/80">visual</span> clarity
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Every transition is animated. Every output is timed precisely so you can
            see the difference between the two machine models at a glance.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="group liquid-glass relative p-5 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <div
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-30 transition-opacity group-hover:opacity-60"
                style={{ background: f.color }}
              />
              <div
                className="relative w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  color: f.color,
                  border: `1px solid ${f.color}40`,
                  boxShadow: `0 0 16px ${f.color}30`,
                }}
              >
                {f.icon}
              </div>
              <div className="relative font-display text-base text-white mb-1.5">
                {f.title}
              </div>
              <div className="relative text-[12px] text-white/55 leading-relaxed">
                {f.body}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* COMPARISON CTA */}
      <section className="relative px-6 py-20 max-w-5xl mx-auto">
        <motion.div
          className="relative liquid-glass-strong !rounded-3xl p-8 md:p-12"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
        >
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 20% 0%, rgba(0,245,255,0.18), transparent 50%), radial-gradient(circle at 80% 100%, rgba(255,77,157,0.18), transparent 50%)",
            }}
          />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-[11px] font-display tracking-widest text-[#FF4D9D] mb-2">
                COMPARE MODE
              </div>
              <h3 className="font-display text-2xl md:text-3xl text-white mb-3">
                Moore on the left.<br />Mealy on the right.<br />Same input.
              </h3>
              <p className="text-white/55 mb-6">
                Run them side-by-side and watch the output timing diverge in real time.
              </p>
              <Link href="/compare">
                <motion.span
                  className="liquid-glass inline-flex items-center gap-2 px-5 py-2.5 !rounded-full font-display tracking-wider text-xs font-bold text-white hover:text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  OPEN COMPARISON
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.span>
              </Link>
            </div>
            <div className="relative h-40">
              <motion.div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-[#00F5FF]"
                style={{
                  boxShadow: "0 0 24px rgba(0,245,255,0.6), inset 0 0 12px rgba(0,245,255,0.3)",
                }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-[#FF4D9D]"
                style={{
                  boxShadow: "0 0 24px rgba(255,77,157,0.6), inset 0 0 12px rgba(255,77,157,0.3)",
                }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 60">
                <motion.line
                  x1="20" y1="30" x2="180" y2="30"
                  stroke="url(#cmpGrad)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5 }}
                />
                <defs>
                  <linearGradient id="cmpGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00F5FF" />
                    <stop offset="100%" stopColor="#FF4D9D" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="relative px-6 py-10 text-center border-t border-white/5">
        <div className="font-display text-[11px] tracking-widest text-white/40">
          STATEFLOW AI — INITIALIZED · READY · WATCHING
        </div>
        <div className="mt-2 text-[10px] text-white/25 font-mono">
          A pedagogical visualization of finite automata with output.
        </div>
      </footer>
    </div>
  );
}

import { motion } from "framer-motion";
import { ArrowRight, Cpu, GitBranch, Layers } from "lucide-react";
import { Link } from "wouter";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

export default function Learn() {
  return (
    <motion.div
      className="pt-[88px] pb-20 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div className="mb-14" {...fadeUp}>
          <div className="text-[11px] font-display tracking-widest text-[#7A5CFF] mb-2">
            THEORY · CHAPTER 01
          </div>
          <h1
            className="font-display font-bold leading-[1] tracking-tight mb-4"
            style={{ fontSize: "clamp(40px, 6vw, 72px)" }}
          >
            <span
              style={{
                background:
                  "linear-gradient(90deg, #00F5FF 0%, #7A5CFF 50%, #FF4D9D 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Moore vs Mealy
            </span>
          </h1>
          <p className="text-white/55 text-lg leading-relaxed">
            Two ways to attach output to a finite state machine. Same expressive
            power — radically different timing.
          </p>
        </motion.div>

        {/* FSM definition */}
        <motion.section className="mb-14" {...fadeUp}>
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-[#00F5FF]" />
            <h2 className="font-display text-xs tracking-widest text-white/70">
              WHAT IS A FINITE STATE MACHINE
            </h2>
          </div>
          <div className="glass-panel rounded-xl p-6">
            <p className="text-white/70 leading-relaxed mb-4">
              A finite state machine (FSM) is a mathematical model of computation that
              moves between a finite number of states in response to a sequence of
              inputs. Formally, it is the tuple
            </p>
            <div className="font-mono text-center text-base md:text-lg my-3 text-[#00F5FF] tracking-wide">
              M = ( Q , Σ , Γ , δ , λ , q₀ )
            </div>
            <ul className="text-sm text-white/55 font-mono space-y-1 mt-4">
              <li><span className="text-white/80">Q</span>  — finite set of states</li>
              <li><span className="text-white/80">Σ</span>  — input alphabet</li>
              <li><span className="text-white/80">Γ</span>  — output alphabet</li>
              <li><span className="text-white/80">δ</span>  — transition function</li>
              <li><span className="text-white/80">λ</span>  — output function</li>
              <li><span className="text-white/80">q₀</span> — initial state</li>
            </ul>
          </div>
        </motion.section>

        {/* Moore */}
        <motion.section className="mb-14" {...fadeUp}>
          <div className="flex items-center gap-2 mb-3">
            <GitBranch className="w-4 h-4 text-[#00F5FF]" />
            <h2 className="font-display text-xs tracking-widest text-[#00F5FF]">
              MOORE MACHINE
            </h2>
          </div>
          <div
            className="glass-panel rounded-xl p-6 relative overflow-hidden"
            style={{ borderColor: "rgba(0,245,255,0.18)" }}
          >
            <div
              className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-25"
              style={{ background: "#00F5FF" }}
            />
            <div className="relative">
              <p className="text-white/70 leading-relaxed mb-4">
                In a Moore machine, output is determined entirely by the
                <span className="text-[#00F5FF]"> current state</span>. Whenever the
                machine arrives in a state, it emits that state's output — regardless
                of which transition brought it there.
              </p>
              <div className="font-mono text-center text-base md:text-lg my-4 text-[#00F5FF]">
                λ : Q → Γ
              </div>

              {/* Mini diagram */}
              <div className="flex items-center justify-center gap-6 my-6">
                <MiniState label="S₀" output="Idle" color="#00F5FF" delay={0} />
                <Arrow input="login" />
                <MiniState label="S₁" output="OTP Sent" color="#00F5FF" delay={0.3} highlight />
              </div>
              <p className="text-white/45 text-xs text-center font-mono">
                Output "OTP Sent" appears <span className="text-[#00F5FF]">after</span> arriving in S₁.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Mealy */}
        <motion.section className="mb-14" {...fadeUp}>
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-[#FF4D9D]" />
            <h2 className="font-display text-xs tracking-widest text-[#FF4D9D]">
              MEALY MACHINE
            </h2>
          </div>
          <div
            className="glass-panel rounded-xl p-6 relative overflow-hidden"
            style={{ borderColor: "rgba(255,77,157,0.18)" }}
          >
            <div
              className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-25"
              style={{ background: "#FF4D9D" }}
            />
            <div className="relative">
              <p className="text-white/70 leading-relaxed mb-4">
                In a Mealy machine, output is determined by the
                <span className="text-[#FF4D9D]"> current state and the input </span>
                — i.e. by the transition itself. The output is emitted as the edge fires,
                before the next state is fully entered.
              </p>
              <div className="font-mono text-center text-base md:text-lg my-4 text-[#FF4D9D]">
                λ : Q × Σ → Γ
              </div>

              <div className="flex items-center justify-center gap-6 my-6">
                <MiniState label="S₀" color="#FF4D9D" delay={0} />
                <ArrowWithOutput input="login" output="Send SMS" color="#FF4D9D" />
                <MiniState label="S₁" color="#FF4D9D" delay={0.3} highlight />
              </div>
              <p className="text-white/45 text-xs text-center font-mono">
                Output "Send SMS" appears <span className="text-[#FF4D9D]">during</span> the S₀→S₁ transition.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Comparison table */}
        <motion.section className="mb-14" {...fadeUp}>
          <h2 className="font-display text-xs tracking-widest text-white/70 mb-3">
            HEAD TO HEAD
          </h2>
          <div className="glass-panel rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-3 text-white/40 font-display tracking-wider text-[11px]">
                    PROPERTY
                  </th>
                  <th className="text-left p-3 font-display tracking-wider text-[11px] text-[#00F5FF]">
                    MOORE
                  </th>
                  <th className="text-left p-3 font-display tracking-wider text-[11px] text-[#FF4D9D]">
                    MEALY
                  </th>
                </tr>
              </thead>
              <tbody className="text-white/70">
                <Row p="Output depends on" m="State only" me="State + Input" />
                <Row p="Output timing" m="After state activation" me="During transition" />
                <Row p="Output function" m="λ : Q → Γ" me="λ : Q × Σ → Γ" mono />
                <Row p="Reaction speed" m="One step delayed" me="Immediate" />
                <Row p="States required" m="Often more" me="Often fewer" />
                <Row p="Best for" m="Display-style outputs" me="Reactive control" />
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* When to use */}
        <motion.section className="mb-14" {...fadeUp}>
          <h2 className="font-display text-xs tracking-widest text-white/70 mb-3">
            WHEN TO USE WHICH
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <UseCard
              color="#00F5FF"
              title="Reach for Moore when…"
              points={[
                "The output represents a stable mode (idle, busy, error)",
                "Hardware needs predictable, glitch-free signals",
                "You want clean, easy-to-debug FSMs",
              ]}
            />
            <UseCard
              color="#FF4D9D"
              title="Reach for Mealy when…"
              points={[
                "Reactions must happen on the same clock as the input",
                "You want a more compact machine (fewer states)",
                "The output naturally couples to a specific input",
              ]}
            />
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div className="text-center" {...fadeUp}>
          <Link href="/compare">
            <motion.span
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-display tracking-wider text-sm font-bold text-[#0B0F1A]"
              style={{
                background: "linear-gradient(90deg, #00F5FF 0%, #7A5CFF 100%)",
                boxShadow: "0 0 28px rgba(0, 245, 255, 0.5)",
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              SEE THEM SIDE BY SIDE
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Row({ p, m, me, mono }: { p: string; m: string; me: string; mono?: boolean }) {
  return (
    <tr className="border-b border-white/5">
      <td className="p-3 text-white/40 text-xs font-display tracking-wider">{p}</td>
      <td className={`p-3 ${mono ? "font-mono text-[#00F5FF]" : ""}`}>{m}</td>
      <td className={`p-3 ${mono ? "font-mono text-[#FF4D9D]" : ""}`}>{me}</td>
    </tr>
  );
}

function MiniState({
  label,
  output,
  color,
  delay = 0,
  highlight,
}: {
  label: string;
  output?: string;
  color: string;
  delay?: number;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className="w-16 h-16 rounded-full flex items-center justify-center font-display font-bold text-sm border-2"
        style={{
          borderColor: color,
          background: "rgba(11,15,26,0.85)",
          color: "#E6EAF2",
          boxShadow: highlight
            ? `0 0 20px ${color}, inset 0 0 12px ${color}40`
            : `0 0 8px ${color}40`,
        }}
        animate={
          highlight
            ? { scale: [1, 1.08, 1] }
            : {}
        }
        transition={{ duration: 1.6, repeat: Infinity, delay }}
      >
        {label}
      </motion.div>
      {output && (
        <motion.div
          className="text-[11px] font-mono px-2 py-0.5 rounded"
          style={{
            color,
            background: `${color}15`,
            border: `1px solid ${color}40`,
          }}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.6 }}
        >
          {output}
        </motion.div>
      )}
    </div>
  );
}

function Arrow({ input }: { input: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-[10px] font-mono text-white/50 mb-1">{input}</div>
      <svg width="60" height="14" viewBox="0 0 60 14">
        <motion.path
          d="M0,7 L52,7 M46,2 L52,7 L46,12"
          fill="none"
          stroke="#7A5CFF"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
        />
      </svg>
    </div>
  );
}

function ArrowWithOutput({ input, output, color }: { input: string; output: string; color: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-[10px] font-mono mb-1">
        <span className="text-white/50">{input}</span>
        <span className="text-white/30 mx-1">/</span>
        <span style={{ color }}>{output}</span>
      </div>
      <svg width="80" height="14" viewBox="0 0 80 14">
        <motion.path
          d="M0,7 L72,7 M66,2 L72,7 L66,12"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeDasharray="3 3"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
    </div>
  );
}

function UseCard({ color, title, points }: { color: string; title: string; points: string[] }) {
  return (
    <div
      className="glass-panel rounded-xl p-5 relative overflow-hidden"
      style={{ borderColor: `${color}25` }}
    >
      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-3xl opacity-30"
        style={{ background: color }}
      />
      <div className="relative">
        <div
          className="font-display text-sm tracking-wide mb-3"
          style={{ color }}
        >
          {title}
        </div>
        <ul className="space-y-2">
          {points.map((p) => (
            <li key={p} className="flex gap-2 text-sm text-white/65">
              <span style={{ color }} className="mt-0.5">›</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

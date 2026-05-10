import { FSM } from "./fsm-engine";

export interface NodePosition {
  id: string;
  x: number;
  y: number;
}

export function computeLayout(fsm: FSM, width = 720, height = 460): Record<string, { x: number; y: number }> {
  const n = fsm.states.length;
  const positions: Record<string, { x: number; y: number }> = {};

  if (n === 0) return positions;

  if (n === 1) {
    positions[fsm.states[0].id] = { x: width / 2, y: height / 2 };
    return positions;
  }

  // Radial layout — place nodes evenly around an ellipse
  const cx = width / 2;
  const cy = height / 2;
  const rx = Math.min(width * 0.36, 280);
  const ry = Math.min(height * 0.34, 180);
  const startAngle = -Math.PI / 2;

  fsm.states.forEach((s, i) => {
    const angle = startAngle + (i / n) * Math.PI * 2;
    positions[s.id] = {
      x: cx + Math.cos(angle) * rx,
      y: cy + Math.sin(angle) * ry,
    };
  });

  return positions;
}

import { useEffect, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  BackgroundVariant,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion } from "framer-motion";
import { FSM, MachineType } from "@/lib/fsm-engine";
import { computeLayout } from "@/lib/layout";
import { StateNode, StateNodeData } from "./StateNode";

interface GraphCanvasProps {
  fsm: FSM;
  mode: MachineType;
  currentStateId: string;
  activeEdge: { from: string; to: string; input: string } | null;
  errorState: string | null;
  height?: number;
}

const nodeTypes = { state: StateNode };

function GraphCanvasInner({
  fsm,
  mode,
  currentStateId,
  activeEdge,
  errorState,
  height = 460,
}: GraphCanvasProps) {
  const positions = useMemo(() => computeLayout(fsm, 760, height - 40), [fsm, height]);

  const initialNodes: Node<StateNodeData>[] = useMemo(
    () =>
      fsm.states.map((s) => ({
        id: s.id,
        type: "state",
        position: positions[s.id],
        data: {
          label: s.label,
          isInitial: s.isInitial,
          isActive: s.id === currentStateId,
          isError: s.id === errorState,
          mooreOutput: fsm.mooreOutputs[s.id],
          mode,
        },
        draggable: true,
      })),
    // initial only — updates handled via setNodes effect below
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fsm, positions]
  );

  const initialEdges: Edge[] = useMemo(
    () =>
      fsm.transitions.map((t, i) => {
        const isSelfLoop = t.from === t.to;
        const labelText =
          mode === "mealy"
            ? `${t.input} / ${fsm.mealyOutputs[t.from]?.[t.input] ?? "—"}`
            : t.input;
        return {
          id: `e-${i}`,
          source: t.from,
          target: t.to,
          label: labelText,
          type: isSelfLoop ? "default" : "default",
          animated: false,
          style: {
            stroke: "rgba(122, 92, 255, 0.55)",
            strokeWidth: 1.6,
          },
          labelStyle: {
            fill: "#E6EAF2",
            fontSize: 10,
            fontFamily: "ui-monospace, monospace",
            fontWeight: 600,
          },
          labelBgStyle: {
            fill: "rgba(11, 15, 26, 0.85)",
            stroke: "rgba(122, 92, 255, 0.4)",
          },
          labelBgPadding: [6, 3] as [number, number],
          labelBgBorderRadius: 4,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "rgba(122, 92, 255, 0.7)",
            width: 16,
            height: 16,
          },
        };
      }),
    [fsm, mode]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Reset graph when FSM/mode changes
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Update node active/error state without reflowing positions
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isActive: n.id === currentStateId,
          isError: n.id === errorState,
          mode,
          mooreOutput: fsm.mooreOutputs[n.id],
        },
      }))
    );
  }, [currentStateId, errorState, mode, fsm.mooreOutputs, setNodes]);

  // Update active edge styling
  useEffect(() => {
    setEdges((eds) =>
      eds.map((e) => {
        const isActive =
          activeEdge !== null &&
          e.source === activeEdge.from &&
          e.target === activeEdge.to;
        return {
          ...e,
          animated: isActive,
          style: {
            stroke: isActive ? "#00F5FF" : "rgba(122, 92, 255, 0.55)",
            strokeWidth: isActive ? 2.6 : 1.6,
            filter: isActive ? "drop-shadow(0 0 6px rgba(0,245,255,0.85))" : undefined,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isActive ? "#00F5FF" : "rgba(122, 92, 255, 0.7)",
            width: 16,
            height: 16,
          },
        };
      })
    );
  }, [activeEdge, setEdges]);

  return (
    <motion.div
      className="w-full h-full rounded-xl overflow-hidden"
      style={{ height }}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25, includeHiddenNodes: false }}
        minZoom={0.4}
        maxZoom={1.6}
        proOptions={{ hideAttribution: true }}
        nodesConnectable={false}
        edgesUpdatable={false}
        elementsSelectable={false}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="rgba(255,255,255,0.07)"
        />
        <Controls
          showInteractive={false}
          className="!bg-black/40 !border !border-white/10 !rounded-lg [&>button]:!bg-transparent [&>button]:!text-white/70 [&>button:hover]:!text-[#00F5FF] [&>button]:!border-white/10"
        />
      </ReactFlow>
    </motion.div>
  );
}

export function GraphCanvas(props: GraphCanvasProps) {
  return (
    <ReactFlowProvider>
      <GraphCanvasInner {...props} />
    </ReactFlowProvider>
  );
}

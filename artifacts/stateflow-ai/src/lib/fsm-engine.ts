export type MachineType = 'moore' | 'mealy';

export interface State {
  id: string;
  label: string;
  isInitial?: boolean;
}

export interface Transition {
  from: string;
  to: string;
  input: string;
}

export interface FSM {
  id: string;
  name: string;
  description: string;
  states: State[];
  transitions: Transition[];
  mooreOutputs: Record<string, string>; // stateId -> output
  mealyOutputs: Record<string, Record<string, string>>; // stateId -> input -> output
  alphabet: string[];
  defaultSequence: string[];
}

export type SimulationStepType = 'stateEnter' | 'transition' | 'output' | 'error';

export interface SimulationStep {
  type: SimulationStepType;
  from?: string;
  to?: string;
  input?: string;
  output?: string;
  message?: string;
  timestamp: number;
}

export class FSMEngine {
  private fsm: FSM;
  private mode: MachineType;
  
  constructor(fsm: FSM, mode: MachineType = 'moore') {
    this.fsm = fsm;
    this.mode = mode;
  }

  public getInitialState(): string {
    const initial = this.fsm.states.find(s => s.isInitial);
    return initial ? initial.id : this.fsm.states[0].id;
  }

  public simulateSequence(sequence: string[]): SimulationStep[] {
    const steps: SimulationStep[] = [];
    let currentStateId = this.getInitialState();
    let time = 0;

    // Initial state enter
    steps.push({
      type: 'stateEnter',
      to: currentStateId,
      timestamp: time++
    });

    if (this.mode === 'moore') {
      const output = this.fsm.mooreOutputs[currentStateId];
      if (output) {
        steps.push({
          type: 'output',
          from: currentStateId,
          output,
          timestamp: time++
        });
      }
    }

    for (const input of sequence) {
      if (!input.trim()) continue;
      
      const transition = this.fsm.transitions.find(t => t.from === currentStateId && t.input === input);
      
      if (!transition) {
        steps.push({
          type: 'error',
          from: currentStateId,
          input,
          message: `No transition for '${input}' from ${currentStateId}`,
          timestamp: time++
        });
        break; // Stop simulation on error
      }

      if (this.mode === 'mealy') {
        const output = this.fsm.mealyOutputs[currentStateId]?.[input];
        if (output) {
           steps.push({
            type: 'output',
            from: currentStateId,
            to: transition.to,
            input,
            output,
            timestamp: time++
          });
        }
      }

      steps.push({
        type: 'transition',
        from: currentStateId,
        to: transition.to,
        input,
        timestamp: time++
      });

      currentStateId = transition.to;

      steps.push({
        type: 'stateEnter',
        to: currentStateId,
        timestamp: time++
      });

      if (this.mode === 'moore') {
        const output = this.fsm.mooreOutputs[currentStateId];
        if (output) {
          steps.push({
            type: 'output',
            from: currentStateId,
            output,
            timestamp: time++
          });
        }
      }
    }

    return steps;
  }
}
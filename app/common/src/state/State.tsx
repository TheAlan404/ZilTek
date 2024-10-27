import { createData, Data } from "../data/Data";
import { Time } from "../Time";
import { AudioState, createAudioState } from "./AudioState";
import { TimeState } from "./TimeState";
import { Warning } from "./Warning";

export interface State {
    audioState: AudioState;
    data: Data;
    timeStates: Partial<Record<Time, TimeState>>;
    warnings: Partial<Record<Warning, boolean>>;
}

export const createState = (): State => ({
    audioState: createAudioState(),
    data: createData(),
    timeStates: {},
    warnings: {},
});

export const validateState = (s: any): s is State => (false);

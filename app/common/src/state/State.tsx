import { createData, Data } from "../data/Data";
import { Time } from "../Time";
import { AudioState, createAudioState } from "./AudioState";
import { TimeState } from "./TimeState";

export interface State {
    audioState: AudioState;
    data: Data;
    timeStates: Partial<Record<Time, TimeState>>;
}

export const createState = (): State => ({
    audioState: createAudioState(),
    data: createData(),
    timeStates: {},
});

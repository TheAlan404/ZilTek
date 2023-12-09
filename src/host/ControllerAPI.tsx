import React from "react";
import { Timetable } from "../lib/timetable";

const DefaultData: ControllerData = {
    melodies: [],
    timetables: [],
};

export type LogType =
    | "AUDIO_PLAY_FAILED";
export type Log = {
    date: Date,
    type: LogType,
    message: string,
}

export type CommandsList = {
    changeBellStatus: { on: boolean },
    playCustomAudio: { filename: string },

}

type Wrapper = {
    [C in keyof CommandsList]: { type: C, data: CommandsList[C] }
};
export type Command = Wrapper[keyof Wrapper];

export type TimetableDay = {
    isFullOverride: boolean,
    data: Timetable,
};

export type ScheduleData = {
    type: "timetable",
    tables: {
        default: Timetable,
        days: TimetableDay[],
    },
    melodies: {
        default: MelodyData[],
        overrides: {
            x: number,
            y: number,
            melody: MelodyData,
        }[],
    },
} | {
    type: "zones",
    // TODO
};

export type MelodyData = {
    filename: string,
    offset: number,
    length: number,
};

export type ControllerData = {
    schedule: ScheduleData,
};

export type StoredFile = {
    filename: string,
    data: ArrayBuffer,
}

export interface StoredFileHandlers {
    getFile(filename: string): Promise<StoredFile | null>;
    getAllFiles(): Promise<StoredFile[]>;
    addFile(file: StoredFile): Promise<void>;
    renameFile(from: string, to: string): Promise<void>;
    removeFile(filename: string): Promise<void>;
}

export interface Controller {
    processCommand: (cmd: Command) => void,
    data: ControllerData,
    audioState: AudioState,
    fileHandlers: StoredFileHandlers,
    isOn: boolean,
    setOn: (b: boolean) => void,
    hostMode: HostMode,
}

export type AudioState = "idle" | "playing" | "off";
export type HostMode = "local" | "remote";

const ControllerAPI = React.createContext<Controller>();

export {
    ControllerAPI,
    DefaultData,
}

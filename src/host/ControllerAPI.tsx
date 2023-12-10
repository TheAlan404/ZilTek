import React from "react";
import { Timetable } from "../lib/timetable";

export const DefaultMelody: MelodyData = {
    filename: "",
};

export const DefaultTimetable: Timetable = [];
export const DefaultTimetableDay: TimetableDay = {
    data: DefaultTimetable,
    isFullOverride: true,
};

export const DefaultData: ControllerData = {
    schedule: {
        type: "timetable",
        melodies: {
            default: [
                DefaultMelody,
                DefaultMelody,
                DefaultMelody,
            ],
            overrides: [],
        },
        tables: {
            default: [],
            days: [],
        },
    },
    quickMelodies: [],
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
    stopAllAudio: void,
    forcePlayMelody: { index: number },
    forcePlayAudio: { filename: string },

    setMainTimetable: Timetable,
    setTimetableDay: {
        tableIndex: number,
        tableData: Timetable,
    },

    addQuickMelody: void,
    setQuickMelody: { index: number, filename: string },
    removeQuickMelody: { index: number },

    setDefaultMelody: { index: number, filename: string },
}

export type CommandRunnerList = {
    [C in keyof CommandsList]: (data: CommandsList[C]) => void
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
};

export type BellType = "students" | "teachers" | "classEnd";

export type ControllerData = {
    schedule: ScheduleData,
    quickMelodies: MelodyData[],
};

export type StoredFile = {
    filename: string,
    data: ArrayBuffer,
    offset: number,
    length: number,
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
    currentlyPlayingAudio: string | null,
    isOn: boolean,
    setOn: (b: boolean) => void,
    hostMode: HostMode,

    fileHandlers: StoredFileHandlers,
}

export type AudioState = "idle" | "playing" | "off";
export type HostMode = "local" | "remote";

export const ControllerAPI = React.createContext<Controller>();


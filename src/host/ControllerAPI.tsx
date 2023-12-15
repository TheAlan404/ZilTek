import React from "react";
import { Entry, Timetable } from "../lib/timetable";
import { v4 } from "uuid";

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
    authenticatedRemotes: [],
    hostId: v4(),
    hostKey: v4(),
};

export type Log = {
    type: "BELL_PLAYED" | "BELL_STOPPED" | "BELL_SUSPENDED" | "PLAY_FAILED",
    data: [number, number, Entry],
}

export type CommandsList = {
    changeBellStatus: { on: boolean },
    stopAllAudio: void,
    forcePlayMelody: { index: number },
    forcePlayAudio: { filename: string },
    playBellAudio: { x: number, y: number, bell: Entry },

    setMainTimetable: Timetable,
    setTimetableDay: {
        tableIndex: number,
        tableData: Timetable,
    },

    addQuickMelody: void,
    setQuickMelody: { index: number, filename: string },
    removeQuickMelody: { index: number },
    
    setDefaultMelody: { index: number, filename: string },

    clearAllData: void,
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
    quickMelodies: string[],
    hostId: string,
    hostKey: string,
    authenticatedRemotes: string[],
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
    currentlyPlayingBell: [number, number, Entry] | null,
    isOn: boolean,
    setOn: (b: boolean) => void,
    hostMode: HostMode,
    renderedSchedule: Timetable | null,
    fileHandlers: StoredFileHandlers,
    logs: Log[],
    remoteControlEnabled: boolean | null,
    setRemoteControlEnabled: (v: boolean) => void | null,
    exit: () => void,
}

export type AudioState = "idle" | "playing" | "off";
export type HostMode = "local" | "remote";

export const ControllerAPI = React.createContext<Controller>();


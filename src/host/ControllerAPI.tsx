import React from "react";
import { Entry, Timetable } from "../lib/timetable";
import { v4 } from "uuid";

export const DefaultMelody: MelodyData = {
    filename: "",
};

export const DefaultTimetable: Timetable = [];
export const DefaultTimetableDay: TimetableDay = {
    data: DefaultTimetable,
    isFullOverride: false,
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
            days: [
                DefaultTimetableDay,
                DefaultTimetableDay,
                DefaultTimetableDay,
                DefaultTimetableDay,
                DefaultTimetableDay,
                DefaultTimetableDay,
                DefaultTimetableDay,
            ],
        },
    },
    quickMelodies: [],
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
    toggleTimetableFullOverride: {
        tableIndex: number,
        fullOverride: boolean,
    },

    addQuickMelody: void,
    setQuickMelody: { index: number, filename: string },
    removeQuickMelody: { index: number },
    setDefaultMelody: { index: number, filename: string },

    renameFile: { from: string, to: string },
    deleteFile: { filename: string },
    addFile: { filename: string, filedata: Blob },

    setAllData: { data: ControllerData },
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
        default: string[],
        overrides: {
            x: number,
            y: number,
            melody: string,
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
};

export type StoredFile = {
    filename: string,
    data: ArrayBuffer,
    offset: number,
    length: number,
}

export interface Controller {
    processCommand: (cmd: Command) => void,
    data: ControllerData,
    audioState: AudioState,
    currentlyPlayingAudio: string | null,
    currentlyPlayingBell: [number, number, Entry] | null,
    isOn: boolean,
    hostMode: HostMode,
    renderedSchedule: Timetable | null,
    files: StoredFile[],
    logs: Log[],

    remoteControlEnabled: boolean | null,
    setRemoteControlEnabled: (v: boolean) => void | null,
    isConnected: boolean | null,
    connectedRemotes: string[] | null,
    remoteQueue: { remoteId: string, cb: (accept: boolean) => void }[] | null,

    exit: () => void,
}

export type AudioState = "idle" | "playing" | "off";
export type HostMode = "local" | "remote";

export const ControllerAPI = React.createContext<Controller>();


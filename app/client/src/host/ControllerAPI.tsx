import React from "react";
import { Entry, Timetable } from "../../../common/src/lib/timetable";
import { Enum, createFactory } from "@alan404/enum";
import { Remote } from "./Networking";

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
                "",
                "",
                "",
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






export type MelodyData = {
    filename: string,
};






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
    socketStatus: string,
    connectedRemotes: string[] | null,
    remoteQueue: Remote[] | null,
    authenticatedRemotes: Remote[] | null,
    setAuthenticatedRemotes: (v: Remote[]) => void | null,
    acceptRemote: (remoteId: string) => void,
    denyRemote: (remoteId: string) => void,
    kickRemote: (remoteId: string) => void,

    exit: () => void,
}

export type AudioState = "idle" | "playing" | "off";
export type HostMode = "local" | "remote";

export const ControllerAPI = React.createContext<Controller>();

ControllerAPI.displayName = "ControllerAPI";


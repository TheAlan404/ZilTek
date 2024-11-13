import { Melody } from "../../Melody";
import { Time } from "../../Time";

export type TimetableEntry = {
    value: Time;
    melodyOverride?: Melody;
};

export const createTimetableEntry: () => TimetableEntry = () => ({
    value: Time(0, 0)
});















export type TimeBoxVariant = "idle"
    | "playing"
    | "suspended"
    | "interrupted"
    | "played"
    | "failed";



/*
const eq = (a, b) =>
    (a[0] == b[0])
    && (a[1] == b[1]);

export const getVariant = ({
    table,
    logs,
    currentlyPlayingBell,
    x,
    y,
    entry,
}: {
    table: Timetable,
    logs: Log[],
    currentlyPlayingBell: Entry | null,
    x: number,
    y: number,
    entry: Entry,
}): TimeBoxVariant => {
    let currentTime = TimeFromDate(new Date());

    if (currentlyPlayingBell && eq(currentlyPlayingBell, [x, y, entry])) {
        return "playing";
    }

    let filtered = logs.filter(log => {
        return log.data && eq(log.data, [x, y, entry]);
    });

    if (filtered.some(log => log.type == "BELL_SUSPENDED")) return "suspended";
    if (filtered.some(log => log.type == "BELL_STOPPED")) return "interrupted";
    if (filtered.some(log => log.type == "BELL_PLAYED")) return "played";

    return "idle";
}; */

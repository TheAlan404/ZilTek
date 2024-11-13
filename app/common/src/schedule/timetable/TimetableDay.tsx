import { createTimetable, Timetable } from "./Timetable";

export type TimetableDay = {
    isLayered: boolean;
    enabled: boolean;
    table: Timetable;
};

export const createTimetableDay = (): TimetableDay => ({
    enabled: false,
    isLayered: false,
    table: createTimetable(),
});

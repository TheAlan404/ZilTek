import { createTimetable, Timetable } from "./Timetable";

export type TimetableDay = {
    isFullOverride: boolean;
    enabled: boolean;
    table: Timetable;
};

export const createTimetableDay = (): TimetableDay => ({
    enabled: false,
    isFullOverride: false,
    table: createTimetable(),
});

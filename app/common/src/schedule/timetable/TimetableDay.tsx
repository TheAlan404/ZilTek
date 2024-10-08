import { Timetable } from "./Timetable";

export type TimetableDay = {
    isFullOverride: boolean;
    enabled: boolean;
    table: Timetable;
};

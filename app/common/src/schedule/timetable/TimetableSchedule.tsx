import { createMelody, Melody } from "../../Melody";
import { BellType } from "./BellType";
import { createTimetable, Timetable } from "./Timetable";
import { TimetableDay } from "./TimetableDay";

export const createTimetableSchedule = (): TimetableSchedule => ({
    tables: {
        default: createTimetable(),
        days: [],
    },
    melodies: {
        default: {
            teachers: createMelody(),
            classEnd: createMelody(),
            students: createMelody(),
        },
    },
});

export type TimetableSchedule = {
    tables: {
        default: Timetable;
        days: TimetableDay[];
    };
    melodies: {
        default: Record<BellType, Melody>;
    };
};

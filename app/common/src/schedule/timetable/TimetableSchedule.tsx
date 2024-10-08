import { Melody } from "../../Melody";
import { BellType } from "./BellType";
import { Timetable } from "./Timetable";
import { TimetableDay } from "./TimetableDay";

export type TimetableSchedule = {
    tables: {
        default: Timetable;
        days: TimetableDay[];
    };
    melodies: {
        default: Record<BellType, Melody>;
    };
};

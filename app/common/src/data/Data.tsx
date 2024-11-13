import { Melody, validateMelody } from "../Melody";
import { Schedule } from "../schedule/Schedule";
import { createTimetableSchedule } from "../schedule/timetable/TimetableSchedule";
import { is } from "../util";

export type Data = {
    schedule: Schedule;
    quickMelodies: Melody[];
    ver: 2;
};

export const createData = (): Data => ({
    quickMelodies: [],
    schedule: Schedule.Timetable(createTimetableSchedule()),
    ver: 2,
});

export const validateData = (d: any): d is Data => is.object(d) && (
    is.arrayAnd(d["quickMelodies"], validateMelody)
    && true
);

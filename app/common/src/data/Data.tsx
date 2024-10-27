import { Melody, validateMelody } from "../Melody";
import { Schedule } from "../schedule/Schedule";
import { createTimetableSchedule } from "../schedule/timetable/TimetableSchedule";
import { is } from "../util";

export type Data = {
    schedule: Schedule;
    quickMelodies: Melody[];
};

export const createData = (): Data => ({
    quickMelodies: [],
    schedule: Schedule.Timetable(createTimetableSchedule()),
});

export const validateData = (d: any): d is Data => is.object(d) && (
    is.arrayAnd(d["quickMelodies"], validateMelody)
    && true
);

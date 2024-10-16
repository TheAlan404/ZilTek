import { Melody } from "../Melody";
import { Schedule } from "../schedule/Schedule";
import { createTimetableSchedule } from "../schedule/timetable/TimetableSchedule";

export const createData = (): Data => ({
    quickMelodies: [],
    schedule: Schedule.Timetable(createTimetableSchedule()),
});

export type Data = {
    schedule: Schedule;
    quickMelodies: Melody[];
};

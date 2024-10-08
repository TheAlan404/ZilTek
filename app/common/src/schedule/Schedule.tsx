import { Enum, createFactory } from "@alan404/enum";
import { TimetableSchedule } from "./timetable/TimetableSchedule";
import { ZonesSchedule } from "./zones/Zones";

export const Schedule = createFactory<Schedule>();
export type Schedule = Enum<{
    Timetable: TimetableSchedule;
    Zones: ZonesSchedule;
}>;

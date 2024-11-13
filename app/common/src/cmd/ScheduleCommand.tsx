import { createFactory, Enum } from "@alan404/enum";
import { Schedule } from "../schedule/Schedule";

export const ScheduleCommand = createFactory<ScheduleCommand>();
export type ScheduleCommand = Enum<{
    SetSchedule: Schedule;
}>;

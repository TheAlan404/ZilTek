import { Enum, createFactory, match } from "@alan404/enum";
import { TimetableSchedule } from "./timetable/TimetableSchedule";
import { ZonesSchedule } from "./zones/Zones";
import { Time } from "../Time";
import { Melody } from "../Melody";
import { getTimetableLayers, overlayTimetables } from "./timetable/Timetable";
import { BellType } from "./timetable/BellType";

export const Schedule = createFactory<Schedule>();
export type Schedule = Enum<{
    Timetable: TimetableSchedule;
    Zones: ZonesSchedule;
}>;

export const computeTimings = (
    schedule: Schedule,
    dayOfWeek: number,
) => {
    const times: Partial<Record<Time, Melody>> = {};

    match(schedule)({
        Timetable: (schedule) => {
            const layers = getTimetableLayers(schedule, dayOfWeek);

            for(let row of overlayTimetables(layers)) {
                for(let [y, entry] of row.entries()) {
                    let key = (["students", "teachers", "classEnd"] as BellType[])[y];
                    let melody = entry.melodyOverride || schedule.melodies.default[key];
                    times[entry.value] = melody;
                }
            }
        },
        _: () => {},
    });

    return times;
};

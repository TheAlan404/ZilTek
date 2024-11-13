import { TimetableDay } from "./TimetableDay";
import { createTimetableEntry, TimetableEntry } from "./TimetableEntry";
import { TimetableSchedule } from "./TimetableSchedule";

export type TimetableRow = [TimetableEntry, TimetableEntry, TimetableEntry];
export type Timetable = TimetableRow[];

export const createTimetableRow = (): TimetableRow => [
    createTimetableEntry(),
    createTimetableEntry(),
    createTimetableEntry()
];

export const createTimetable = (): Timetable => [];

const isNil = (entry: TimetableEntry) => !entry || !entry.value || entry.value == "00:00";

export const getTimetableLayers = (schedule: TimetableSchedule, dayOfWeek: number) => {
    let layers: Timetable[] = [];

    let day: TimetableDay | undefined = schedule.tables.days[dayOfWeek];
    if(!day || day?.isLayered) layers.push(schedule.tables.default);
    if(day && day.enabled) layers.push(day.table);

    return layers;
};

export const overlayTimetables = (layers: Timetable[]): Timetable => {
    let table: Timetable = [];

    for (const layer of layers) {
        for (let tupleIndex = 0; tupleIndex < layer.length; tupleIndex++) {
            const tuple = layer[tupleIndex];
            
            if (!table[tupleIndex])
                table[tupleIndex] = createTimetableRow();

            if(!isNil(tuple[0])) table[tupleIndex][0] = tuple[0];
            if(!isNil(tuple[1])) table[tupleIndex][1] = tuple[1];
            if(!isNil(tuple[2])) table[tupleIndex][2] = tuple[2];
        }
    }

    return table;
}

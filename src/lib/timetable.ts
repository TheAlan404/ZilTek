import { Time } from "./time";

export const createTimetable = () => {

};

export type TimeBoxVariant = "idle" | "playing" | "suspended";
export const DefaultEntry: Entry = {
    value: Time(0, 0),
    variant: "idle",
};
export type Entry = {
    value: string,
    variant: TimeBoxVariant,
};
export const DefaultTuple: Tuple = [DefaultEntry, DefaultEntry, DefaultEntry];
export type Tuple = [Entry, Entry, Entry];
export type Timetable = Tuple[];

const isNil = (entry: Entry) => !entry.value || entry.value == "00:00";

export const constructTable = (layers: Timetable[]): Timetable => {
    let table: Timetable = [];

    for (const layer of layers) {
        for (let tupleIndex = 0; tupleIndex < layer.length; tupleIndex++) {
            const tuple = layer[tupleIndex];
            
            if (!table[tupleIndex])
                table[tupleIndex] = DefaultTuple;

            if(!isNil(tuple[0])) table[tupleIndex][0] = tuple[0];
            if(!isNil(tuple[1])) table[tupleIndex][1] = tuple[1];
            if(!isNil(tuple[2])) table[tupleIndex][2] = tuple[2];
        }
    }

    return table;
}

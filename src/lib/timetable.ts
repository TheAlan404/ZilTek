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

export const constructTable = (layers: Timetable[]): Timetable => {
    let table: Timetable = [];

    for (const layer of layers) {
        for (let tupleIndex = 0; tupleIndex < layer.length; tupleIndex++) {
            const tuple = layer[tupleIndex];
            
            if (!table[tupleIndex])
                table[tupleIndex] = DefaultTuple;

            
        }
    }
}

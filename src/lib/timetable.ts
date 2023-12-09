export const createTimetable = () => {

};


export type TimeBoxVariant = "idle" | "playing" | "suspended";
export type Entry = {
    value: Date,
    variant: TimeBoxVariant,
};
export type Tuple = [Entry, Entry, Entry];
export type Timetable = Tuple[];

export const constructTable = (layers: Timetable[]): Timetable => {
    let table: Timetable = [];

    for (const layer of layers) {
        for (let tupleIndex = 0; tupleIndex < layer.length; tupleIndex++) {
            const tuple = layer[tupleIndex];
            
            if (!table[tupleIndex])
                table[tupleIndex] = 
        }
    }
}

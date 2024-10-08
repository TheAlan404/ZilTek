import { createFactory, Enum, match } from "@alan404/enum";

export const ListAction = <T>() => createFactory<ListAction<T>>();
export type ListAction<T> = Enum<{
    Add: T;
    Prepend: T;
    Remove: number;
    Modify: { index: number; value: T };
    Set: T[];
}>;

export const modifyList = <T>(list: T[], action: ListAction<T>): T[] => {
    return match<ListAction<T>, T[]>(action)({
        Add: (v) => [...list, v],
        Prepend: (v) => [v, ...list],
        Modify: ({ index, value }) => list.map((prev, i) => (
            i === index ? value : prev
        )),
        Remove: (index) => list.filter((_, i) => i !== index),
        Set: (v) => v,
    });
};

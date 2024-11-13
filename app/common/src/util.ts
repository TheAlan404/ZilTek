export const is = {
    object: (x: any): x is Record<string, any> => typeof x == "object",
    string: (x: any): x is string => typeof x == "string",
    optString: (x: any): x is string | undefined => is.undef(x) || is.string(x),
    optNumber: (x: any): x is number | undefined => is.undef(x) || is.number(x),
    number: (x: any): x is number => typeof x == "number",
    undef: (x: any): x is undefined => typeof x == "undefined",
    oneOf: <T>(values: T[]) => (x: any): x is T[keyof T] => values.includes(x),
    array: (x: any): x is Array<any> => Array.isArray(x),
    arrayAnd: <T>(x: any, fn: ((v: any) => v is T)): x is T[] => is.array(x) && x.every(fn),
};

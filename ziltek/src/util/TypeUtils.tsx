type GetStringCode<S> =
    string extends S ? "" :
    S extends '' ? "" :
    S extends `${"en" | "tr"}_${infer U}` ? U : "";

export type GetUnprefixedKeys<O extends Record<string, string>> = keyof { [P in keyof O as GetStringCode<P>]: P };

export type ExtractStringValue<
    O extends Record<string, string>,
    I extends string
> = O[`en_${I}`];

type ExtractDollarSign<S extends string> = S extends `${infer before}$${infer N extends number}${infer after}` ? [number, ...ExtractDollarSign<after>]  : [];

export type ExtractStringArgs<
    O extends Record<string, string>,
    I extends string
> = ExtractDollarSign<ExtractStringValue<O, I>>;
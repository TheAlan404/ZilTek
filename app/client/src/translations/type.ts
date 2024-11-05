import en from "./en";

type Mapper<T extends object> = Partial<{
    [P in keyof T]: T[P] extends object ? Mapper<T[P]> : string;
}>;

export type LanguageResource = Mapper<typeof en>;


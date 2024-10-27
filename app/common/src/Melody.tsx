import { is } from "./util";

export type Melody = {
    filename: string;
    startTime?: number;
    endTime?: number;
};

export const createMelody = (): Melody => ({ filename: "default.mp3" });

export const validateMelody = (m: any): m is Melody => is.object(m) && is.string(m["filename"]) && (
    is.optNumber(m["startTime"])
    && is.optNumber(m["endTime"])
);

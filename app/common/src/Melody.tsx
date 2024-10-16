export const createMelody = (): Melody => ({ filename: "default.mp3" });

export type Melody = {
    filename: string;
    startTime?: number;
    endTime?: number;
};

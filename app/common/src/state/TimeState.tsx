export type TimeState = "playing" | "played" | "muted" | "failed" | "stopped";

export const validateTimeState = (s: any): s is TimeState => typeof s == "string" && (
    ((["playing", "played", "muted", "failed", "stopped"] as TimeState[]) as string[]).includes(s)
);

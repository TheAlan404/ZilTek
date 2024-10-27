export type AudioState = {
    isPlaying: boolean;
    currentlyPlaying?: string;
    muted: boolean;
};

export const createAudioState = (): AudioState => ({
    isPlaying: false,
    muted: false,
});

export const validateAudioState = (s: any): s is AudioState => typeof s == "object" && (
    typeof s["isPlaying"] == "boolean"
    && (typeof s["currentlyPlaying"] == "undefined" || typeof s["currentlyPlaying"] == "string")
    && typeof s["muted"] == "boolean"
);

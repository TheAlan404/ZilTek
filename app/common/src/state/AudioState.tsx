export type AudioState = {
    isPlaying: boolean;
    currentlyPlaying?: string;
    muted: boolean;
};

export const createAudioState = (): AudioState => ({
    isPlaying: false,
    muted: false,
});

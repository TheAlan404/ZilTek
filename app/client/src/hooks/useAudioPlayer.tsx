import { AudioState } from "@ziltek/common/src/state/AudioState";
import { useEffect, useRef, useState } from "react";

export type Playback = {
    source: string;
    label: string;
    startTime?: number;
    endTime?: number;
    onSuccess?: () => void;
    onFail?: () => void;
    onCancel?: () => void;
};

export const useAudioPlayer = () => {
    const [playback, setPlayback] = useState<Playback | null>(null);
    const [muted, setMuted] = useState<AudioState["muted"]>(false);
    const [progress, setProgress] = useState(0);

    const audioRef = useRef<HTMLAudioElement>(new Audio());

    useEffect(() => {
        if(!playback) return;

        if(audioRef.current.muted) {
            playback.onCancel?.();
            return;
        }

        const startTime = playback.startTime || 0;
        const endTime = playback.endTime || Infinity;

        audioRef.current.src = playback.source;
        audioRef.current.currentTime = startTime;
        
        const onUpdate = () => {
            const playbackDuration = (playback.endTime || audioRef.current.duration) - startTime;
            setProgress((audioRef.current.currentTime - startTime) / playbackDuration);

            if(
                (audioRef.current.currentTime > endTime)
                || audioRef.current.ended
            ) {
                audioRef.current.pause();
                playback.onSuccess?.();
                setPlayback(null);
            }
        };

        const onError = () => {
            playback.onFail?.();
            setPlayback(null);
        };

        audioRef.current.addEventListener("timeupdate", onUpdate);
        audioRef.current.addEventListener("ended", onUpdate);

        audioRef.current.play().catch(onError);

        return () => {
            audioRef.current.removeEventListener("timeupdate", onUpdate);
            audioRef.current.removeEventListener("ended", onUpdate);
            audioRef.current.pause();
        };
    }, [playback]);

    useEffect(() => {
        audioRef.current.muted = muted;
    }, [muted]);

    const play = (pb: Playback) => {
        if(playback) playback.onCancel?.();
        setPlayback(pb);
    };

    const stop = () => {
        if(playback) playback.onCancel?.();
        setPlayback(null);
        audioRef.current.pause();
    };

    return {
        audioState: {
            muted,
            isPlaying: !!playback,
            currentlyPlaying: playback?.label,
            progress: !!playback ? progress : undefined,
        } as AudioState,
        setMuted,
        play,
        stop,
        audioRef,
    };
};


import { Time } from "@ziltek/common/src/Time";

export const getDuration = (data: ArrayBuffer, filename?: string): Promise<number> => new Promise((res) => {
    const audio = new Audio();
    const source = URL.createObjectURL(new File([data], filename));
    audio.onloadedmetadata = () => {
        if (audio.duration === Infinity) {
            audio.currentTime = Number.MAX_SAFE_INTEGER;
            let temp = () => {
                audio.removeEventListener("timeupdate", temp);
                res(Math.round(audio.duration));
            };
            audio.addEventListener("timeupdate", temp);
        } else {
            res(Math.round(audio.duration));
        }

        // cleanup
        URL.revokeObjectURL(source);
    };
    audio.src = source;
});

export const secondsPretty = (v: number) => {
    if(!v) v = 0;
    let s = Math.floor(v % 60);
    let m = Math.floor(v / 60);

    return [m.toString(), s.toString().padStart(2, "0")]
        .join(":");
};

export const secondsToTime = (v: number) => {
    if(!v) v = 0;
    let s = Math.floor(v % 60);
    let m = Math.floor(v / 60);
    
    return Time(m, s);
};

export const timeToSeconds = (t: Time) => {
    let [m, s] = t.split(":").map(Number);
    return (m * 60) + s;
};

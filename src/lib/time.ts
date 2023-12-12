export const Time = (h, m) => {
    if (h instanceof Date) return Time(h.getHours(), h.getMinutes());
    
    if (typeof h == "undefined") {
        h = 0;
        m = 0;
    }

    if(typeof h == "string" && !m) {
        let s = h.trim().split(":");
        h = s[0];
        m = s[1];
    }

    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export const TimeToDate = (s) => {
    let [h, m] = s.split(":").map(Number);
    return new Date(0, 0, 0, h, m, 0, 0);
};

export const AddTime = (time: string, mins: number) => {
    let date = TimeToDate(time);
    console.log("at", date);
    date.setTime(date.getTime() + mins * 60 * 1000);
    return Time(date);
}
export const SubtractTime = (time: string, mins: number) => {
    let date = TimeToDate(time);
    date.setTime(date.getTime() - mins * 60 * 1000);
    return Time(date);
}

export const TimeRegex = /([01]?[0-9]|2[0-3]):[0-5][0-9]/;

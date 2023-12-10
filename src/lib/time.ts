export const Time = (h, m) => {
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

export const TimeRegex = /([01]?[0-9]|2[0-3]):[0-5][0-9]/;

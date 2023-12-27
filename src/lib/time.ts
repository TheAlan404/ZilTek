import { Timetable } from "./timetable";

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

const eq = (a, b) => 
    (a[0] == b[0])
    && (a[1] == b[1]);

export const getVariant = ({
    table,
    logs,
    currentlyPlayingBell,
    x,
    y,
    entry,
}: {
    table: Timetable,
    logs: Log[],
    currentlyPlayingBell: Entry | null,
    x: number,
    y: number,
    entry: Entry,
}): TimeBoxVariant => {
    let currentTime = Time(new Date());

    if(currentlyPlayingBell && eq(currentlyPlayingBell, [x, y, entry])) {
        return "playing";
    }

    let filtered = logs.filter(log => {
        return log.data && eq(log.data, [x, y, entry]);
    });

    if(filtered.some(log => log.type == "BELL_SUSPENDED")) return "suspended";
    if(filtered.some(log => log.type == "BELL_STOPPED")) return "interrupted";
    if(filtered.some(log => log.type == "BELL_PLAYED")) return "played";

    return "idle";
};

export function formatRelative(lang: string, time) {
    let d = TimeToDate(time);

    let formatter = new Intl.RelativeTimeFormat(lang, );
    let format = automaticRelativeDifference(d);
    return formatter.format(format.duration, format.unit);
}

export function automaticRelativeDifference(d: Date) {
	const nowSec = new Date().getHours()*60*60 + new Date().getMinutes()*60 + new Date().getSeconds();
	const dSec = d.getHours()*60*60 + d.getMinutes()*60 + d.getSeconds();
    const diff = nowSec - dSec;
    let absDiff = Math.abs(diff);
	if (absDiff > 60*60) {
		return { duration: -Math.round(diff/3600), unit: 'hours' };
	}
	if (absDiff > 60) {
		return { duration: -Math.round(diff/60), unit: 'minutes' };
	}
	return { duration: -diff, unit: 'seconds' };
}

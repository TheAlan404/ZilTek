export type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
export type DoubleDigit = `${Digit}${Digit}`;
export type Time = `${DoubleDigit}:${DoubleDigit}`;
export const TimeRegex = /([01]?[0-9]|2[0-3]):[0-5][0-9]/;

export const TimeFromDate = (d: Date): Time => (
    Time(d.getHours(), d.getMinutes())
);

export const Time = (h: number, m: number): Time => (
    `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}` as Time
);

export const TimeUtil = {
    validate: (s: any): s is Time => typeof s === "string" && s.length == 5 && TimeRegex.test(s),

    now: () => TimeUtil.fromDate(new Date()),

    toDate: (s: Time) => new Date(0, 0, 0, ...s.split(":").map(Number), 0, 0),
    fromDate: (d: Date) => Time(d.getHours(), d.getMinutes()),

    toMins: (s: Time) => Number(s.split(":")[0])*60 + Number(s.split(":")[1]),
    fromMins: (mins: number) => Time(Math.floor(mins/60), mins%60),
    
    add: (t: Time, minutes: number) => TimeUtil.fromDate(
        new Date(TimeUtil.toDate(t).getTime() + minutes * 60 * 1000)
    ),
    
    relativeString: (time: Time, locale: string = "en") => {
        let d = TimeUtil.toDate(time);
        let format = automaticRelativeDifference(d);
        return new Intl.RelativeTimeFormat(locale).format(format.duration, format.unit);
    },
};

const automaticRelativeDifference = (d: Date): { duration: number, unit: Intl.RelativeTimeFormatUnit } => {
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

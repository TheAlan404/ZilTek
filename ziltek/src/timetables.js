const DateStringRegex = /\d{2}:\d{2}/;

const newDate = (h, m) => {
    return new Date(0, 0, 0, h, m, 0, 0);
};

/**
 * @param {Date} d 
 * @returns {string}
 */
const dateToString = (d) => {
    return d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0");
};

/**
 * @param {string} s
 * @returns {Date}
 */
const stringToDate = (s) => {
    let [h, m] = s.trim().split(":");
    return newDate(h, m);
};

const NullTuple = () => [newDate(0, 0), newDate(0, 0), newDate(0, 0)];

/**
 * @param {Date} date 
 * @param {Number} m 
 * @returns {Date}
 */
const addMinutesToDate = (date, m) => {
    return newDate(date.getHours(), date.getMinutes() + m);
};

const subtractMinutesToDate = (date, m) => {
    return newDate(date.getHours(), date.getMinutes() - m);
};

/**
 * @global
 * @typedef {[Date, Date, Date][]} Timetable
 */

/**
 * @memberof ZilTek
 * @typedef {object} TimetableGenSegment
 * @prop {"startTime"|"offset"} type
 * @prop {Date} startTime
 * @prop {Number} offset
 * 
 * @prop {Number} classCount
 * @prop {Number} classDuration
 * @prop {Number} breakDuration
 * @prop {Number} studentBellOffset
 */

/**
 * Generates a timetable
 * @param {TimetableGenSegment[]} segments 
 */
const generateTimetable = (segments = []) => {
    let table = [];
    let _time = newDate(0, 0);
    segments.forEach(segment => {
        if (segment.type == "startTime")
            _time = segment.startTime;
        else if (segment.type == "offset")
            _time = addMinutesToDate(_time, segment.offset);

        for (let i = 0; i < segment.classCount; i++) {
            let tuple = [];
            if (segment.studentBellOffset) {
                tuple.push(subtractMinutesToDate(_time, segment.studentBellOffset));
            } else {
                tuple.push(newDate(0, 0));
            }
            tuple.push(_time);
            _time = addMinutesToDate(_time, segment.classDuration);
            tuple.push(_time);
            if (i < segment.classCount - 1) {
                _time = addMinutesToDate(_time, segment.breakDuration);
            };

            table.push(tuple);
        }
    });

    return table;
};

const mergeTimetables = (main, overrideTable) => {
    let table = [];
    for (let i = 0; i < Math.max(main.length, overrideTable.length); i++) {
        let tuple = main[i] || NullTuple();
        let overrideTuple = overrideTable[i] || NullTuple();

        table.push([
            dateOr(overrideTuple[0], tuple[0]),
            dateOr(overrideTuple[1], tuple[1]),
            dateOr(overrideTuple[2], tuple[2]),
        ]);
    };

    return table;
};

const dateOr = (a, b) => isNullDate(a) ? b : a;
const isNullDate = (d) => d.getHours() == 0 && d.getMinutes() == 0;

export {
    newDate,
    dateToString,
    stringToDate,
    addMinutesToDate,
    subtractMinutesToDate,
    generateTimetable,
    mergeTimetables,
    NullTuple,
    DateStringRegex,
    dateOr,
    isNullDate,
};
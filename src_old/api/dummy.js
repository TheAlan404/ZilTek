import { generateTimetable, newDate } from "./timetables";

const DummyTimetable1 = [
    [newDate(10, 0), newDate(10, 20), newDate(10, 40)],
    [newDate(10, 50), newDate(11, 0), newDate(11, 20)],
    [newDate(11, 30), newDate(11, 40), newDate(12, 0)],
];

const DummyTimetable2 = generateTimetable([
    {
        startTime: newDate(8, 50),
        classCount: 5,
        classDuration: 40,
        breakDuration: 10,
        studentBellOffset: 2,
    },
    {
        offset: 40,
        classCount: 3,
        classDuration: 40,
        breakDuration: 10,
        studentBellOffset: 2,
    },
]);

export {
    DummyTimetable1,
    DummyTimetable2,
};
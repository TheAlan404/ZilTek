import { mergeTimetables, NullTuple } from "./timetables";

class Controller {
    constructor() {
        this.timetables = {
            /** @type {import("./timetables").Timetable} */
            main: [],
            /** @type {import("./timetables").Timetable[]} */
            overrides: [], // 0 - Sunday, 1 - Monday, ...
        };
    };

    getTimetableToday() {
        let { main } = this.timetables;
        let override = this.timetables.overrides[this.getWeekday()] || [];

        return mergeTimetables(main, override);
    };

    getWeekday() {
        return new Date().getDay();
    };
};

export default new Controller();
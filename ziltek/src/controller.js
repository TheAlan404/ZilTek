import { mergeTimetables, newDate, NullTuple } from "./timetables";

class Controller {
    constructor() {
        this.timetables = {
            /** @type {import("./timetables").Timetable} */
            main: [],
            /** @type {import("./timetables").Timetable[]} */
            overrides: [], // 0 - Sunday, 1 - Monday, ...
        };

        this.melodies = {
            // string[3]
            main: [
                "example.mp3",
                "example.mp3",
                "example.mp3",
            ],
            // not yet lmao no ----------string[][][3]
            overrides: [],
        };

        this.shouldPlay = true;
        this.lastPlayedTime = newDate(0, 0);
    };

    setupInterval() {
        if (this.interval) {
            clearInterval(this.interval);
        };

        setTimeout(() => {
            this.interval = setInterval(() => this.executeBell(), 1000);
        }, 1000 - (new Date()).getMilliseconds());
    }

    executeBell() {
        let { shouldPlay, index } = this.findBell();
        if(!shouldPlay) return;
        let [i, tupleIndex] = index;


    }

    findBell() {
        let currentTime = new Date();
        let h = currentTime.getHours();
        let m = currentTime.getHours();
        let timetable = this.getTimetableToday();

        for (let i = 0; i < timetable.length; i++) {
            for (let tupleIndex = 0; tupleIndex < timetable[i].length; tupleIndex++) {
                let bell = timetable[i][tupleIndex];
                let bellHour = bell.getHours();
                let bellMin = bell.getMinutes();
                if (h === bellHour && m === bellMin) {
                    return {
                        shouldPlay: true,
                        index: [i, tupleIndex],
                    };
                }
            }
        }
        return { shouldPlay: false, index: [-1, -1] };
    }

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
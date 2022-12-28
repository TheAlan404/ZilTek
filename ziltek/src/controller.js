import fileStorage from "./fileStorage";
import { dateToString, mergeTimetables, newDate, NullTuple } from "./timetables";
import { showNotification } from "@mantine/notifications";
import s from "./lang";

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

        /** @type {HTMLAudioElement} */
        this.audio = new Audio();
        this.events = {
            playing: () => {},
            stopped: () => {},
        };
    };

    loadData() {
        let rawjson = localStorage.getItem("ziltekdata");
        if(rawjson === null) {
            this.saveData();
            showNotification({
                message: s("welcome"),
            });
            return;
        };

        let json;
        try {
            json = JSON.parse(rawjson);
        } catch(e) {
            //
            showNotification({
                title: s("error"),
                message: s("err_datacorrupt"),
                autoClose: false,
                color: "red",
            });
            return;
        };

        if(json.ver === 0) {
            this.timetables = json.timetables;
            this.melodies = json.melodies;
        } else {
            showNotification({
                title: s("error"),
                message: "Invalid json version: " + json.ver,
                color: "red",
                autoClose: false,
            });
        }

        showNotification({
            message: s("loaded"),
            autoClose: 1000,
        });
    }
    
    saveData() {
        let raw;

        try {
            raw = JSON.stringify({
                ver: 0,
                timetables: this.timetables,
                melodies: this.melodies,
            }, (k, v) => v instanceof Date ? dateToString(v) : v);
        } catch(e) {
            showNotification({
                title: s("error"),
                message: "JSON stringify save error",
                autoClose: false,
                color: "red",
            });
            return;
        }

        localStorage.setItem("ziltekdata", raw);
    }

    eraseAllData() {
        localStorage.removeItem("ziltekdata");
    }

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

        let filename = this.getMelodyName(i, tupleIndex);
        this.playAudioByName(filename);
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

    getMelodyName(i, tupleIndex) {
        return this.melodies[tupleIndex];
    }

    playAudioByName(filename) {
        let file = fileStorage.getFile(filename);
        if(!file) return;
        this.playAudio(file);
    }

    /**
     * @param {File} file 
     */
    playAudio(file) {
        this.events.playing();
        let url = URL.createObjectURL(file);
        this.audio.onended = () => {
            this.events.stopped();
            URL.revokeObjectURL(url);
        };
        this.audio.src = url;
        this.audio.play();
    }

    stopAudio() {
        this.audio.pause();
        this.audio.onended();
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
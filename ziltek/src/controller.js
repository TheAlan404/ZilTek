import fileStorage from "./fileStorage";
import { DateStringRegex, dateToString, mergeTimetables, newDate, stringToDate } from "./timetables";
import { showNotification } from "@mantine/notifications";
import s from "./lang";
import { IconExclamationMark } from "@tabler/icons";

/**
 * @typedef {object} TimetableOverride
 * @prop {import("./timetables").Timetable} table
 * @prop {boolean | false} fullOverride
 */

class Controller {
    version = "0.5";

    constructor() {
        this.setDefaults();

        this.bellOnline = true;
        this.shouldPlay = true;
        this.lastPlayedTime = newDate(0, 0);

        /** @type {HTMLAudioElement} */
        this.audio = new Audio();
        this.events = {
            playing: () => { },
            stopped: () => { },
            suppressed: [],
            bellStatus: [],
            execUpdate: [],
            update: [],
        };
    };

    setDefaults() {
        this.timetables = {
            /** @type {import("./timetables").Timetable} */
            main: [],
            /** @type {TimetableOverride[]} */
            overrides: [], // 0 - Sunday, 1 - Monday, ...
        };

        this.melodies = {
            // string[3]
            main: [
                "tobecontinued.mp3",
                "tobecontinued.mp3",
                "tobecontinued.mp3",
            ],
            // not yet lmao no ----------string[][][3]
            overrides: [],
        };
    }

    loadData() {
        let rawjson = localStorage.getItem("ziltekdata");
        if (rawjson === null) {
            this.saveData();
            showNotification({
                message: s("welcome"),
            });
            return;
        };

        let json;
        try {
            json = JSON.parse(rawjson, (k, v) =>
                typeof v === "string" && v.length === 5 && DateStringRegex.test(v) ?
                    stringToDate(v)
                    : v);
        } catch (e) {
            showNotification({
                title: s("error"),
                message: s("err_datacorrupt"),
                autoClose: false,
                color: "red",
            });
            return;
        };

        if (json.ver === 0) {
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

        console.log("loaded data", this.timetables, this.melodies);

        showNotification({
            message: s("loaded"),
        });

        this.triggerUpdates("update");
    }

    saveData() {
        let raw;

        let conv = {
            ver: 0,
            timetables: {
                main: this.timetables.main.map(a => a.map(d => dateToString(d))),
                overrides: this.timetables.overrides.map(o => ({
                    fullOverride: o.fullOverride,
                    table: o.table.map(a => a.map(d => dateToString(d))),
                })),
            },
            melodies: this.melodies,
        }

        try {
            raw = JSON.stringify(conv);
        } catch (e) {
            showNotification({
                title: s("error"),
                message: "JSON stringify save error",
                autoClose: false,
                color: "red",
            });
            return;
        }

        console.log("saved data", conv.timetables);

        localStorage.setItem("ziltekdata", raw);
    }

    sub(e, fn) {
        this.events[e].push(fn);
    }

    triggerUpdates(ev = "update", ...a) {
        this.events[ev].forEach(lis => lis(...a));
    }

    setBellStatus(v) {
        this.bellOnline = v;
        if(!v) this.stopAudio();
        this.triggerUpdates("bellStatus");
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
        if (this.lastPlayedTime.getHours() == new Date().getHours()
            && this.lastPlayedTime.getMinutes() == new Date().getMinutes()) {
            return;
        }
        let { shouldPlay, index } = this.findBell();
        if (!shouldPlay) return;
        let [i, tupleIndex] = index;

        this.lastPlayedTime = new Date();
        this.triggerUpdates("execUpdate", { type: "startPlay", index });
        if(!this.bellOnline) {
            this.triggerUpdates("suppressed", { index });
            return;
        };

        let filename = this.getMelodyName(i, tupleIndex);
        this.playAudioByName(filename);
    }

    findBell() {
        let currentTime = new Date();
        let h = currentTime.getHours();
        let m = currentTime.getMinutes();
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
        return this.melodies.main[tupleIndex];
    }

    playAudioByName(filename) {
        let file = fileStorage.getFile(filename);
        if (!file) return;
        this.playAudio(typeof file.file === "string" ? file.file : new Blob([file.file]));
    }

    /**
     * @param {File} file 
     */
    playAudio(file) {
        this.events.playing();
        console.log("playAudio", file);
        let url = typeof file === "string" ? file : URL.createObjectURL(file);
        this.audio.onended = () => {
            this.events.stopped();
            this.triggerUpdates("execUpdate", { type: "endPlay", });
            if (typeof file !== "string") URL.revokeObjectURL(url);
        };
        this.audio.src = url;
        this.audio.play().catch(() => showNotification({
            color: "red",
            title: s("error"),
            message: s("touchWindowPls"),
            autoClose: 15000,
            icon: <IconExclamationMark />,
        }));
    }

    stopAudio() {
        if(!this.audio) return;
        this.audio.pause();
        if(!this.audio.onended) return;
        this.audio.onended();
    }

    getTimetableToday() {
        let { main } = this.timetables;
        return main
        //let override = (this.timetables.overrides[this.getWeekday()] || { table: [] }).table || [];

        //return mergeTimetables(main, override);
    };

    getWeekday() {
        return new Date().getDay();
    };
};

export default new Controller();
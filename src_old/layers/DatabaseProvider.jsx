import React, { useContext, useEffect, useReducer } from 'react'
import { DBContext } from '../contexts/DBContext';
import { useListState } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useImmerReducer } from 'use-immer';
import { useLogger } from './LogsProvider';

const makeDefaults = () => {
    return {
        timetables: {
            /** @type {[Date, Date, Date][]} */
            main: [],
            /** @type {{ fullOverride: boolean, table: [Date, Date, Date][] }[]} */
            overrides: [], // 0 - Sunday, 1 - Monday, ...
        },
        melodies: {
            /** @type {[string, string, string]} */
            main: [
                "tobecontinued.mp3",
                "tobecontinued.mp3",
                "tobecontinued.mp3",
            ],
            /** @type {[string, string, string][][]} */
            overrides: [],
            // the playersing
            /** @type {string[]} */
            custom: [],
        }
    }
}

/**
 * 
 * @param {ReturnType<makeDefaults>} state 
 * @param {{}} action 
 */
const reducer = (state, action) => {
    let actions = {
        save: () => {
            let raw;

            let conv = {
                ver: 0,
                timetables: {
                    main: state.timetables.main.map(a => a.map(d => dateToString(d))),
                    overrides: state.timetables.overrides.map(o => o || ({ fullOverride: false, table: [] })).map(o => ({
                        fullOverride: (o).fullOverride,
                        table: o.table.map(a => a.map(d => dateToString(d))),
                    })),
                },
                melodies: state.melodies,
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
                return makeDefaults();
            }
    
            console.log("saved data");
            localStorage.setItem("ziltekdata", raw);
        },

        load: () => {
            
        },

        setTimetable: ({
            tableId,
            data,
        }) => {
            if (tableId == 0) {
                state.timetables.main = data;
            } else {
                state.timetables.overrides[tableId - 1].table = data;
            }
        },

        setFullOverride: ({
            tableId,
            override,
        }) => {
            if (tableId != 0) {
                state.timetables.overrides[tableId - 1].fullOverride = override;
            }
        },

        clearTimetable: ({
            tableId,
        }) => {
            if (tableId == 0) {
                state.timetables.main = [];
            } else {
                state.timetables.overrides[tableId - 1].table = [];
            }
        },

        setMelodyMain: ({
            id,
            melody,
        }) => {
            state.melodies.main[id] = melody;
        },

        addCustomMelody: ({
            melody,
        }) => {
            state.melodies.custom.push(melody);
        },
    };

    actions[action.type](action);
};

const load = (log) => {
    let state = makeDefaults();

    let rawjson = localStorage.getItem("ziltekdata");
    if (rawjson === null) {
        showNotification({
            message: s("welcome"),
        });
        log("Data was empty, returning defaults");
        return makeDefaults();
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
        log("JSON parse Error: " + e.toString());
        return makeDefaults();
    };

    if (json.ver === 0) {
        state.timetables = json.timetables;
        state.melodies = json.melodies;
        state.melodies.custom ||= [];
    } else {
        showNotification({
            title: s("error"),
            message: "Invalid json version: " + json.ver,
            color: "red",
            autoClose: false,
        });
        log("Invalid json version: " + json.ver);
    }

    showNotification({
        message: s("loaded"),
    });

    log("Database loaded successfully");

    return state;
};

function DatabaseProvider({ children }) {
    const log = useLogger("db", "db");
    const [db, dispatch] = useImmerReducer(reducer, log, load);

	return (
		<DBContext.Provider value={[db, dispatch]}>
			{children}
		</DBContext.Provider>
	);
}

export default DatabaseProvider;

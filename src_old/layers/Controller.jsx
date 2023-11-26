import { Container, Grid, Header, MantineProvider, Text, Space, Group, Button, LoadingOverlay, Loader, Center, Tooltip } from '@mantine/core';
import TimetableGrid from './components/TimetableGrid';
import { DummyTimetable2 } from './api/dummy';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ControllerContext } from './contexts/ControllerContext';
import Layout from './Layout';
import { DBContext } from '../contexts/DBContext';
import { HostContext } from '../contexts/HostContext';
import { useInterval } from '@mantine/hooks';
import { useCallback } from 'react';
import { mergeTimetables } from '../api/timetables';
import { useImmerReducer } from 'use-immer';

let metaReducer = () => {
	
};

function Controller({
	children
}) {
	let { isHost } = useContext(HostContext);
	let [db, dispatch] = useContext(DBContext);

	let [bellOnline, setBellOnline] = useState(true);
	let [today, setToday] = useState(new Date().getDay());

	let [] = useImmerReducer();

	let lastCheck = useRef();

	let timetable = useMemo(() => {
		let { main } = db.timetables;
        if(db.timetables.overrides[today]
			&& db.timetables.overrides[today].table?.length) {
            let override = db.timetables.overrides[wd];
            if(override.fullOverride) {
                return override.table;
            };

            return mergeTimetables(main, override.table);
        } else {
            return main;
        }
	}, [today, db.timetables]);

	let findBell = useCallback(() => {
		let currentTime = new Date();
        let h = currentTime.getHours();
        let m = currentTime.getMinutes();

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
	}, [timetable]);

	let clock = useInterval(() => {
		// stop if checked already
		if (!lastCheck.current) lastCheck.current = new Date(0);
		if (lastCheck.current.getHours() == new Date().getHours()
            && lastCheck.current.getMinutes() == new Date().getMinutes()) {
            return;
        }

		// update today if not correct
		if (today != new Date().getDay()) {
			setToday(new Date().getDay());
		}

		// get bell to play
        let { shouldPlay, index } = findBell();
        if (!shouldPlay) return;
        let [i, tupleIndex] = index;

        lastCheck.current = new Date();
        this.triggerUpdates("execUpdate", { type: "startPlay", index });
        if(!this.bellOnline) {
            this.triggerUpdates("suppressed", { index });
            return;
        };

        let filename = this.getMelodyName(i, tupleIndex);
        this.playAudioByName(filename);
	}, 200);

	useEffect(() => {
		clock.start();
		return clock.stop;
	}, []);

	useEffect(() => {
		if (!isHost) return;


	}, [isHost]);

	return (
		<ControllerContext.Provider value={{
			bellOnline, setBellOnline,
			timetable,
		}}>
			{children}
		</ControllerContext.Provider>
	);
}

export default Controller;

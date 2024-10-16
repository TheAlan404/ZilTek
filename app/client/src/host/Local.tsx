import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useListState, useLocalStorage } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import { IconAlertTriangle } from "@tabler/icons-react";
import { App } from "../app/App.tsx";
import { useCallback } from "react";
import { useIndexedDB } from 'react-indexed-db-hook';
import { NotifyError } from "../utils.tsx";
import { useCustomInterval } from "../hooks/useCustomInterval.tsx";
import { useSocketIO } from "./Networking.tsx";
import { v4 as uuidv4 } from "uuid";
import { DEFAULT_RELAY } from "../meta.tsx";
import { deserialize, serialize } from "./DataFixer.tsx";
import { Controller } from "./ControllerAPI.tsx";
import { NetworkingContext } from "./NetworkingContext.tsx";
import { createData, Data } from "@ziltek/common/src/data/Data.tsx";
import { AudioState } from "@ziltek/common/src/state/AudioState.tsx";
import { useDailyClock } from "../hooks/useClock.tsx";
import { match } from "@alan404/enum";
import { overlayTimetables } from "@ziltek/common/src/schedule/timetable/Timetable.tsx";
import { TimetableDay } from "@ziltek/common/src/schedule/timetable/TimetableDay.tsx";
import { BellType } from "@ziltek/common/src/schedule/timetable/BellType.tsx";
import { Time } from "@ziltek/common/src/Time.tsx";
import { Melody } from "@ziltek/common/src/Melody.tsx";
import { TimeState } from "@ziltek/common/src/state/TimeState.tsx";
import { Command } from "@ziltek/common/src/cmd/Command.tsx";
import { useAudioPlayer } from "../hooks/useAudioPlayer.tsx";

export const LocalHost = () => {
    const { emitter } = useContext(NetworkingContext);
    
    const [data, setData] = useLocalStorage<Data>({
        key: "ziltek-data",
        defaultValue: createData(),
        serialize,
        deserialize,
    });
    
    // -- State --
    
    const [timeStates, setTimeStates] = useState<Partial<Record<Time, TimeState>>>({});
    const setTimeState = (time: Time, state: TimeState) => setTimeStates(prev => ({ ...prev, [time]: state }));

    // -- Audio --
    
    const audio = useAudioPlayer();
    
    // -- Clock --

    const computeTimings = useCallback(({
        data,
        dayOfWeek,
    }: {
        data: Data;
        dayOfWeek: number;
    }) => {
        const times: Partial<Record<Time, Melody>> = {};

        match(data.schedule)({
            Timetable: (schedule) => {
                let layers = [];
                let day: TimetableDay | undefined = schedule.tables.days[dayOfWeek];
                if(!day?.isFullOverride) layers.push(schedule.tables.default);
                if(day && day.enabled) layers.push(day.table);

                for(let row of overlayTimetables(layers)) {
                    for(let [y, entry] of row.entries()) {
                        let key = (["students", "teachers", "classEnd"] as BellType[])[y];
                        let melody = entry.melodyOverride || schedule.melodies.default[key];
                        times[entry.value] = melody;
                    }
                }
            },
            _: () => {},
        });

        return times;
    }, []);
    
    //const previousTiming = useRef<Time | null>(null);
    const computedTimings = useRef(computeTimings({
        dayOfWeek: new Date().getDay(),
        data,
    }));

    useEffect(() => {
        computedTimings.current = computeTimings({
            dayOfWeek: new Date().getDay(),
            data,
        });
    }, [data]);

    useDailyClock({
        onNewDay: (dayOfWeek) => {
            setTimeStates({});
            computedTimings.current = computeTimings({
                dayOfWeek,
                data,
            });
        },

        onTick: (time) => {
            if(!computedTimings.current[time])
                return;

            if(timeStates[time] == "failed"
                || timeStates[time] == "played"
                || timeStates[time] == "playing"
                || timeStates[time] == "stopped"
            ) return;

            if(audio.audioState.muted) {
                setTimeState(time, "muted");
                return;
            }

            processCommand(Command.ForcePlayMelody(computedTimings.current[time]));
            setTimeState(time, "playing");
        },
    });

    const processCommand = (cmd: Command) => {
        match(cmd)({
            ToggleSystemEnabled: (enable) => setMuted(enable),
            Schedule: (a) => {},
            Melody: (a) => {},
            ForcePlayMelody: (a) => {},
            ForceStop: (a) => {},
            Filesystem: (a) => {},
            Maintenance: (sub) => match(sub)({
                ClearAllData: () => setData(createData()),
                SetAllData: (d) => setData(d),
            }),
        });
    };
    
    return (
        <Controller.Provider
            value={{
                audioState: audio.audioState,
                timeStates,
            }}
        >
            {children}
        </Controller.Provider>
    );
}

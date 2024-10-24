import { PropsWithChildren, useContext, useEffect, useRef, useState } from "react";
import { useLocalStorage } from "@mantine/hooks";
import { deserialize, serialize } from "./DataFixer.tsx";
import { Controller } from "./ControllerAPI.tsx";
import { NetworkingContext } from "./NetworkingContext.tsx";
import { createData, Data } from "@ziltek/common/src/data/Data.tsx";
import { useDailyClock } from "../hooks/useClock.tsx";
import { match } from "@alan404/enum";
import { Time } from "@ziltek/common/src/Time.tsx";
import { TimeState } from "@ziltek/common/src/state/TimeState.tsx";
import { Command } from "@ziltek/common/src/cmd/Command.tsx";
import { useAudioPlayer } from "../hooks/useAudioPlayer.tsx";
import { FilesystemContext } from "./fs/FilesystemContext.tsx";
import { applyListAction } from "@ziltek/common/src/ListAction.ts";
import { computeTimings } from "@ziltek/common/src/schedule/Schedule.tsx";
import { State } from "@ziltek/common/src/state/State.tsx";

export const LocalHost = ({ children }: PropsWithChildren) => {
    const fs = useContext(FilesystemContext);
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
    
    const computedTimings = useRef(computeTimings(data.schedule, new Date().getDay()));

    useEffect(() => {
        computedTimings.current = computeTimings(data.schedule, new Date().getDay());
    }, [data]);

    useDailyClock({
        onNewDay: (dayOfWeek) => {
            setTimeStates({});
            computedTimings.current = computeTimings(data.schedule, dayOfWeek);
        },

        onTick: async (time) => {
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

            let melody = computedTimings.current[time];

            let data = await fs.read(melody.filename);

            if(!data) {
                setTimeState(time, "failed");
                return;
            };

            let source = URL.createObjectURL(new File([data], melody.filename));

            setTimeState(time, "playing");
            audio.play({
                source,
                label: melody.filename,
                endTime: melody.endTime,
                startTime: melody.startTime,
                onCancel: () => {
                    setTimeState(time, "stopped");
                },
                onFail: () => {
                    setTimeState(time, "failed");
                },
                onSuccess: () => {
                    setTimeState(time, "played");
                },
            });
        },
    });

    const processCommand = (cmd: Command) => {
        console.log("Executing command", cmd);

        match(cmd)({
            ToggleSystemEnabled: (enable) => audio.setMuted(!enable),
            ForceStop: () => audio.stop(),
            Schedule: (a) => {},
            ForcePlayMelody: async (melody) => {
                let data = await fs.read(melody.filename);
                if(!data) return;
                let source = URL.createObjectURL(new File([data], melody.filename));
                audio.play({
                    source,
                    label: melody.filename,
                    endTime: melody.endTime,
                    startTime: melody.startTime,
                });
            },
            Filesystem: (sub) => match(sub)({
                AddFile: ({ filename, data }) => fs.write(filename, data),
                Delete: (filename) => fs.remove(filename),
                Rename: ({ from, to }) => fs.rename(from, to),
                Refresh: () => fs.refresh(),
            }),
            Melody: (sub) => match(sub)({
                EditQuickMelodies: (act) => setData(d => ({
                    ...d,
                    quickMelodies: applyListAction(d.quickMelodies, act),
                })),
            }),
            Maintenance: (sub) => match(sub)({
                ClearAllData: () => setData(createData()),
                SetAllData: (d) => setData(d),
            }),
        });
    };

    const state: State = {
        audioState: audio.audioState,
        timeStates,
        data,
        warnings: {},
    };

    emitter.emit("UpdateState", state);
    
    return (
        <Controller.Provider
            value={{
                ...state,
                processCommand,
            }}
        >
            {children}
        </Controller.Provider>
    );
}

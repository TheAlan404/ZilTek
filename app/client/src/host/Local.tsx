import { PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocalStorage, useSessionStorage } from "@mantine/hooks";
import { deserialize, serialize } from "./ctx/DataFixer.tsx";
import { Controller } from "./ctx/Controller.tsx";
import { NetworkingContext } from "./ctx/NetworkingContext.tsx";
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
import { useEventListener } from "../hooks/useEvents.tsx";
import { useDebug } from "../hooks/useDebug.tsx";

export const LocalHost = ({ children }: PropsWithChildren) => {
    const fs = useContext(FilesystemContext);
    const { emitter, socket, connectedRemotes, isConnected } = useContext(NetworkingContext);
    
    const { debug } = useDebug();
    
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

    const onTick = useCallback(async (time: Time) => {
        debug("timeStates", `timeStates[time] = ${timeStates[time]}`)

        if(!computedTimings.current[time])
            return debug("clock", `${time}: <no timing>`);

        if(timeStates[time] == "failed"
            || timeStates[time] == "played"
            || timeStates[time] == "playing"
            || timeStates[time] == "stopped"
        ) return debug("clock", `${time}: <early return>`);

        if(audio.audioState.muted) {
            setTimeState(time, "muted");
            debug("clock", `${time}: muted`);
            return;
        }

        let melody = computedTimings.current[time];

        let data = await fs.read(melody.filename);

        if(!data) {
            setTimeState(time, "failed");
            debug("clock", `${time}: failed`);
            return;
        };

        let source = URL.createObjectURL(new File([data], melody.filename));

        setTimeState(time, "playing");
        debug("clock", `${time}: playing`);
        audio.play({
            source,
            label: melody.filename,
            endTime: melody.endTime,
            startTime: melody.startTime,
            onCancel: () => {
                setTimeState(time, "stopped");
                debug("clock", `${time}: stopped`);
            },
            onFail: () => {
                setTimeState(time, "failed");
                debug("clock", `${time}: failed`);
            },
            onSuccess: () => {
                setTimeState(time, "played");
                debug("clock", `${time}: played`);
            },
        });
    }, [timeStates]);

    const onNewDay = useCallback((dayOfWeek: number) => {
        debug("clock", `onNewDay(${dayOfWeek}) called`);
        setTimeStates({});
        computedTimings.current = computeTimings(data.schedule, dayOfWeek);
    }, []);

    useDailyClock({
        onNewDay,
        onTick,
    });

    // -- Commands --

    const processCommand = (cmd: Command) => {
        debug("command", "Command Dispatched:", cmd);

        match(cmd)({
            ToggleSystemEnabled: (enable) => {
                audio.setMuted(!enable);
                if(!enable) audio.stop();
            },
            ForceStop: () => audio.stop(),
            Schedule: (sub) => match(sub)({
                SetSchedule: (schedule) => setData(d => ({
                    ...d,
                    schedule,
                })),
            }),
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

    socket.current?.volatile?.emit?.("UpdateState", state);
    //socket.current?.volatile?.emit?.("SetFilesList", fs.files);
    useEventListener(emitter, "ProcessCommand", (cmd: Command) => {
        processCommand(cmd);
    });
    useEventListener(emitter, "RequestFile", (filename: string, cb: (buffer: ArrayBuffer) => void) => {
        fs.read(filename)
            .then(cb)
            .catch(() => {});
    });
    useEffect(() => {
        socket.current?.volatile?.emit?.("SetFilesList", fs.files);
    }, [connectedRemotes, fs.files, isConnected]);
    
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

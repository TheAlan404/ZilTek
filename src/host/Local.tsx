import React, { useEffect, useMemo, useRef, useState } from "react";
import { ControllerAPI, DefaultData, AudioState, ControllerData, Log, StoredFileHandlers, CommandRunnerList, Command, StoredFile, DefaultTimetableDay, DefaultTimetable } from "./ControllerAPI.tsx";
import { useInterval, useListState, useLocalStorage } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import { IconAlertTriangle } from "@tabler/icons-react";
import { App } from "../app/App.tsx";
import { useCallback } from "react";
import { useIndexedDB } from 'react-indexed-db-hook';
import { NotifyError } from "../utils.tsx";
import { Entry, constructTable } from "../lib/timetable.ts";
import { useCustomInterval } from "../hooks/useCustomInterval.tsx";
import { useSocketIO } from "./Networking.tsx";
import { v4 as uuidv4 } from "uuid";
import { DEFAULT_RELAY } from "../meta.tsx";

const useFileManager = (): StoredFileHandlers => {
    const db = useIndexedDB("files");

    const addFile = (file: StoredFile) => {
        return db.add({
            filename: file.filename,
            data: file.data,
            file: file.data,
        });
    };

    const removeFile = (filename: string) => {
        return db.deleteRecord(filename);
    };

    const renameFile = async (from: string, to: string) => {
        let file = await db.getByID<StoredFile>(from);
        await db.add({
            ...file,
            filename: to,
        });
        await db.deleteRecord(from);
    };

    const getFile = async (filename: string): Promise<StoredFile | null> => {
        return await db.getByID(filename);
    }

    const getAllFiles = async (): Promise<StoredFile[]> => await db.getAll();

    return {
        getFile,
        getAllFiles,
        addFile,
        renameFile,
        removeFile,
    };
}

const LocalHost = ({
    exitLocalMode,
}) => {
    const [t] = useTranslation();
    const [currentDay, setCurrentDay] = useState<number>(new Date().getDay());
    
    let [proxyUrl, setProxyUrl] = useLocalStorage({
        key: "ziltek-proxy-url",
        defaultValue: DEFAULT_RELAY,
    });

    // --- Data ---

    const fileHandlers = useFileManager();
    const [data, setData] = useLocalStorage<ControllerData>({
        key: "ziltek-data",
        defaultValue: DefaultData,
        serialize: JSON.stringify,
        deserialize: JSON.parse,
    });

    // --- Controller ---

    const [isOn, setOn] = useState(true);
    const [audioState, setAudioState] = useState<AudioState>("idle");
    const [currentlyPlayingAudio, setCurrentlyPlayingAudio] = useState<string | null>(null);
    const [currentlyPlayingBell, setCurrentlyPlayingBell] = useState<[number, number, Entry] | null>(null);
    const [logs, logHandlers] = useListState<Log>([]);

    // --- Schedule ---

    const renderedSchedule = useMemo(() => {
        if (data.schedule.type == "timetable") {
            if (data.schedule.tables.days[currentDay]
                && data.schedule.tables.days[currentDay].isFullOverride) {
                return data.schedule.tables.days[currentDay].data;
            }

            return constructTable([
                data.schedule.tables.default,
                ...(data.schedule.tables.days[currentDay] ? (
                    data.schedule.tables.days[currentDay].data || []
                ) : ([]))
            ]);
        } else {
            // TODO
        }
    }, [data, currentDay]);

    useEffect(() => {
        logHandlers.setState([]);
    }, [currentDay]);

    const findBell = ((h, m) => {
        if (data.schedule.type == "timetable") {
            for (let x = 0; x < renderedSchedule.length; x++) {
                for (let y = 0; y < renderedSchedule[x].length; y++) {
                    let bell = renderedSchedule[x][y];
                    let [bH, bM] = bell.value.split(":").map(Number);
                    if (h === bH && m === bM) {
                        return {
                            x,
                            y,
                            bell,
                        };
                    }
                }
            }
        }
    });

    // this state is used to make sure you dont play the same bell every second of the minute
    const [lastPlayedBell, setLastPlayedBell] = useState<Date | null>(null);
    const clock = () => {
        let now = new Date();
        setCurrentDay(now.getDay());
        let h = now.getHours();
        let m = now.getMinutes();
        if (lastPlayedBell
            && lastPlayedBell.getHours() == h
            && lastPlayedBell.getMinutes() == m) {
            return;
        }

        let found = findBell(h, m);
        if (!found) return;
        if (isOn) setCurrentlyPlayingBell([found.x, found.y, found.bell]);
        setLastPlayedBell(now);

        processCommand({
            type: "playBellAudio",
            data: found,
        });
    };
    useCustomInterval(clock, 1000, [data, renderedSchedule, lastPlayedBell]);

    // --- Audio ---

    const audioRef = useRef(new Audio());

    useEffect(() => {
        audioRef.current.onended = () => {
            if (audioRef.current.src) URL.revokeObjectURL(audioRef.current.src);
            audioRef.current.src = "";
            setCurrentlyPlayingBell((v) => {
                if (v) {
                    logHandlers.append({
                        type: "BELL_PLAYED",
                        data: v,
                    });
                }
                return null;
            });
            setCurrentlyPlayingAudio(null);
        };
    }, [audioRef]);

    const playAudio = useCallback((file: StoredFile) => {
        setCurrentlyPlayingAudio(file.filename);
        let url = URL.createObjectURL(file.data);
        audioRef.current.src = url;
        audioRef.current.play().catch(e => {
            NotifyError(e);
            logHandlers.append({
                date: new Date(),
                type: "PLAY_FAILED",
                message: t("audio.playfailed"),
            });
            notifications.show({
                message: t("audio.playfailed"),
                title: t("error"),
                icon: <IconAlertTriangle />,
            });
        });
    }, []);

    useEffect(() => {
        if (isOn) {
            setAudioState(audioRef.current.paused ? "idle" : "playing");
        } else {
            setAudioState("off");
        }
    }, [audioRef.current.paused, isOn]);

    // --- Commands ---

    const commands: CommandRunnerList = {
        changeBellStatus: ({ on }) => {
            setOn(on);
            setCurrentlyPlayingBell((v) => {
                if (v) {
                    logHandlers.append({
                        type: "BELL_STOPPED",
                        data: v,
                    });
                }
                return null;
            });
        },

        stopAllAudio() {
            if(audioState == "playing" && currentlyPlayingBell) {
                logHandlers.append({
                    type: "BELL_STOPPED",
                    data: currentlyPlayingBell,
                });
            }
            audioRef.current.pause();
            audioRef.current.onended?.();
        },

        forcePlayAudio({ filename }) {
            if(!filename) return NotifyError("No filename provided to forcePlayAudio");
            fileHandlers.getFile(filename)
                .then(file => {
                    if (!file) return NotifyError(`File "${filename}" not found. (forcePlayAudio)`);

                    playAudio(file);
                }, NotifyError);
        },

        forcePlayMelody({ index }) {
            this.forcePlayAudio({
                filename: data.schedule.type == "timetable"
                && data.schedule.melodies.default[index].filename
            });
        },

        playBellAudio({ x, y = 0, bell, }) {
            // TODO melody overrides etc
            if (!isOn || audioState == "off") {
                logHandlers.append({
                    type: "BELL_SUSPENDED",
                    data: [x, y, bell],
                });
                return;
            };

            if (audioState == "playing") {
                // TODO log
                return;
            };

            this.forcePlayMelody({ index: y });
        },

        addQuickMelody: () => {
            setData((d) => ({
                ...d,
                quickMelodies: [
                    ...d.quickMelodies,
                    "",
                ]
            }))
        },
        removeQuickMelody({ index }) {
            setData((d) => ({
                ...d,
                quickMelodies: d.quickMelodies.filter(
                    (_, i) => i !== index
                ),
            }))
        },
        setQuickMelody({ filename, index }) {
            setData((d) => ({
                ...d,
                quickMelodies: d.quickMelodies.map(
                    (m, i) => i == index ? filename : m
                ),
            }))
        },
        setDefaultMelody({ index, filename }) {
            setData((d) => ({
                ...d,
                schedule: {
                    ...d.schedule,
                    melodies: {
                        ...d.schedule.melodies,
                        default: d.schedule.melodies.default.map((m, i) => i === index ? filename : m),
                    }
                }
            }))
        },
        setMainTimetable(data) {
            setData((d) => ({
                ...d,
                schedule: {
                    ...d.schedule,
                    tables: {
                        ...d.schedule.tables,
                        default: data,
                    }
                }
            }))
        },
        setTimetableDay({ tableIndex, tableData }) {
            setData((d) => ({
                ...d,
                schedule: {
                    ...d.schedule,
                    tables: {
                        ...d.schedule.tables,
                        days: d.schedule.type == "timetable" && d.schedule.tables.days.map((t, i) => i == tableIndex ? ({
                            data: tableData,
                            isFullOverride: t.isFullOverride,
                        }) : (t || DefaultTimetableDay)),
                    }
                }
            }))
        },
        toggleTimetableFullOverride({ tableIndex, fullOverride }) {
            setData((d) => ({
                ...d,
                schedule: {
                    ...d.schedule,
                    tables: {
                        ...d.schedule.tables,
                        days: d.schedule.type == "timetable" && d.schedule.tables.days.map((t, i) => i == tableIndex ? ({
                            data: t.data || DefaultTimetable,
                            isFullOverride: fullOverride,
                        }) : (t || DefaultTimetableDay)),
                    }
                }
            }))
        },

        clearAllData() {
            setData(DefaultData);
        },
    };

    const processCommand = ({ type, data: d }: Command) => {
        try {
            console.log("Executing Command", type, d);
            commands[type](d);
        } catch (e) {
            NotifyError(e);
        }
    };

    // --- Networking ---

    const [remoteControlEnabled, setRemoteControlEnabled] = useLocalStorage({
        key: "ziltek-remote-control-enabled",
        defaultValue: false,
    })

    if(!localStorage.getItem("ziltek-host-id"))
        localStorage.setItem("ziltek-host-id", uuidv4());
    const hostId = useMemo(() => localStorage.getItem("ziltek-host-id"), []);
    if(!localStorage.getItem("ziltek-host-key"))
        localStorage.setItem("ziltek-host-key", uuidv4());
    const hostKey = useMemo(() => localStorage.getItem("ziltek-host-key"), []);

    const {
        socket,
        isConnected,
        connectedRemotes,
        remoteQueue,
    } = useSocketIO({
        url: proxyUrl,
        connect: remoteControlEnabled,
        deps: [],
        events: {
            processCommand,
        },
        auth: {
            mode: "host",
            hostId,
            hostKey,
        },
    })

    useEffect(() => {
        if(isConnected) {
            socket.current.emit("updateState", {
                data,
                audioState,
                currentlyPlayingAudio,
                renderedSchedule,
                currentlyPlayingBell,
                logs,
                isOn,
            })
        }
    }, [
        isConnected,
        connectedRemotes,
        data,
        audioState,
        currentlyPlayingAudio,
        renderedSchedule,
        currentlyPlayingBell,
        logs,
        isOn,
    ]);

    // --- Render ---

    return (
        <ControllerAPI.Provider value={{
            processCommand,
            audioState,
            currentlyPlayingAudio,
            renderedSchedule,
            currentlyPlayingBell,
            logs,
            isOn,

            data,
            fileHandlers,

            hostMode: "local",
            remoteControlEnabled,
            setRemoteControlEnabled,
            hostId,
            isConnected,
            connectedRemotes,
            remoteQueue,
            proxyUrl,
            setProxyUrl,
            exit: () => exitLocalMode(),
        }}>
            <App />
        </ControllerAPI.Provider>
    );
}

export {
    LocalHost,
};

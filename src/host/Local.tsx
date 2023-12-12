import React, { useEffect, useMemo, useRef, useState } from "react";
import { ControllerAPI, DefaultData, AudioState, ControllerData, Log, StoredFileHandlers, CommandRunnerList, Command, StoredFile } from "./ControllerAPI.tsx";
import { useInterval, useListState, useLocalStorage } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import { IconAlertTriangle } from "@tabler/icons-react";
import { App } from "../app/App.tsx";
import { useCallback } from "react";
import { useIndexedDB } from 'react-indexed-db-hook';
import { NotifyError } from "../utils.tsx";
import { constructTable } from "../lib/timetable.ts";

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
    exitLocalMode
}) => {
    const [t] = useTranslation();

    // --- Networking ---
    // todo

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
    const [logs, logHandlers] = useListState<Log>([]);

    // --- Schedule ---

    const renderedSchedule = useMemo(() => {
        let currentDay = new Date().getDay();
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
    }, [data, new Date().getDay()]);

    const findBell = ((h, m) => {
        //return { x: 0, y: 0, bell: { value: "00:00", variant: "idle" } };

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
    const [lastPlayedBell, setLastPlayedBell] = useState(null);
    const clock = () => {
        let now = new Date();
        let h = now.getHours();
        let m = now.getMinutes();
        if (lastPlayedBell
            && lastPlayedBell.getHours() == h
            && lastPlayedBell.getMinutes() == m) {
            return;
        }

        let found = findBell(h, m);
        if (!found) return;
        setLastPlayedBell(now);

        processCommand({
            type: "playBellAudio",
            data: found,
        });
    };
    const interval = useInterval(clock, 1000);

    useEffect(() => {
        interval.start();
        return interval.stop;
    }, []);

    // --- Audio ---

    const audioRef = useRef(new Audio());

    useEffect(() => {
        audioRef.current.onended = () => {
            if (audioRef.current.src) URL.revokeObjectURL(audioRef.current.src);
            audioRef.current.src = "";
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
                date: Date.now(),
                type: "AUDIO_PLAY_FAILED",
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
        },

        stopAllAudio() {
            audioRef.current.pause();
            audioRef.current.onended?.();
        },

        forcePlayAudio({ filename }) {
            fileHandlers.getFile(filename)
                .then(file => {
                    if (!file) return NotifyError(`File "${filename}" not found. (forcePlayAudio)`);

                    playAudio(file);
                }, NotifyError);
        },

        forcePlayMelody({ index }) {
            this.forcePlayAudio(data.schedule.type == "timetable"
                && data.schedule.melodies.default[index].filename);
        },

        playBellAudio({ x, y = 0, bell, }) {
            // TODO melody overrides etc
            if (audioState == "off") {
                // TODO suppression notice
                return;
            };

            // TODO log
            if (audioState == "playing") return;

            this.forcePlayMelody({ index: y });
        },

        addQuickMelody: () => {
            setData((d) => ({
                ...d,
                quickMelodies: [
                    ...d.quickMelodies,
                    { filename: "" },
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
                        days: d.schedule.tables.days.map((t, i) => i == tableIndex ? tableData : t),
                    }
                }
            }))
        },
    };

    const processCommand = ({ type, data: d }: Command) => {
        try {
            commands[type](d);
        } catch (e) {
            NotifyError(e);
        }
    };

    // --- Render ---

    return (
        <ControllerAPI.Provider value={{
            processCommand,
            audioState,
            currentlyPlayingAudio,
            renderedSchedule,

            data,
            fileHandlers,

            isOn,
            setOn,

            hostMode: "local",
            exit: () => exitLocalMode(),
        }}>
            <App />
        </ControllerAPI.Provider>
    );
}

export {
    LocalHost,
};

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
        if (data.schedule.type == "timetable") {
            if(data.schedule.tables.days[new Date().getDay()]
                && data.schedule.tables.days[new Date().getDay()].isFullOverride) {
                return data.schedule.tables.days[new Date().getDay()].data;
            }

            return constructTable([
                data.schedule.tables.default,
                ...(data.schedule.tables.days[new Date().getDay()] ? (
                    data.schedule.tables.days[new Date().getDay()].data || []
                ) : ([]))
            ]);
        } else {
            // TODO
        }
    }, [data.schedule, new Date().getDay()]);

    const [lastPlayedBell, setLastPlayedBell] = useState(null);
    const interval = useInterval(() => {
        // TODO
    }, 1000);

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

    const commands: CommandRunnerList = useMemo(() => {
        return ({
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
        });
    }, []);

    const processCommand = ({ type, data }: Command) => {
        try {
            commands[type](data);
        } catch(e) {
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

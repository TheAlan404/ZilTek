import React, { useEffect, useMemo, useRef, useState } from "react";
import { ControllerAPI, DefaultData, AudioState, ControllerData, Log, StoredFileHandlers, CommandRunnerList, Command, StoredFile } from "./ControllerAPI.tsx";
import { useListState, useLocalStorage } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import { IconAlertTriangle } from "@tabler/icons-react";
import { App } from "../app/App.tsx";
import { useCallback } from "react";
import { useIndexedDB } from 'react-indexed-db-hook';

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

    // Networking
    // todo

    // Database
    const fileHandlers = useFileManager();

    // Controller
    const [isOn, setOn] = useState(true);
    const [audioState, setAudioState] = useState<AudioState>("idle");
    const [data, setData] = useLocalStorage<ControllerData>({
        key: "ziltek-data",
        defaultValue: DefaultData,
        serialize: JSON.stringify,
        deserialize: JSON.parse,
    });
    const [logs, logHandlers] = useListState<Log>([]);

    const audioRef = useRef(new Audio());

    const playAudio = useCallback((file) => {
        let url = typeof file === "string" ? file : URL.createObjectURL(file);
        audioRef.current.url = url;
        audioRef.current.play().catch(e => {
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

    const commands: CommandRunnerList = useMemo(() => {
        return ({
            changeBellStatus: ({ on }) => {
                setOn(on);
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
        });
    }, []);

    const processCommand = ({ type, data }: Command) => {
        commands[type](data);
    };

    return (
        <ControllerAPI.Provider value={{
            processCommand,
            audioState,

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

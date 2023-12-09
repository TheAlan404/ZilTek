import React, { useEffect, useMemo, useRef, useState } from "react";
import { ControllerAPI, DefaultData, AudioState, ControllerData, Log, StoredFileHandlers } from "./ControllerAPI.tsx";
import { useListState, useLocalStorage } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import { IconAlertTriangle } from "@tabler/icons-react";
import { App } from "../app/App.tsx";
import { useCallback } from "react";
import { useIndexedDB } from 'react-indexed-db-hook';

const useFileManager = (): StoredFileHandlers => {
    const db = useIndexedDB("files");

    const addFile = async ({ filename, data }: StoredFile) => {
        return await db.add({
            filename,
            data,
        }, filename);
    };

    const removeFile = async (filename: string) => {
        await db.deleteRecord(filename);
    };

    const renameFile = async (from: string, to: string) => {
        let file = await db.getByID<StoredFile>(from);
        await db.add({
            ...file,
            filename: to,
        }, file.filename);
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

    const processCommand = ({ type, data }) => {
        ({
            changeBellStatus: ({ on }) => {
                setOn(on);
            },
        }[type])(data);
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

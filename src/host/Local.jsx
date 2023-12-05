import React, { useEffect, useRef, useState } from "react";
import { ControllerAPI, DefaultData } from "./common/ControllerAPI";
import { useListState, useLocalStorage } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import { IconAlertTriangle } from "@tabler/icons-react";
import { App } from "../app/App";

const LocalHost = ({
    exitLocalMode
}) => {
    const [t] = useTranslation();
    const [isOn, setOn] = useState(true);
    const [audioState, setAudioState] = useState("idle");
    const [data, setData] = useLocalStorage({
        key: "ziltek-data",
        defaultValue: DefaultData,
        serialize: JSON.stringify,
        deserialize: JSON.parse,
    });
    const [logs, logHandlers] = useListState([]);

    const audioRef = useRef(new Audio());

    const playAudio = (file) => {
        let url = typeof file === "string" ? file : URL.createObjectURL(file);
        audioRef.current.url = url;
        audioRef.current.play().catch(e => {
            logHandlers.append({
                date: Date.now(),
                message: t("audio.playfailed"),
            });
            notifications.show({
                message: t("audio.playfailed"),
                title: t("error"),
                icon: <IconAlertTriangle />,
            });
        });
    };

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

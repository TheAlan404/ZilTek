import { PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { Button, Center, Code, Group, Loader, Stack, Text, Title } from "@mantine/core";
import { Controller } from "./ControllerAPI";
import { App } from "../app/App";
import { NetworkingContext } from "./NetworkingContext";
import { createState, State } from "@ziltek/common/src/state/State";
import { useEventListener } from "../hooks/useEvents";
import { StoredFileMetadata } from "@ziltek/common/src/StoredFile";
import { HostStatus } from "@ziltek/common/src/networking/HostStatus";
import { FilesystemContext } from "./fs/FilesystemContext";
import { Command } from "@ziltek/common/src/cmd/Command";
import { FilesystemCommand } from "@ziltek/common/src/cmd/FilesystemCommand";
import { LoadingScreen } from "../app/LoadingScreen";

export const RemoteHost = ({ children }: PropsWithChildren) => {
    const {
        emitter,
        processCommand,
        isConnected,
        socket,
    } = useContext(NetworkingContext);
    const [state, setState] = useState<State | null>(null);
    const [files, setFiles] = useState<StoredFileMetadata[] | null>(null);
    const [hostStatus, setHostStatus] = useState<HostStatus>("connecting");
    
    useEffect(() => {
        // on disconnect (?)
        if(!isConnected) {
            setHostStatus(p => p == "connected" ? "remoteDisconnected" : p);
            setState(null);
            setFiles(null);
        } else {
            setHostStatus("connecting");
        };
    }, [isConnected]);

    useEventListener(emitter, "UpdateState", (st: State) => setState(st));
    useEventListener(emitter, "SetFilesList", (files: StoredFileMetadata[]) => setFiles(files));

    if(!state || files === null || hostStatus !== "connected") return (
        <LoadingScreen
            variant={hostStatus === "connected" ? (
                files === null ? "storage" : hostStatus
            ) : hostStatus}
        />
    );

    return (
        <Controller.Provider
            value={{
                ...(state),
                processCommand,
            }}
        >
            <FilesystemContext.Provider
                value={{
                    files,
                    isReady: hostStatus == "connected",
                    refresh: () => processCommand(Command.Filesystem(FilesystemCommand.Refresh())),
                    write: (filename, data) => processCommand(Command.Filesystem(FilesystemCommand.AddFile({ filename, data }))),
                    rename: (from, to) => processCommand(Command.Filesystem(FilesystemCommand.Rename({ from, to }))),
                    remove: (filename) => processCommand(Command.Filesystem(FilesystemCommand.Delete(filename))),
                    read: async (filename) => {
                        if(!socket.current) return;
                        return await socket.current.emitWithAck("RequestFile", filename);
                    },
                }}
            >
                {children}
            </FilesystemContext.Provider>
        </Controller.Provider>
    )
}

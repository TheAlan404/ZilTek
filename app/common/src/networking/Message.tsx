import { Command } from "../cmd/Command";
import { State } from "../state/State";
import { StoredFileMetadata } from "../StoredFile";
import { SystemNotification } from "../SystemNotification";
import { HostStatus } from "./HostStatus";

export type HostMessageMap = {
    ProcessCommand: (cmd: Command) => void;
    UpdateState: (state: State) => void;
    RequestFile: (filename: string, cb: (data: ArrayBuffer) => void) => void;
    SetFilesList: (files: StoredFileMetadata[]) => void;
    DispatchNotification: (notif: SystemNotification) => void;
};

export type S2CMessageMap = HostMessageMap & {
    IncomingRemoteConnection: (remoteId: string) => void;
    RemoteConnected: (remoteId: string) => void;
    RemoteDisonnected: (remoteId: string) => void;
    HostStatusChanged: (status: HostStatus) => void;
    RelayNotification: (message: string) => void;
};

export type C2SMessageMap = HostMessageMap & {
    AcceptConnection: (remoteId: string) => void;
    DenyConnection: (remoteId: string) => void;
    DisconnectConnection: (remoteId: string) => void;
};

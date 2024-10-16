import { Command } from "../cmd/Command";
import { State } from "../state/State";
import { HostStatus } from "./HostStatus";

export type HostMessageMap = {
    ProcessCommand: (cmd: Command) => void;
    UpdateState: (state: State) => void;
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

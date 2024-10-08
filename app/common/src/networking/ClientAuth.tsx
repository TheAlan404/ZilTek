export type ClientAuth = {
    version: string;
} & ({
    mode: "host";
    hostId: string;
    hostKey: string;
} | {
    mode: "remote";
    connectTo: string;
    remoteId: string;
});

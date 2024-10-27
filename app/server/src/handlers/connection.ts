import { ClientAuth } from "@ziltek/common/src/networking/ClientAuth.tsx";
import { TSocket } from "../types.ts";
import { io } from "../server.ts";
import { logger } from "../logger.ts";

export const connectionHandler = (socket: TSocket) => {
    const auth = socket.handshake.auth as ClientAuth;

    if(auth.mode == "host")
        setupHost(socket);
    else
        setupRemote(socket);
};

const hostRoom = (id: string) => `host-${id}`;
const listenersRoom = (id: string) => `listeners-${id}`;
const queueRoom = (id: string) => `queue-${id}`;
const remoteIdRoom = (id: string) => `remote-${id}`;

const setupHost = async (socket: TSocket) => {
    const hostId = socket.handshake.auth.hostId as string;

    socket.join(hostRoom(hostId));

    io.in(listenersRoom(hostId)).emit("HostStatusChanged", "connected");
    
    // Sync already connected remotes
    for(let remote of await io.in(listenersRoom(hostId)).fetchSockets())
        socket.emit("RemoteConnected", remote.handshake.auth.remoteId as string);

    // Sync remote connection queue
    for(let remote of await io.in(queueRoom(hostId)).fetchSockets())
        socket.emit("IncomingRemoteConnection", remote.handshake.auth.remoteId as string);

    // -- Application --

    socket.on("UpdateState", (state) => {
        // TODO: validate state
        io.in(listenersRoom(hostId)).volatile.emit("UpdateState", state);
    });

    socket.on("SetFilesList", (files) => {
        // TODO: validate files
        io.in(listenersRoom(hostId)).emit("SetFilesList", files);
    });

    // -- Remote Management --

    socket.on("DisconnectConnection", (remoteId) => {
        let room = io.in(remoteIdRoom(remoteId));
        room.emit("HostStatusChanged", "kicked");
        room.socketsLeave(listenersRoom(hostId));
        socket.emit("RemoteDisonnected", remoteId);
    });

    // -- Queue --

    socket.on("AcceptConnection", (remoteId) => {
        io.in(remoteIdRoom(remoteId)).socketsLeave(queueRoom(hostId));
        io.in(remoteIdRoom(remoteId)).socketsJoin(listenersRoom(hostId));
        io.in(remoteIdRoom(remoteId)).emit("HostStatusChanged", "connected");
    });

    socket.on("DenyConnection", (remoteId) => {
        io.in(remoteIdRoom(remoteId)).socketsLeave(queueRoom(hostId));
        socket.emit("RemoteDisonnected", remoteId);
    });

    // -- Lifecycle --

    socket.on("disconnect", (reason) => {
        io.in(listenersRoom(hostId)).emit("HostStatusChanged", "hostDisconnected");
        io.in(queueRoom(hostId)).emit("HostStatusChanged", "hostDisconnected");
        logger.hostDisconnected(hostId);
    });

    logger.hostConnected(hostId);
};

const setupRemote = async (socket: TSocket) => {
    const remoteId = socket.handshake.auth.remoteId as string;
    const connectTo = socket.handshake.auth.connectTo as string;
    
    socket.join(remoteIdRoom(remoteId));

    // -- Application --

    socket.on("ProcessCommand", (cmd) => {
        // TODO: validate command
        if(!socket.rooms.has(listenersRoom(connectTo))) return;
        io.in(hostRoom(connectTo)).emit("ProcessCommand", cmd);
    });

    socket.on("RequestFile", (filename, cb) => {
        if(!socket.rooms.has(listenersRoom(connectTo))) return;
        io.in(hostRoom(connectTo)).emit("RequestFile", filename, ([data]) => {
            cb(data);
        });
    });

    // -- Initialize --

    socket.join(queueRoom(remoteId));
    io.in(hostRoom(connectTo)).emit("IncomingRemoteConnection", remoteId);

    // update HostStatus
    let isOnline = !!(await io.in(hostRoom(connectTo)).fetchSockets()).length;
    if(isOnline)
        socket.emit("HostStatusChanged", "inQueue");
    else
        socket.emit("HostStatusChanged", "hostDisconnected");

    // -- Lifecycle --

    socket.on("disconnect", (reason) => {
        io.in(hostRoom(connectTo)).emit("RemoteDisonnected", remoteId);
        logger.remoteDisconnected(remoteId);
    });

    logger.remoteConnected(remoteId);
};

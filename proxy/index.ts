import { Server } from "socket.io";
import { v4, validate } from "uuid";
import fs from "node:fs";
import { JSONPreset } from 'lowdb/node'

const defaultData = { hosts: {} }
const db = await JSONPreset('db.json', defaultData);

const PORT = Number(process.env.PORT) || 3000;

export interface ServerToClientEvents {
	updateState: (state: object) => void;
	processCommand: (cmd: object) => void;
	remoteConnectionRequest: (remoteId: string, callback: (accept: boolean) => void) => void;
	remoteConnected: (remoteId: string) => void;
	remoteDisconnected: (remoteId: string) => void;
	updateHostState: (isConnected: boolean) => void;
}

export interface ClientToServerEvents {
	updateState: (state: object) => void;
	processCommand: (cmd: object) => void;
}

interface InterServerEvents {}

interface SocketData {}

const io = new Server<
	ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData
>({
	cors: {
		origin: "*",
	}
});

io.use(async (socket, next) => {
	if (!["host", "remote"].includes(socket.handshake.auth.mode)) {
		return next(new Error("No 'mode' in auth"));
	}

	let {
		mode,
		hostId,
		hostKey,
		remoteId,
	} = socket.handshake.auth;

	//console.log(`Incoming conn`, socket.handshake.auth);

	if (socket.handshake.auth.mode == "host") {
		if (!validate(hostId)) return next(new Error("invalid hostId"));
		if (!validate(hostKey)) return next(new Error("invalid hostKey"));

		//let socks = await io.in(`host-${hostId}`).fetchSockets();
		//if(socks.length) return next(new Error("already connected?"));

		if (db.data.hosts[hostId]) {
			if (db.data.hosts[hostId] !== hostKey) return next(new Error("authentication failed"));
		} else {
			db.data.hosts[hostId] = hostKey;
			await db.write();
		}
		
		next();
	} else {
		if (!validate(hostId)) return next(new Error("invalid hostId"));
		if (!validate(remoteId)) return next(new Error("invalid remoteId"));

		io.in(`host-${hostId}`).emit("remoteConnectionRequest", remoteId, (accept) => {
			if (accept) {
				next();
			} else {
				next(new Error("access denied"));
			}
		});
	}
});

io.on("connection", (socket) => {
	let {
		mode,
		hostId,
		remoteId,
	} = socket.handshake.auth;

	if (mode == "host") {
		console.log(`Host connected: ${hostId}`);
		socket.join(`host-${hostId}`);

		io.in(`remotes-${hostId}`).emit("updateHostState", true);

		socket.on("updateState", (st) => {
			console.log(`updateState [${hostId} ==> *]`, st);
			io.to(`remotes-${hostId}`).emit("updateState", st);
		});
	} else {
		console.log(`Remote connected: ${remoteId} ==> ${hostId}`);
		socket.join(`remotes-${hostId}`);

		io.in(`host-${hostId}`).emit("remoteConnected", remoteId);

		socket.on("processCommand", (cmd) => {
			console.log(`processCommand [${remoteId} ==> ${hostId}]`, cmd);
			io.to(`host-${hostId}`).emit("processCommand", cmd);
		});
	}

	socket.on("disconnect", () => {
		console.log(`${mode == "host" ? "Host" : "Remote"} Disconnected: ${remoteId || hostId}`);
		if(mode == "host") {
			io.in(`remotes-${hostId}`).emit("updateHostState", false);
		} else {
			io.in(`host-${hostId}`).emit("remoteDisconnected", remoteId);
		}
	});
});

io.listen(PORT);

console.log(`Listening on port ${PORT}`);

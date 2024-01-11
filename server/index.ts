import { Server } from "socket.io";
import { v4, validate } from "uuid";
import { createServer } from 'node:http';
import express from 'express';
import { JSONFilePreset } from 'lowdb/node'
import { existsSync } from "node:fs";

const defaultData = { hosts: {} }
const db = await JSONFilePreset('db.json', defaultData);

const PORT = Number(process.env.PORT) || 3000;
const ADDR = process.env.ADDR || "0.0.0.0";
const REDIRECT_TO = "https://thealan404.github.io/ziltekproject";

export type RcHostState = "offline" | "connected" | "waiting" | "denied";

export interface ServerToClientEvents {
	updateState: (state: object) => void;
	processCommand: (cmd: object) => void;
	remoteConnectionRequest: (remoteId: string) => void;
	remoteConnected: (remoteId: string) => void;
	remoteDisconnected: (remoteId: string) => void;
	updateHostState: (st: RcHostState) => void;
}

export interface ClientToServerEvents {
	updateState: (state: object) => void;
	processCommand: (cmd: object) => void;
	acceptRemote: (remoteId: string) => void;
	denyRemote: (remoteId: string) => void;
	kickRemote: (remoteId: string) => void;
}

interface InterServerEvents {}

interface SocketData {}

const app = express();
const server = createServer(app);

if(existsSync("../dist")) {
	console.log("Serving ../dist");
	app.use(express.static("../dist"));
} else {
	app.get("/", (req, res) => {
		console.log("Redirecting someone");
		res.redirect(REDIRECT_TO);
	});
}

const io = new Server<
	ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData
>(server, {
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

		next();
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

		io.in(`remotes-${hostId}`).emit("updateHostState", "connected");

		socket.on("updateState", (st) => {
			//console.log(`updateState [${hostId} ==> *]`, st);
			io.to(`remotes-${hostId}`).emit("updateState", st);
		});

		socket.on("kickRemote", (remoteId) => {
			io.in(`remote-${remoteId}`).disconnectSockets();
		});

		socket.on("acceptRemote", (remoteId) => {
			io.in(`remote-${remoteId}`).socketsJoin(`remotes-${hostId}`);
			io.in(`host-${hostId}`).emit("remoteConnected", remoteId);
			console.log(`Remote connected: ${remoteId} ==> ${hostId}`);
		});

		socket.on("denyRemote", (remoteId) => {
			io.in(`remote-${remoteId}`).emit("updateHostState", "denied");
		});
	} else {
		io.in(`host-${hostId}`).emit("remoteConnectionRequest", remoteId);
		socket.join(`remote-${remoteId}`);

		socket.on("processCommand", (cmd) => {
			if(socket.rooms.has(`host-${hostId}`))
				io.to(`host-${hostId}`).emit("processCommand", cmd);
		});
	}

	socket.on("disconnect", () => {
		console.log(`${mode == "host" ? "Host" : "Remote"} Disconnected: ${remoteId || hostId}`);
		if(mode == "host") {
			io.in(`remotes-${hostId}`).emit("updateHostState", "offline");
		} else {
			io.in(`host-${hostId}`).emit("remoteDisconnected", remoteId);
		}
	});
});

server.listen(PORT, ADDR, () => {
	console.log(`Listening on addr ${ADDR}, port ${PORT}`);
});

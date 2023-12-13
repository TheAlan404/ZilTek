import { WebSocketServer } from 'ws';
import { v4, validate } from "uuid";
import fs from "node:fs";

const PORT = process.env.PORT || 3000;

const wss = new WebSocketServer({
	port: PORT,
});

const sockets = new Map();

const authPath = "./authenticatedHosts.json";
let authenticatedHosts = {};
const loadAuthenticatedHosts = () => {
	authenticatedHosts = fs.existsSync(authPath)
		? JSON.parse(fs.readFileSync(authPath))
		: {};
};
const saveAuthenticatedHosts = () => {
	fs.writeFileSync(authPath, JSON.stringify(authenticatedHosts));
	console.log("authenticatedHosts saved");
}

loadAuthenticatedHosts();

console.log(`${Object.keys(authenticatedHosts).length} previously authenticated hosts loaded`);

wss.on('connection', (socket) => {
	let id = v4();
	sockets.set(id, {
		socket,
		mode: "unknown",
	});
	console.log('a client connected');

	socket.on('message', (message) => {
		let { type, data } = JSON.parse(message);

		console.log("PACKET", id, type, data);

		if(sockets.get(id).mode == "unknown") {
			if(type == "Register") {
				if(
					!data || !validate(data.hostId) || !validate(data.key)
				) return;

				console.log("Register", data);

				if(authenticatedHosts[data.hostId]) {
					if (authenticatedHosts[data.hostId] !== data.key) return;
				} else {
					authenticatedHosts[data.hostId] = data.key;
					saveAuthenticatedHosts();
				}

				sockets.set(id, {
					mode: "host",
					socket,
					hostId: data.hostId,
					key: data.key,
				});

				socket.send(JSON.stringify({
					type: "RegisterSuccess"
				}));
			} else if(type == "Connect") {
				if(
					!data || !validate(data.hostId) || !validate(data.remoteId)
				) return;

				console.log("Connect", data);

				if(![...sockets.entries()].some(x => x.mode == "host" && x.hostId == data.hostId)) {
					socket.send(JSON.stringify({
						type: "HostOffline"
					}));
					return;
				}

				sockets.set(id, {
					mode: "remote",
					hostId: data.hostId,
					remoteId: data.remoteId,
				});
			}
		} else if(sockets.get(id).mode == "host") {
			if(type == "Broadcast") {
				let selfId = socket.get(id).hostId;
				for(let [rId, remote] in [...sockets.entries()].filter((id, x) => x.mode == "remote" && x.hostId == selfId)) {
					sockets.get(rId).socket.send(JSON.stringify({
						type: "Proxy",
						data,
					}));
				}
			}
		} else if(sockets.get(id).mode == "remote") {
			if(type == "Send") {
				let hostId = sockets.get(id).hostId;
				let host = [...sockets.values()].find(x => x.mode == "host" && x.hostId == hostId);
				if(!host) return console.log("host not found");

				host.socket.send(JSON.stringify({
					type: "Proxy",
					data,
				}));
			}
		}
	});

	socket.on('close', () => {
		console.log('a client disconnected');
		let info = sockets.get(id);
		if (info.mode == "host") {
			for(let [rId, remote] in [...sockets.entries()].filter((id, x) => x.mode == "remote" && x.hostId == selfId)) {
				sockets.get(rId).socket.close();
			}
		}
		sockets.delete(id);
	});
});

console.log(`WebSocket server is running on port ${PORT}`);

import { Server } from "socket.io";
import express from 'express';
import { createServer } from 'node:http';
import { existsSync } from "node:fs";
import { DIST_FOLDER } from "./config.ts";
import { authenticationMiddleware } from "./handlers/auth.ts";
import { TServer } from "./types.ts";
import { versionCheckMiddleware } from "./handlers/versionCheck.ts";
import { connectionHandler } from "./handlers/connection.ts";
import { inspectMiddleware } from "./handlers/inspect.ts";
import { logger } from "./logger.ts";

const app = express();
export const httpServer = createServer(app);

export const io: TServer = new Server(httpServer, {
	maxHttpBufferSize: 1e8, // 100 MB
	cors: {
		origin: "*",
	},
});

app.get("/_test", (req, res) => void res.json("OK"));

if(existsSync(DIST_FOLDER)) {
	logger.serving(DIST_FOLDER);
    app.use(express.static(DIST_FOLDER));
};

io.use(inspectMiddleware);
io.use(authenticationMiddleware);
io.use(versionCheckMiddleware);
io.on("connection", connectionHandler);

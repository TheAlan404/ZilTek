import { ADDR, PORT } from "./config.ts";
import { logger } from "./logger.ts";
import { httpServer } from "./server.ts";

httpServer.listen(PORT, ADDR, () => {
	logger.listening(PORT, ADDR);
});

import chalk, { ForegroundColorName } from "chalk";

export type LogType = "info" | "warn" | "error";

const LogColors: Record<LogType, ForegroundColorName> = {
    info: "green",
    error: "red",
    warn: "yellow",
};

const pad = (s: number) => s.toString().padStart(2, "0");
export const log = (ty: LogType, m: string) => {
    const d = new Date();
    const ts = [
        pad(d.getHours()),
        pad(d.getMinutes()),
        pad(d.getSeconds()),
        d.getMilliseconds().toString(),
    ].join(":");
    
    console.log(
        `${chalk.dim(ts)} ${chalk[LogColors[ty]](ty)} ${m}`
    );
};

export const logger = {
    listening: (port: number, addr: string) => log("info", `Listening on ${chalk.bold(addr+":"+port)}`),
    hostConnected: (id: string) => log("info", `Host ${chalk.bold(id)} connected`),
    remoteConnected: (id: string) => log("info", `Remote ${chalk.bold(id)} connected`),
    hostDisconnected: (id: string) => log("info", `Host ${chalk.bold(id)} disconnected`),
    remoteDisconnected: (id: string) => log("info", `Remote ${chalk.bold(id)} disconnected`),
};

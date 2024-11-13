import chalk, { ForegroundColorName } from "chalk";

export type LogType = "info" | "warn" | "error" | "debug" | "trace";

const LogColors: Record<LogType, ForegroundColorName> = {
    info: "green",
    error: "red",
    warn: "yellow",
    debug: "gray",
    trace: "gray",
};

const pad = (s: number) => s.toString().padStart(2, "0");
export const log = (ty: LogType, m: string) => {
    const d = new Date();
    const ts = [
        pad(d.getHours()),
        pad(d.getMinutes()),
        pad(d.getSeconds()),
    ].join(":") + "." + d.getMilliseconds().toString().padStart(3, "0");
    
    console.log(
        `${chalk.dim(ts)} ${chalk[LogColors[ty]](ty.padStart(5, " "))} ${m}`
    );
};

const I = (id: string) => chalk.bold(id.split("-")[0]);

export const logger = {
    listening: (port: number, addr: string) => log("info", `Listening on ${chalk.bold(addr+":"+port)}`),
    serving: (path: string) => log("info", `Serving static ${chalk.dim(path)}`),
    hostConnected: (id: string) => log("info", `Host ${chalk.bold(I(id))} connected`),
    remoteConnected: (id: string, target: string) => log("info", `Remote ${chalk.bold(I(id))} (-> ${I(target)}) connected`),
    hostDisconnected: (id: string) => log("info", `Host ${chalk.bold(I(id))} disconnected`),
    remoteDisconnected: (id: string) => log("info", `Remote ${chalk.bold(I(id))} disconnected`),
    accepted: (host: string, remote: string) => log("info", `${I(host)} accepted ${I(remote)}`),
    denied: (host: string, remote: string) => log("info", `${I(host)} denied ${I(remote)}`),
    kicked: (host: string, remote: string) => log("info", `${I(host)} kicked ${I(remote)}`),
    stateUpdate: (host: string) => log("debug", `${I(host)} updated state`),
    cmd: (sender: string, to: string) => log("debug", `Command dispatched ${I(sender)} -> ${I(to)}`),
};

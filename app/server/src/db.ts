import { Low } from 'lowdb'
import { JSONFilePreset } from 'lowdb/node'
import { DATABASE_PATH } from "./config.ts";

export type Database = {
    hosts: Record<string, string>;
};

export const low: Low<Database> = await JSONFilePreset<Database>(DATABASE_PATH, {
    hosts: {},
});

export const db = {
    hostExists: async (hostId: string) => !!low.data.hosts[hostId],
    getHostKey: async (hostId: string) => low.data.hosts[hostId],
    setHostKey: async (hostId: string, hostKey: string) => await low.update((d) => d.hosts[hostId] = hostKey),
};

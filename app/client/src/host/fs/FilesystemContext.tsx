import { createContext } from "react";
import { StoredFileMetadata } from "@ziltek/common/src/StoredFile";

export type IFilesystemContext = {
    files: StoredFileMetadata[];
    isReady: boolean;
    error?: any;
    rename: (from: string, to: string) => Promise<void>;
    remove: (filename: string) => Promise<void>;
    write: (filename: string, content: ArrayBuffer) => Promise<void>;
    read: (filename: string) => Promise<ArrayBuffer  | undefined>;
    refresh: () => Promise<void>;
};

export const FilesystemContext = createContext<IFilesystemContext>({
    files: [],
    isReady: false,
    rename: async () => {},
    refresh: async () => {},
    remove: async () => {},
    write: async () => {},
    read: async () => undefined,
});

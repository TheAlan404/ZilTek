import { createContext } from "react";
import { StoredFileMetadata } from "@ziltek/common/src/StoredFile";
import { noop } from "@mantine/core";

export type IFilesystemContext = {
    files: StoredFileMetadata[];
    isReady: boolean;
    error?: any;
    rename: (from: string, to: string) => void;
    remove: (filename: string) => void;
    write: (filename: string, content: ArrayBuffer) => void;
    read: (filename: string) => Promise<ArrayBuffer  | undefined>;
    refresh: () => void;
};

export const FilesystemContext = createContext<IFilesystemContext>({
    files: [],
    isReady: false,
    rename: noop,
    refresh: noop,
    remove: noop,
    write: noop,
    read: async () => undefined,
});

import { createFactory, Enum } from "@alan404/enum";

export const FilesystemCommand = createFactory<FilesystemCommand>();
export type FilesystemCommand = Enum<{
    Rename: {
        from: string;
        to: string;
    };
    Delete: string;
    AddFile: { filename: string, data: ArrayBuffer };
    Refresh: void;
}>;

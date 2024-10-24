import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { FilesystemContext } from "./FilesystemContext";
import { initDB, useIndexedDB } from 'react-indexed-db-hook';
import { useSet } from "@mantine/hooks";
import { StoredFileMetadata } from "@ziltek/common/src/StoredFile";

type StoredFile = StoredFileMetadata & {
    data: ArrayBuffer;
};

initDB({
    name: "ZilTekDB",
    version: 2,
    objectStoresMeta: [{
        store: "files",
        storeConfig: {
            keyPath: "filename",
            autoIncrement: false,
        },
        storeSchema: [
            { name: "filename", keypath: "filename", options: { unique: true } },
            { name: "data", keypath: "data", options: { unique: false } },
        ],
    }],
});

const DB_NAME = "ZilTekDB";
const DB_VERSION = 2;
const STORE_NAME = "files";

const transaction = <T,>(
    db: IDBDatabase,
    mode: IDBTransactionMode,
    work: (s: IDBObjectStore) => IDBRequest<T>,
): Promise<T> => {
    let t = work(
        db.transaction(STORE_NAME, mode)
            .objectStore(STORE_NAME)
    );

    return new Promise(async (res, rej) => {
        t.onerror = () => rej(t.error);
        t.onsuccess = () => res(t.result);
    });
};

export const IndexedDBFilesystem = ({ children }: PropsWithChildren) => {
    const [files, setFiles] = useState<StoredFileMetadata[]>([]);
    const db = useRef<IDBDatabase | null>(null);
    const [error, setError] = useState<any>(null);
    const [isReady, setReady] = useState(false);
    
    useEffect(() => {
        db.current = null;
        setReady(false);
        const openRequest = window.indexedDB.open(DB_NAME, DB_VERSION);
        
        openRequest.onerror = () => {
            setError(openRequest.error);
            setReady(false);
        };

        openRequest.onupgradeneeded = () => {
            let db = openRequest.result;
            db.createObjectStore(STORE_NAME, {
                keyPath: "filename",
            });
        };

        openRequest.onsuccess = () => {
            setError(null);
            db.current = openRequest.result;
            setReady(true);
        };

        return () => {
            db.current?.close();
            db.current = null;
        };
    }, []);

    const read = async (filename: string) => {
        if(!db.current) return;
        let { data } = await transaction<StoredFile>(db.current, "readonly", (s) => s.get(filename));
        return data as ArrayBuffer;
    };

    const write = async (filename: string, content: ArrayBuffer) => {
        if(!db.current) return;
        let stored: StoredFile = {
            filename,
            data: content,
        };
        await transaction(db.current, "readwrite", (s) => s.add(stored));
    };

    const refresh = async () => {
        if(!db.current) return;
        let all = await transaction<StoredFile[]>(db.current, "readonly", (s) => s.getAll());
        setFiles(all.map(x => ({ filename: x.filename })));
    };

    const rename = async (from: string, to: string) => {
        let data = await read(from);
        if(!data) return;
        await write(to, data);
    };

    const remove = async (filename: string) => {
        if(!db.current) return;
        await transaction(db.current, "readwrite", (s) => s.delete(filename));
    };
    
    return (
        <FilesystemContext.Provider
            value={{
                files,
                error,
                isReady,
                read,
                write,
                rename,
                remove,
                refresh,
            }}
        >
            {children}
        </FilesystemContext.Provider>
    )
};

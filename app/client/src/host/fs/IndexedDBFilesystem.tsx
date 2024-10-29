import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { FilesystemContext } from "./FilesystemContext";
import { StoredFileMetadata } from "@ziltek/common/src/StoredFile";

const DB_NAME = "ZilTekDB";
const DB_VERSION = 3;
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
            if(db.objectStoreNames.contains(STORE_NAME)) db.deleteObjectStore(STORE_NAME);
            db.createObjectStore(STORE_NAME, {
                autoIncrement: false,
            });
        };

        openRequest.onsuccess = () => {
            setError(null);
            db.current = openRequest.result;
            setReady(true);
            refresh();
        };

        return () => {
            db.current?.close();
            db.current = null;
        };
    }, []);

    const read = async (filename: string) => {
        if(!db.current) return;
        let data = await transaction<ArrayBuffer>(db.current, "readonly", (s) => s.get(filename));
        return data;
    };

    const write = async (filename: string, data: ArrayBuffer) => {
        if(!db.current) return;
        console.log("Writing to IDB:", filename, data);
        await transaction(db.current, "readwrite", (s) => s.add(data, filename));
        refresh();
    };

    const refresh = async () => {
        if(!db.current) return;
        const all = await transaction<IDBValidKey[]>(db.current, "readonly", (s) => s.getAllKeys());
        const filenames = all.filter(x => typeof x == "string");
        let metadata: StoredFileMetadata[] = [];
        for(let filename of filenames) {
            let data = await read(filename);
            metadata.push({
                filename,
                fileSize: data.byteLength,
            });
        }
        setFiles(metadata);
    };

    const rename = async (from: string, to: string) => {
        let data = await read(from);
        if(!data) return;
        await write(to, data);
        await remove(from);
        refresh();
    };

    const remove = async (filename: string) => {
        if(!db.current) return;
        await transaction(db.current, "readwrite", (s) => s.delete(filename));
        refresh();
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

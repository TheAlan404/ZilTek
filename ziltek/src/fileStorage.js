/**
 * @typedef {object} StoredFile
 * @prop {string} filename
 * @prop {boolean} [builtIn=false]
 * @prop {File} file
 */

import { showNotification } from "@mantine/notifications";
import { IconAlertTriangle } from "@tabler/icons";
import tobecontinued from "./exampleMelodies/tobecontinued.mp3";
import s from "./lang";

class CustomError extends Error {
    constructor(m, d = {}) {
        super(m);
        for(let [k,v] in Object.entries(d))
            this[k] = v;
    }
}

/**
 * 
 * @param {IDBTransaction} t 
 * @returns {Promise<Event>}
 */
const wraptx = (t) => new Promise(r => {
    t.oncomplete = r;
    t.onabort = (e) => console.log("abort wraptx", e);
    t.onerror = (e) => console.log("error wraptx", e);
})

const BuiltInDataStore = Object.entries({
    "tobecontinued.mp3": tobecontinued,
}).reduce((all, [filename, file]) => [...all, {
    filename,
    file,
    builtIn: true,
}], []);

class FileStorage {
    files = [];

    listeners = [];

    subscribeUpdate(fn) {
        this.listeners.push(fn);
    }

    emitUpdate() {
        this.listeners.forEach(fn => fn(this));
    }

    initialize(events) {
        events.status("Initializing database...")
        let openReq = indexedDB.open("ZilTekFileStore");
        openReq.onerror = () => {
            events.error(openReq.error);
        };

        openReq.onsuccess = () => {
            /**
             * @type {IDBDatabase}
             */
            this.db = openReq.result;
            events.status("Loading files...");
            this.loadFiles(() => {
                events.success(this);
            });
        };

        openReq.onupgradeneeded = (e) => {
            events.status("Creating database...")
            this.db = e.target.result;
            this.db.onerror = () => {
                events.error();
            };

            let objectStore = this.db.createObjectStore("files", {
                keyPath: "filename",
            });

            objectStore.createIndex("data", "data", { unique: false });
        };
    }

    loadFiles(cb) {
        let objectStore = this.db.transaction("files").objectStore("files");
        let req = objectStore.getAll();
        req.onsuccess = (e) => {
            let data = e.target.result;
            console.log(data);
            this.files = data;
            if(cb) cb();
            this.emitUpdate();
        };
    };

    /**
     * @param {string} name 
     * @returns {File|null}
     */
    getFile(name) {
        return BuiltInDataStore.find(f => f.filename == name) || this.files.find(f => f.filename == name);
    };

    /**
     * @returns {StoredFile[]}
     */
    getFiles() {
        return [
            ...BuiltInDataStore,
            ...this.files,
        ];
    };

    /**
     * @param {string} filename 
     * @param {File} file 
     */
    async putFile(filename, file) {
        console.log("putFile", filename, file);

        if(this.files.some(f => f.filename === filename)) {
            throw new CustomError("FILE_EXISTS", { filename });
        }

        let buf = await file.arrayBuffer();
        let tx = this.db.transaction("files", "readwrite");
        let objectStore = tx.objectStore("files");
        objectStore.add({
            filename,
            file: buf,
            created: Date.now(),
        });
        await wraptx(tx);
        this.loadFiles();
    };

    async renameFile(name, newname) {
        let file = this.files.find(f => f.filename == name);

        await this.putFile(newname, new Blob([file.file]));
        await this.deleteFile(name);
    }

    /**
     * 
     * @param {File[]} files 
     */
    putFilesSync(files, cb, cbe) {
        Promise.all(files.map(f => this.putFile(f.name, f)))
            .then(() => {
                this.loadFiles(() => cb());
            })
            .catch((e) => cbe(e));
    }

    async deleteFile(filename) {
        let tx = this.db.transaction("files", "readwrite");
        let objectStore = tx.objectStore("files");
        objectStore.delete(filename);
        await wraptx(tx);
        this.loadFiles();
    };
};

export default new FileStorage();
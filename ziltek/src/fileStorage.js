/**
 * @typedef {object} StoredFile
 * @prop {string} filename
 * @prop {boolean} [builtIn=false]
 * @prop {File} file
 */

import tobecontinued from "./exampleMelodies/tobecontinued.mp3";

/**
 * 
 * @param {IDBTransaction} t 
 * @returns {Promise<Event>}
 */
const wraptx = (t) => new Promise(r => (t.oncomplete = r))

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
            cb();
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
        let tx = this.db.transaction("files");
        let objectStore = tx.objectStore("files");
        objectStore.add({
            filename,
            file: await file.arrayBuffer(),
            created: Date.now(),
        });
        await wraptx(tx);
        this.emitUpdate();
    };

    /**
     * 
     * @param {File[]} files 
     */
    putFilesSync(files, cb) {
        Promise.all(files.map(f => this.putFile(f.name, f))).then(() => cb());
    }

    async deleteFile(filename) {
        let tx = this.db.transaction("files");
        let objectStore = tx.objectStore("files");
        objectStore.delete(filename);
        await wraptx(tx);
        this.emitUpdate();
    };
};

export default new FileStorage();
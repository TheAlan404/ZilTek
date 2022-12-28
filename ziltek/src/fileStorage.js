/**
 * @typedef {object} StoredFile
 * @prop {boolean} [builtIn=false]
 * @prop {File} file
 */

class FileStorage {
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
        };
    };

    /**
     * @param {string} name 
     * @returns {File|null}
     */
    getFile(name) {

    };

    /**
     * @param {string} name 
     * @param {File} file 
     */
    async putFile(name, file) {
        let objectStore = this.db.transaction("files").objectStore("files");
        objectStore.add({
            data: await file.arrayBuffer(),
        }, name);
    };
};

export default new FileStorage();
import { hideNotification, showNotification, updateNotification } from "@mantine/notifications";
import { IconAlertTriangle, IconBug, IconCheck } from "@tabler/icons";
import { saveAs } from 'file-saver';
import JSZip, { file } from "jszip";
import fileStorage from "./fileStorage";
import controller from "./controller";
import s from "./lang";
import fetchWithProgress from "../util/fetchWithProgress";
import { Progress } from "@mantine/core";


const handleErr = (e) => showNotification({
    title: s("fatalError"),
    message: e.toString(),
    color: "red",
    icon: <IconBug />,
    autoClose: false,
});


class ImportManager {
    constructor() {

    }

    /**
     * 
     * @param {import("@mantine/dropzone").FileWithPath[]} files 
     */
    bulk(files) {
        console.log("importManager bulk", files);

        if(files.length == 1 && [
            "application/x-zip-compressed",
            "application/zip"
        ].includes(files[0].type)) {
            this.import(files[0]);
            return;
        }

        showNotification({
            title: s("importing"),
            message: s("importingFiles", files.length),
            id: "importer",
            loading: true,
            autoClose: false,
            disallowClose: true,
        })

        fileStorage.putFilesSync(files.filter(file => file.type.startsWith("audio")), () => {
            updateNotification({
                id: "importer",
                color: "green",
                title: s("imported"),
                message: s("audioImported", files.length),
                icon: <IconCheck size={16} />,
                autoClose: 2000,
            });
        }, (e) => {
            if(e.message == "FILE_EXISTS") {
                showNotification({
                    message: s("fileAlreadyExists", e.filename),
                    color: "red",
                    icon: <IconAlertTriangle />
                })
            } else {
                console.log(e);
                handleErr(e);
            }
            hideNotification("importer")
        });
    }

    /**
     * 
     * @param {File} zipped 
     */
    import(zipped) {
        console.log("importing now", zipped);
        this.deleteAll().then(() => {
            showNotification({
                message: s("importing"),
                id: "importer",
                autoClose: false,
                disallowClose: true,
                loading: true,
            });
    
            let configImported = false;
            let importing = new Set();
            let imported = new Set();
            let progress = () => {
                let log = [];
                if(configImported) log.push(s("importedConfig"));
                for(let name of importing)
                    log.push(s("importingAudio", name));
                for(let name of imported)
                    log.push(s("importedAudio", name));
    
                updateNotification({
                    title: s("importing"),
                    message: log.join("\n"),
                    id: "importer",
                    autoClose: false,
                    disallowClose: true,
                    loading: true,
                });
            }
    
            JSZip.loadAsync(new Blob([zipped])).then((zip) => {
                zip.file("db.json").async("string").then((json) => {
                    localStorage.setItem("ziltekdata", json);
                    configImported = true;
                    progress();
    
                    let readPromises = [];
    
                    zip.folder("audio").forEach((path, zipFile) => {
                        if(path.includes("/")) return;
                        importing.add(path);
                        progress();
                        readPromises.push(zipFile.async("blob").then(blob => ({ file: blob, filename: path })));
                    });
    
                    Promise.all(readPromises).then((blobs) => {
                        let x = blobs.map(({ file, filename }) => {
                            return new Promise((res) => {
                                fileStorage.putFile(filename, file).then(() => {
                                    importing.delete(filename);
                                    imported.add(filename);
                                    progress();
                                    res(1);
                                }).catch((e) => {
                                    if(e.message == "FILE_EXISTS") {
                                        showNotification({
                                            message: s("fileAlreadyExists", filename),
                                            color: "red",
                                            icon: <IconAlertTriangle />
                                        })
                                    } else {
                                        console.log("importManager import putFile catch", e);
                                        throw e;
                                    }
                                });
                            })
                        });

                        Promise.all(x).then((list) => {
                            updateNotification({
                                title: s("imported"),
                                message: s("importedAll"),
                                id: "importer",
                                autoClose: 10000,
                                color: "green",
                                icon: <IconCheck size={16} />,
                            });
                            controller.loadData();
                        });
                    })
                });
            });
        });
    }

    export() {
        showNotification({
            message: s("exporting"),
            id: "exporter",
            autoClose: false,
            disallowClose: true,
            loading: true,
        });
        let zip = new JSZip();
        controller.saveData();
        zip.file("db.json", localStorage.getItem("ziltekdata"));
        let folder = zip.folder("audio");
        for(let dbFile of fileStorage.files) {
            folder.file(dbFile.filename, new Blob([dbFile.file]));
        };
        zip.generateAsync({ type: "blob" }).then((blob) => {
            saveAs(blob, "ZiltekConfig.zip");
            updateNotification({
                message: s("exported"),
                id: "exporter",
                color: "green",
                icon: <IconCheck size={16} />,
                autoClose: 10000,
            });
        });
    }

    deleteAll() {
        controller.setDefaults();
        localStorage.removeItem("ziltekdata");
        return Promise.all(fileStorage.files.map(({ filename }) => fileStorage.deleteFile(filename)));
    }

    downloadYoutubeLink(link, { title, id }) {
        showNotification({
            title: s("downloadingYT"),
            message: title,
            id: "downloader-" + id,
            loading: true,
            autoClose: false,
            disallowClose: true,
        })
        fetchWithProgress(link, {}, (prog) => {
            updateNotification({
                id: "downloader-" + id,
                title: s("downloadingYT"),
                message: (<div>
                    {title}
                    <Progress value={prog * 100} />
                </div>),
                loading: true,
                autoClose: false,
                disallowClose: true,
            });
        }).then(blob => {
            updateNotification({
                id: "downloader-" + id,
                title: s("importingAudio"),
                message: title,
                loading: true,
                autoClose: false,
                disallowClose: true,
            });
            fileStorage.putFile(id + ".webm", blob).then(() => {
                updateNotification({
                    id: "downloader-" + id,
                    color: "green",
                    title: s("downloadedYT"),
                    message: title,
                    icon: <IconCheck size={16} />,
                    autoClose: 10000,
                });
            }).catch(e => {
                if(e.message == "FILE_EXISTS") {
                    showNotification({
                        message: s("fileAlreadyExists", id + ".webm"),
                        color: "red",
                        icon: <IconAlertTriangle />
                    })
                } else {
                    console.log(e);
                    handleErr(e);
                }
                hideNotification("downloader-" + id)
            });
        });
    }
}

export default new ImportManager();
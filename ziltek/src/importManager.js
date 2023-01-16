import { hideNotification, showNotification, updateNotification } from "@mantine/notifications";
import { IconAlertTriangle, IconBug, IconCheck } from "@tabler/icons";
import fileStorage from "./fileStorage";
import s from "./lang";


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
        showNotification({
            title: s("importing"),
            message: s("importingFiles", files.length),
            id: "importer",
            loading: true,
            autoClose: false,
            disallowClose: true,
        })

        fileStorage.putFilesSync(files, () => {
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
    importConfig(zipped) {
        
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
        fetch(link).then(res => res.blob()).then(blob => {
            fileStorage.putFile(id + ".webm", blob).then(() => {
                updateNotification({
                    id: "downloader-" + id,
                    color: "green",
                    title: s("downloadedYT"),
                    message: title,
                    icon: <IconCheck size={16} />,
                    autoClose: 2000,
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
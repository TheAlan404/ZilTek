import { showNotification, updateNotification } from "@mantine/notifications";
import fileStorage from "./fileStorage";
import s from "./lang";

class ImportManager {
    constructor() {

    }

    /**
     * 
     * @param {import("@mantine/dropzone").FileWithPath[]} files 
     */
    bulk(files) {
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
                title: s("audioImported"),
                message: s("audioImported", files.length),
                icon: <IconCheck size={16} />,
                autoClose: 2000,
            });
        });
    }

    /**
     * 
     * @param {File} zipped 
     */
    importConfig(zipped) {
        
    }
}

export default new ImportManager();
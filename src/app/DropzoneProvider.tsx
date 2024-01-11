import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { useContext } from "react";
import { Command, ControllerAPI, ControllerData, StoredFile } from "../host/ControllerAPI";
import { IconUpload } from "@tabler/icons-react";
import JSZip from "jszip";
import { saveAs } from 'file-saver';

export const exportToZip = async (data: ControllerData, files: StoredFile[]) => {
    let zip = new JSZip();

    zip.file("db.json", JSON.stringify(data));

    let folder = zip.folder("audio");

    for(let file of files) {
        folder.file(file.filename, new Blob([file.data]));
    };

    let blob = await zip.generateAsync({ type: "blob" });

    saveAs(blob, `ZilTekConfig.zip`);
};

export const importFromZip = async (processCommand: (cmd: Command)=>void, file: FileWithPath) => {
    let zip = await JSZip.loadAsync(new Blob([file]));
        
    let dataJson = JSON.parse(await zip.file("db.json")?.async("string"));

    processCommand({
        type: "setAllData",
        data: {
            data: dataJson,
        }
    });

    processCommand({
        type: "deleteAllFiles"
    });

    zip.folder("audio").forEach(async (path, zipFile) => {
        if(path.includes("/")) return;
        
        let blob = await zipFile.async("blob");

        processCommand({
            type: "addFile",
            data: {
                filedata: blob,
                filename: path,
            },
        })
    });
}

export const DropzoneProvider = () => {
    const { processCommand } = useContext(ControllerAPI);
    
    return (
        <Dropzone.FullScreen
            onDrop={(files) => {
                if(files.length == 1 && [
                    "application/x-zip-compressed",
                    "application/zip"
                ].includes(files[0].type)) {
                    return importFromZip(processCommand, files[0]);
                }

                for(let file of files) {
                    if(!file.type.startsWith("audio")) continue;

                    processCommand({
                        type: "addFile",
                        data: {
                            filename: file.name,
                            filedata: file,
                        },
                    })
                }
            }}
        >
            <Dropzone.Accept>
                <IconUpload />
            </Dropzone.Accept>
        </Dropzone.FullScreen>
    )
}

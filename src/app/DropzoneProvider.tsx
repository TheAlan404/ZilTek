import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { useContext } from "react";
import { ControllerAPI, ControllerData, StoredFile } from "../host/ControllerAPI";
import { IconUpload } from "@tabler/icons-react";

export const createZip = (data: ControllerData, files: StoredFile[]) => {

};

export const DropzoneProvider = () => {
    const { processCommand } = useContext(ControllerAPI);

    const fromZip = async (file: FileWithPath) => {

    }
    
    return (
        <Dropzone.FullScreen
            onDrop={(files) => {
                if(files.length == 1 && [
                    "application/x-zip-compressed",
                    "application/zip"
                ].includes(files[0].type)) {
                    return fromZip(files[0]);
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

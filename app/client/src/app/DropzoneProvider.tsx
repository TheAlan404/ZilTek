import { Dropzone } from "@mantine/dropzone";
import { useContext } from "react";
import { IconUpload } from "@tabler/icons-react";
import { saveAs } from 'file-saver';
import { Controller } from "../host/ctx/Controller";
import { Command } from "@ziltek/common/src/cmd/Command";
import { FilesystemCommand } from "@ziltek/common/src/cmd/FilesystemCommand";
import { importFromZip } from "../lib/ziltekConfigZip";
import { MaintenanceCommand } from "@ziltek/common/src/cmd/MaintenanceCommand";

export const DropzoneProvider = () => {
    const { processCommand } = useContext(Controller);
    
    return (
        <Dropzone.FullScreen
            onDrop={async (files) => {
                if(files.length == 1 && [
                    "application/x-zip-compressed",
                    "application/zip"
                ].includes(files[0].type)) {
                    const zip = files[0];
                    const { data, files: audios } = await importFromZip(await zip.arrayBuffer());
                    processCommand(Command.Maintenance(MaintenanceCommand.SetAllData(data)));
                    for(let { data, filename } of audios) {
                        processCommand(Command.Filesystem(FilesystemCommand.AddFile({
                            filename,
                            data,
                        })))
                    }
                } else {
                    for(let file of files) {
                        if(!file.type.startsWith("audio")) continue;
    
                        processCommand(Command.Filesystem(FilesystemCommand.AddFile({
                            filename: file.name,
                            data: await file.arrayBuffer(),
                        })))
                    }
                }
            }}
        >
            <Dropzone.Accept>
                <IconUpload />
            </Dropzone.Accept>
        </Dropzone.FullScreen>
    )
}

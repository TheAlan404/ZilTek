import { Data } from "@ziltek/common/src/data/Data";
import JSZip from "jszip";
import { deserialize } from "../host/ctx/DataFixer";

export type IOFile = {
    filename: string;
    data: ArrayBuffer;
};

export const exportToZip = async (
    data: Data,
    files: IOFile[],
) => {
    let zip = new JSZip();

    zip.file("db.json", JSON.stringify(data));

    let folder = zip.folder("audio");
    for(let file of files) {
        folder.file(file.filename, file.data);
    }

    return await zip.generateAsync({ type: "arraybuffer" });
};

export const importFromZip = async (file: ArrayBuffer) => {
    const zip = await JSZip.loadAsync(file);
    const files: IOFile[] = [];
    const data: Data = deserialize(await zip.file("db.json")?.async("string"));

    const folder = zip.folder("audio");
    for(let [filename, obj] of Object.entries(folder.files)) {
        files.push({
            filename,
            data: await obj.async("arraybuffer"),
        });
    }

    return {
        data,
        files,
    };
};

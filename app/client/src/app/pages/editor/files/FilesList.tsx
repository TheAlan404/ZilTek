import { Stack, Text, TextInput, Transition } from "@mantine/core";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { FilesystemContext } from "../../../../host/fs/FilesystemContext";
import { FileEntry } from "./FileEntry";

export const FilesList = () => {
    const { files } = useContext(FilesystemContext);

    const { t } = useTranslation();
    const [search, setSearch] = useState("");

    const list = files
        .filter((item) => item.filename.toLowerCase().includes(search.toLowerCase().trim()))
        .map((file) => (
            <FileEntry
                file={file}
                key={file.filename}
            />
        ));
    
    return (
        <Stack>
            <TextInput
                placeholder={t("files.search")}
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
            />
            <Transition mounted={!!search} transition="slide-down">
                {(styles) => (
                    <Text style={{ textAlign: "center", ...styles }}>
                        {t("files.searchResults", { count: list.length })}
                    </Text>
                )}
            </Transition>
            {list}
        </Stack>
    )
};

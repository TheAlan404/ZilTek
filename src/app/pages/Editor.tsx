import { useState } from "react";
import { EditorMainTab } from "./editor/EditorMainTab";
import { EditorFilesTab } from "./editor/EditorFilesTab";
import { EditorScheduleTab } from "./editor/EditorScheduleTab";
import { Tabs } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { EditorMelodies } from "./editor/EditorMelodies";
import { IconFileMusic, IconListDetails, IconMusic, IconSettings, IconSettings2 } from "@tabler/icons-react";

type Page = "main" | "files" | "schedule" | "melodies";

export const EditorPage = () => {
    let { t } = useTranslation();
    let [page, setPage] = useState<Page>("main");

    return (
        <Tabs value={page} onChange={setPage} inverted>
            <Tabs.List grow>
                <Tabs.Tab value="main" leftSection={<IconSettings />}>{t("editor.tabs.main")}</Tabs.Tab>
                <Tabs.Tab value="melodies" leftSection={<IconMusic />}>{t("editor.tabs.melodies")}</Tabs.Tab>
                <Tabs.Tab value="schedule" leftSection={<IconListDetails />}>{t("editor.tabs.schedule")}</Tabs.Tab>
                <Tabs.Tab value="files" leftSection={<IconFileMusic />}>{t("editor.tabs.files")}</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="main" p="md">
                <EditorMainTab />
            </Tabs.Panel>
            <Tabs.Panel value="files" p="md">
                <EditorFilesTab />
            </Tabs.Panel>
            <Tabs.Panel value="schedule" p="md">
                <EditorScheduleTab />
            </Tabs.Panel>
            <Tabs.Panel value="melodies" p="md">
                <EditorMelodies />
            </Tabs.Panel>
        </Tabs>
    );
};

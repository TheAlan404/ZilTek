import { ActionIcon, Tooltip } from "@mantine/core";
import { IconReload } from "@tabler/icons-react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { FilesystemContext } from "../../../host/fs/FilesystemContext";

export const FSRefreshButton = () => {
    const { refresh } = useContext(FilesystemContext);
    const { t } = useTranslation();

    return (
        <Tooltip label={t("files.refresh")} withArrow>
            <ActionIcon
                onClick={refresh}
                variant="subtle"
                color="gray">
                <IconReload />
            </ActionIcon>
        </Tooltip>
    )
}

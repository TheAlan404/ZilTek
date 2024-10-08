import { ActionIcon, Tooltip } from "@mantine/core";
import { IconReload } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export const ReloadButton = ({
    onClick,
}: {
    onClick: () => void,
}) => {
    const { t } = useTranslation();

    return (
        <Tooltip label={t("edit.reloadFiles")} withArrow>
            <ActionIcon
                onClick={onClick}
                variant="subtle"
                color="gray">
                <IconReload />
            </ActionIcon>
        </Tooltip>
    )
}
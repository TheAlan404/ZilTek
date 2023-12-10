import { useTranslation } from "react-i18next";
import { ActionIcon, Button, Tooltip } from "@mantine/core";
import useMobile from "../../../hooks/useMobile";
import { IconEdit, IconLayout } from "@tabler/icons-react";

export const PageChangeButton = ({
    currentPage,
    setCurrentPage,
    unsavedChanges,
}) => {
    const { t } = useTranslation();
    const mobile = useMobile();

    const buttonIcon = currentPage == "view" ? <IconEdit /> : <IconLayout />;
    const buttonProps = {
        onClick: () => setCurrentPage(p => p == "view" ? "edit" : "view"),
        variant: "light",
        color: currentPage == "view" ? "violet" : (
            unsavedChanges.length ? "yellow" : "violet"
        ),
    };
    
    return (
        <Tooltip disabled={!unsavedChanges.length} label={unsavedChanges.length && t("edit.unsavedChanges")}>
            {mobile ? (
                <ActionIcon {...buttonProps}>
                    {buttonIcon}
                </ActionIcon>
            ) : (
                <Button {...buttonProps} leftSection={buttonIcon}>
                    {currentPage == "view" ? t("menu.edit") : t("menu.view")}
                </Button>
            )}
        </Tooltip>
    );
}

import { useTranslation } from "react-i18next";
import { ActionIcon, Button, Text, Tooltip } from "@mantine/core";
import useMobile from "../../../hooks/useMobile";
import { IconEdit, IconLayout } from "@tabler/icons-react";
import { useContext } from "react";
import { ChangesContext } from "../../ChangesContext";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

export const PageChangeButton = ({
    currentPage,
    setCurrentPage,
}) => {
    const { unsavedChanges, ignoreAll } = useContext(ChangesContext);
    const { t } = useTranslation();
    const mobile = useMobile();

    const switchPage = () => setCurrentPage(p => p == "view" ? "edit" : "view");

    const buttonIcon = currentPage == "view" ? <IconEdit /> : <IconLayout />;
    const buttonProps = {
        onClick: () => {
            if(!unsavedChanges.length) {
                switchPage();
            } else {
                modals.openConfirmModal({
                    title: t("modals.unsavedChanges.title"),
                    children: (
                        <Text>{t("modals.unsavedChanges.content")}</Text>
                    ),
                    labels: {
                        confirm: t("modals.unsavedChanges.confirm"),
                        cancel: t("modals.cancel"),
                    },
                    confirmProps: { color: "red" },
                    onConfirm: () => {
                        notifications.show({
                            message: t("notif.changesIgnored"),
                            color: "yellow",
                        });
                        ignoreAll();
                        switchPage();
                    }
                });
            }
        },
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

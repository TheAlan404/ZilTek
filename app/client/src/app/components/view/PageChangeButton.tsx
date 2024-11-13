import { useTranslation } from "react-i18next";
import { ActionIcon, Button } from "@mantine/core";
import { IconEdit, IconLayout } from "@tabler/icons-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export const PageChangeButton = () => {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const { target } = useParams();
    const navigate = useNavigate();

    const path = pathname.split("/")[2] || "";

    const buttonIcon = path == "" ? <IconEdit /> : <IconLayout />;
    const buttonProps = {
        onClick: () => {
            navigate(path == "" ? `/${target}/editor` : `/${target}/`);
        },
        variant: "light",
        color: "violet",
    };
    
    return (
        <>
            <ActionIcon
                {...buttonProps}
                hiddenFrom="sm"
            >
                {buttonIcon}
            </ActionIcon>
            
            <Button {...buttonProps} leftSection={buttonIcon} visibleFrom="sm">
                {path == "" ? t("menu.edit") : t("menu.view")}
            </Button>
        </>
    );
}

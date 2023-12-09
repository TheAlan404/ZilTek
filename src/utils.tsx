import { notifications } from "@mantine/notifications"
import i18n from "./i18n"
import { IconAlertTriangle } from "@tabler/icons-react";

export const NotifyError = (e) => {
    const t = i18n.t;
    
    notifications.show({
        title: t("error"),
        message: e.toString(),
        icon: <IconAlertTriangle />,
        color: "red",
    });
}

import { notifications } from "@mantine/notifications"
import i18n from "./i18n"
import { IconAlertTriangle } from "@tabler/icons-react";

export const NotifyError = (e: string | Error) => {
    const t = i18n.t;

    console.log(e);
    
    notifications.show({
        title: t("error"),
        message: typeof e == "string" ? e : e.toString(),
        icon: <IconAlertTriangle />,
        color: "red",
    });
}

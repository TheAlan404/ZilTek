import { Matcher } from "@alan404/enum";
import { NotificationData, notifications } from "@mantine/notifications";
import { SystemNotification } from "@ziltek/common/src/SystemNotification";

export const notificationsStore: Matcher<SystemNotification, NotificationData> = {
    Custom: ({ message }) => ({
        message,
    }),
};

export const showNotification = (notif: SystemNotification) => {
    notifications.show(notificationsStore[notif.type](notif.data));
};

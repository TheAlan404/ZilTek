import { Enum } from "@alan404/enum";

export type SystemNotification = Enum<{
    Custom: { message: string };
}>;

export type SystemNotificationType = SystemNotification["type"];

import { notifications } from "@mantine/notifications";
import { ControllerData, DefaultData } from "./ControllerAPI";
import { t } from "i18next";
import { v4 } from "uuid";
import { Timetable } from "../lib/timetable";

export const serialize = (value: ControllerData): string => {
    return JSON.stringify({
        ...value,
        ver: 1,
    });
};

export const deserialize = (value: string): ControllerData => {
    let data = JSON.parse(value);

    if (data.ver == 1) return data;

    if (data.ver === 0) {
        const fixTable = (t): Timetable => t.map(row => row.map(col => ({
            value: col,
            variant: "idle",
        })));

        let d: ControllerData = {
            quickMelodies: data.melodies.custom || [],
            schedule: {
                type: "timetable",
                melodies: {
                    default: data.melodies.main || [],
                    overrides: [],
                },
                tables: {
                    default: fixTable(data.timetables.main || []),
                    days: ((data.timetables.overrides || []) as any[]).map(o => ({
                        isFullOverride: o.fullOverride ?? false,
                        data: fixTable(o.table),
                    })),
                },
            }
        };

        return d;
    }

    notifications.show({
        title: t("error"),
        message: t("errors.unknownDataVersion", { version: data.ver }),
    });

    return DefaultData;
};


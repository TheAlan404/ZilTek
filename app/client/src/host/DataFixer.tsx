import { notifications } from "@mantine/notifications";
import { DefaultData } from "./ControllerAPI";
import { t } from "i18next";
import { Data } from "@ziltek/common/src/types/data/Data";
import { Time } from "@ziltek/common/src/types/time";
import { Timetable } from "@ziltek/common/src/types/schedule/timetable/Timetable";
import { Melody } from "@ziltek/common/src/types/Melody";
import { Schedule } from "@ziltek/common/src/types/schedule/Schedule";
import { TimetableDay } from "@ziltek/common/src/types/schedule/timetable/TimetableDay";

export const serialize = (value: Data): string => {
    return JSON.stringify({
        ...value,
        ver: 2,
    });
};

export const deserialize = (value: string): Data => {
    let data = JSON.parse(value);

    if (data.ver == 2) {
        return data;
    };

    const strToMelody = (filename: string) => ({ filename } as Melody);
    const strArrToMelodyArr = (s?: string[]) => (s || []).map(strToMelody);

    if (data.ver == 1) {
        let d: Data = {
            quickMelodies: strArrToMelodyArr(data.quickMelodies),
            schedule: Schedule.Timetable({
                
            }),
        };

        return d;
    };

    if (data.ver === 0) {
        const fixTable = (t: [Time, Time, Time][]): Timetable => t.map((row) => row.map((col) => ({
            value: col as Time,
        }))) as Timetable;

        let d: Data = {
            quickMelodies: (data.melodies.custom || []).map((filename: string) => ({ filename } as Melody)),
            schedule: Schedule.Timetable({
                melodies: {
                    default: {
                        students: strToMelody(data.melodies.main[0]),
                        teachers: strToMelody(data.melodies.main[1]),
                        classEnd: strToMelody(data.melodies.main[2]),
                    },
                },

                tables: {
                    default: fixTable(data.timetables.main || []),
                    days: ((data.timetables.overrides || []) as any[]).map(o => ({
                        enabled: true,
                        isFullOverride: o.fullOverride ?? false,
                        table: fixTable(o.table),
                    } as TimetableDay)),
                },
            })
        };

        return d;
    }

    notifications.show({
        title: t("error"),
        message: t("errors.unknownDataVersion", { version: data.ver }),
    });

    return DefaultData;
};


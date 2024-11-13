import { notifications } from "@mantine/notifications";
import { t } from "i18next";
import { createData, Data } from "@ziltek/common/src/data/Data";
import { Melody } from "@ziltek/common/src/Melody";
import { Schedule } from "@ziltek/common/src/schedule/Schedule";
import { Timetable, TimetableRow } from "@ziltek/common/src/schedule/timetable/Timetable";
import { TimetableEntry } from "@ziltek/common/src/schedule/timetable/TimetableEntry";
import { TimetableDay } from "@ziltek/common/src/schedule/timetable/TimetableDay";
import { Time } from "@ziltek/common/src/Time";

export const serialize = (value: Data): string => {
    return JSON.stringify({
        ...value,
        ver: 2,
    });
};

export const deserialize = (value?: string): Data => {
    if(!value) return createData();
    
    let data = JSON.parse(value);

    if (data.ver == 2) {
        let d: Data = {
            ver: 2,
            quickMelodies: Array.isArray(data.quickMelodies) ? data.quickMelodies : [],
            schedule: data.schedule,
        };
        return d;
    };

    const strToMelody = (s: string | { filename: string }) => ({
        filename: typeof s == "string" ? s : s.filename,
    } as Melody);
    const strArrToMelodyArr = (l?: string[]) => (l || []).map(strToMelody);

    if (data.ver == 1) {
        const fixTable = (rows: any[]): Timetable => rows.map((row: any[]) => row.map((ent: { value: string }) => (
            ({ value }) as TimetableEntry
        )) as TimetableRow) as Timetable;

        let d: Data = {
            ver: 2,
            quickMelodies: strArrToMelodyArr(data.quickMelodies),
            schedule: Schedule.Timetable({
                melodies: {
                    default: {
                        students: strToMelody(data.schedule.melodies.default[0]),
                        teachers: strToMelody(data.schedule.melodies.default[1]),
                        classEnd: strToMelody(data.schedule.melodies.default[2]),
                    },
                },
                tables: {
                    default: fixTable(data.schedule.tables.default),
                    days: data.schedule.tables.days.map(({ isFullOverride, data }: {
                        isFullOverride: boolean;
                        data: Timetable;
                    }) => (
                        {
                            isLayered: !isFullOverride,
                            table: data,
                            enabled: true,
                        }
                    ) as TimetableDay)
                },
            }),
        };

        return d;
    };

    if (data.ver === 0) {
        const fixTable = (t: [Time, Time, Time][]): Timetable => t.map((row) => row.map((col) => ({
            value: col as Time,
        }))) as Timetable;

        let d: Data = {
            ver: 2,
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
                        isLayered: o.fullOverride ?? false,
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

    return createData();
};


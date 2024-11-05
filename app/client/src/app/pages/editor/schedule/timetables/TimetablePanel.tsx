import { ActionIcon, Button, Checkbox, closeOnEscape, Fieldset, Group, Select, Stack, Text, Tooltip } from "@mantine/core";
import { useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CommitableTimetable } from "../../../../components/schedule/CommitableTimetable";
import { IconPlaylistX, IconWand } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import useMobile from "../../../../../hooks/useMobile";
import { TimetableSchedule } from "@ziltek/common/src/schedule/timetable/TimetableSchedule";
import { createTimetableDay, TimetableDay } from "@ziltek/common/src/schedule/timetable/TimetableDay";
import { createTimetable, Timetable } from "@ziltek/common/src/schedule/timetable/Timetable";

type TableID = "default" | "0" | "1" | "2" | "3" | "4" | "5" | "6";

export const TimetablePanel = ({
    schedule,
    setSchedule,
}: {
    schedule: TimetableSchedule;
    setSchedule: (schedule: TimetableSchedule) => void;
}) => {
    const { t } = useTranslation();
    const isMobile = useMobile();

    const [tableId, setTableId] = useState<TableID>("default");

    const day = tableId == "default" ? undefined : (schedule.tables.days[Number(tableId)] || createTimetableDay());

    const tableIds = [
        {
            group: t("timetable.mainGroup"),
            items: [
                {
                    value: "default",
                    label: t("timetable.main")
                }
            ]
        },
        {
            group: t("timetable.overridesGroup"),
            items: (new Array(7).fill(0)
                .map((_, i) => ({
                    value: i.toString(),
                    label: t(`days.${i}`),
                })))
        }
    ];

    const clear = () => {
        updateTable(createTimetable());
    };

    const updateTable = (table: Timetable) => {
        let cloned = structuredClone(schedule);
        if (tableId == "default")
            cloned.tables.default = table;
        else {
            if (!cloned.tables.days[Number(tableId)])
                cloned.tables.days[Number(tableId)] = createTimetableDay();
            cloned.tables.days[Number(tableId)].table = table;
        }
        
        setSchedule(cloned);
    };

    const updateDay = (upsert: Partial<Omit<TimetableDay, "table">>) => {
        if (tableId == "default") return;
        let cloned = structuredClone(schedule);
        cloned.tables.days[Number(tableId)] = {
            ...cloned.tables.days[Number(tableId)],
            ...upsert,
        };
        setSchedule(cloned);
    };

    return (
        <Fieldset legend={t("timetable.tables")}>
            <Stack>
                <Group grow align="end" justify="space-between">
                    <Select
                        data={tableIds}
                        defaultValue="0"
                        allowDeselect={false}
                        value={tableId}
                        onChange={(v) => setTableId(v as TableID)}
                    />

                    <Group grow>
                        <Button
                            leftSection={<IconPlaylistX />}
                            color="red"
                            variant="light"
                            onClick={() => modals.openConfirmModal({
                                title: t("timetable.clear"),
                                children: <Text>{t("timetable.clearConfirmation")}</Text>,
                                confirmProps: { color: "red" },
                                onConfirm: clear,
                            })}
                        >
                            {t("timetable.clear")}
                        </Button>

                        <Button
                            leftSection={<IconWand />}
                            color="green"
                            variant="light"
                            onClick={() => modals.open({
                                title: t("timetableGenerator.title"),
                                // children: <TimetableGenerator
                                //     onAccept={(table) => setTable(table)}
                                // />,
                                fullScreen: isMobile,
                                size: isMobile ? undefined : "calc(100vw - 3rem)",
                            })}>
                            {t("timetable.generate")}
                        </Button>
                    </Group>
                </Group>

                {/* {tableId != "default" && (
                    <Checkbox
                        label={t("timetable.fullOverride")}
                        description={t("timetable.fullOverrideDesc")}
                        checked={day!.isFullOverride}
                        onChange={(e) => updateDay({
                            isFullOverride: e.currentTarget.checked
                        })}
                    />
                )} */}

                {tableId != "default" && (
                    <Checkbox
                        label={t("timetable.enabled")}
                        description={t("timetable.enabledDesc")}
                        checked={day!.enabled}
                        onChange={(e) => updateDay({
                            enabled: e.currentTarget.checked
                        })}
                    />
                )}

                <CommitableTimetable
                    key={tableId}
                    value={tableId == "default" ? schedule.tables.default : day!.table}
                    onChange={(t) => {
                        updateTable(t);
                    }}
                />
            </Stack>
        </Fieldset>
    );
};


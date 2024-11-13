import { ActionIcon, Button, Checkbox, closeOnEscape, Divider, Fieldset, Group, Select, SimpleGrid, Stack, Text, Tooltip } from "@mantine/core";
import { useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CommitableTimetable } from "../../../../components/schedule/CommitableTimetable";
import { IconCopy, IconPlaylistX, IconWand } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import useMobile from "../../../../../hooks/useMobile";
import { TimetableSchedule } from "@ziltek/common/src/schedule/timetable/TimetableSchedule";
import { createTimetableDay, TimetableDay } from "@ziltek/common/src/schedule/timetable/TimetableDay";
import { createTimetable, Timetable } from "@ziltek/common/src/schedule/timetable/Timetable";
import { useDisclosure } from "@mantine/hooks";
import { TimetableGenerator } from "./TimetableGenerator";

type TableID = "default" | "0" | "1" | "2" | "3" | "4" | "5" | "6";

export const TimetablePanel = ({
    schedule,
    setSchedule,
}: {
    schedule: TimetableSchedule;
    setSchedule: (schedule: TimetableSchedule) => void;
}) => {
    const { t, i18n } = useTranslation();
    const isMobile = useMobile();

    const [tableId, setTableId] = useState<TableID>("default");
    const [copyFromOpened, copyFromHandlers] = useDisclosure();

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
            items: [1, 2, 3, 4, 5, 6, 0]
                .map((i) => ({
                    value: "" + i,
                    label: new Date(0, 0, i).toLocaleString(i18n.resolvedLanguage, { weekday: "long" }),
                }))
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
                <Group justify="center" px="md">
                    <Select
                        w="100%"
                        data={tableIds}
                        defaultValue="0"
                        allowDeselect={false}
                        value={tableId}
                        onChange={(v) => setTableId(v as TableID)}
                    />
                </Group>

                <Divider
                    label={t("timetable.actions")}
                    w="100%"
                />

                <Stack px="md">
                    <SimpleGrid cols={{ base: 1, xs: 3 }}>
                        {copyFromOpened ? (
                            <Select
                                data={tableIds}
                                value={null}
                                onChange={(v) => modals.openConfirmModal({
                                    title: t("timetable.copyFrom"),
                                    children: <Text>{t("timetable.copyFromConfirmation")}</Text>,
                                    onConfirm: () => {
                                        let table = v == "default" ? schedule.tables.default : (
                                            schedule.tables.days[Number(v)]?.table || createTimetable()
                                        );

                                        console.log("Copying:", table, "to", tableId);

                                        updateTable(table);
                                    },
                                })}
                                leftSection={<IconCopy />}
                                placeholder={t("timetable.copyFrom")}
                                autoFocus
                                onBlur={copyFromHandlers.close}
                                dropdownOpened
                            />
                        ) : (
                            <Button
                                onClick={copyFromHandlers.open}
                                leftSection={<IconCopy />}
                                variant="light"
                                color="blue"
                            >
                                {t("timetable.copyFrom")}
                            </Button>
                        )}

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
                                title: t("timetable.generate"),
                                children: (
                                    <TimetableGenerator
                                        onAccept={(table) => updateTable(table)}
                                    />
                                ),
                                fullScreen: true,
                            })}>
                            {t("timetable.generate")}
                        </Button>
                    </SimpleGrid>

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
                </Stack>

                <Divider
                    label={t("timetable.table")}
                    w="100%"
                />

                <Stack px="md">
                    <CommitableTimetable
                        key={JSON.stringify(tableId == "default" ? schedule.tables.default : day!.table)}
                        value={tableId == "default" ? schedule.tables.default : day!.table}
                        onChange={(t) => {
                            updateTable(t);
                        }}
                    />
                </Stack>
            </Stack>
        </Fieldset>
    );
};


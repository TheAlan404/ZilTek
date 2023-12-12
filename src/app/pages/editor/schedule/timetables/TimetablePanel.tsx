import { ActionIcon, Button, Group, Select, Stack, Text, Tooltip } from "@mantine/core";
import { useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChangesContext } from "../../../../ChangesContext";
import { TimetableComponent } from "../../../../components/schedule/Timetable";
import { ControllerAPI, DefaultData, DefaultTimetable, DefaultTimetableDay } from "../../../../../host/ControllerAPI";
import { CommitableTimetable } from "../../../../components/schedule/CommitableTimetable";
import { IconPlaylistX, IconWand } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { TimetableGenerator } from "./TimetableGenerator";
import useMobile from "../../../../../hooks/useMobile";

export const TimetablePanel = () => {
    const { data, processCommand } = useContext(ControllerAPI);
    const { t } = useTranslation();
    const [tableIndex, setTableIndex] = useState("0");
    const { unsavedChanges } = useContext(ChangesContext);
    const isMobile = useMobile();
    
    const DAYS = useMemo(() => {
        return [
            {
                group: t("editor.sections.schedule.type.timetable.main"),
                items: [
                    {
                        value: "0",
                        label: t("editor.sections.schedule.type.timetable.mainTimetable")
                    }
                ]
            },
            {
                group: t("editor.sections.schedule.type.timetable.overrides"),
                items: (new Array(7).fill(0)
                    .map((_, i) => ({
                        value: (i+1).toString(),
                        label: t(`days.${i}`),
                    })))
            }
        ];
    }, [t]);

    const setTable = (table) => {
        console.log(`TimetablePanel -> onChange`, table);
        if (tableIndex == "0") {
            processCommand({
                type: "setMainTimetable",
                data: table,
            });
        } else {
            processCommand({
                type: "setTimetableDay",
                data: {
                    tableIndex: tableIndex-1,
                    tableData: table,
                },
            })
        }
    };

    return (
        <Stack>
            <Group justify="space-between">
                <Select
                    data={DAYS}
                    label={t("editor.sections.schedule.type.timetable.daySelect")}
                    defaultValue="0"
                    allowDeselect={false}
                    value={tableIndex}
                    onChange={(v) => setTableIndex(v)}
                    disabled={!!unsavedChanges.length}
                />
                <Group>
                    <Button
                        leftSection={<IconPlaylistX />}
                        color="red"
                        variant="light"
                        onClick={() => modals.openConfirmModal({
                            title: t("modals.clearTimetable.title"),
                            children: <Text>{t("modals.clearTimetable.content")}</Text>,
                            labels: {
                                confirm: t("modals.clearTimetable.confirm"),
                                cancel: t("modals.cancel"),
                            },
                            confirmProps: { color: "red" },
                            onConfirm() {
                                setTable(DefaultTimetable.slice());
                            },
                        })}
                    >
                        {t("editor.sections.schedule.type.timetable.clear")}
                    </Button>
                    <Button
                        leftSection={<IconWand />}
                        color="green"
                        variant="light"
                        onClick={() => modals.open({
                            title: t("timetableGenerator.title"),
                            children: <TimetableGenerator
                                onAccept={(table) => setTable(table)}
                            />,
                            fullScreen: isMobile,
                            size: isMobile ? undefined : "calc(100vw - 3rem)",
                        })}>
                        {t("editor.sections.schedule.type.timetable.generate")}
                    </Button>
                </Group>
            </Group>
            {tableIndex != 0 && <>
                
            </>}
            <CommitableTimetable
                value={(data.schedule.type == "timetable" && (
                    tableIndex == 0
                    ? data.schedule.tables.default
                    : (data.schedule.tables.days[Number(tableIndex)-1] || DefaultTimetableDay).data)) || DefaultTimetable}
                onChange={setTable}
            />
        </Stack>
    );
};


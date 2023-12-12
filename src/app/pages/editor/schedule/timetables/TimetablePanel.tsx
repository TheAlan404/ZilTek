import { Group, Select, Stack } from "@mantine/core";
import { useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChangesContext } from "../../../../ChangesContext";
import { TimetableComponent } from "../../../../components/schedule/Timetable";
import { ControllerAPI, DefaultData, DefaultTimetable, DefaultTimetableDay } from "../../../../../host/ControllerAPI";
import { CommitableTimetable } from "../../../../components/schedule/CommitableTimetable";

export const TimetablePanel = () => {
    const { data, processCommand } = useContext(ControllerAPI);
    const { t } = useTranslation();
    const [tableIndex, setTableIndex] = useState("0");
    const { unsavedChanges } = useContext(ChangesContext);
    
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
        return ;
    }, [t]);

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

                </Group>
            </Group>
            {tableIndex != 0 && <>
                
            </>}
            <CommitableTimetable
                value={(data.schedule.type == "timetable" && (
                    tableIndex == 0
                    ? data.schedule.tables.default
                    : (data.schedule.tables.days[Number(tableIndex)-1] || DefaultTimetableDay).data)) || DefaultTimetable}
                onChange={(table) => {
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
                }}
            />
        </Stack>
    );
};


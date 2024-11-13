import { useTranslation } from "react-i18next";
import { useState } from "react";
import { TimetableComponent } from "./TimetableComponent";
import { createTimetableRow, Timetable, TimetableRow } from "@ziltek/common/src/schedule/timetable/Timetable";
import { ActionIcon, Button, Group, Stack, Tooltip } from "@mantine/core";
import { useSet } from "@mantine/hooks";
import { IconClipboardCopy } from "@tabler/icons-react";

export const CommitableTimetable = ({
    value,
    onChange,
}: {
    value: Timetable;
    onChange: (t: Timetable) => void;
}) => {
    const { t } = useTranslation();
    const [table, setTable] = useState<Timetable>(value);
    const [dirty, setDirty] = useState(false);
    const invalids = useSet<string>();

    const addRow = (row: TimetableRow) => {
        setDirty(true);
        setTable(t => [...t, row]);
    };

    return (
        <Stack>
            <TimetableComponent
                value={table}
                invalids={invalids}
                onChange={(t) => {
                    setDirty(true);
                    setTable(t);
                }}
            />

            <Group justify="space-between">
                <Group>
                    <Button
                        variant="light"
                        onClick={() => addRow(createTimetableRow())}>
                        {t("timetable.newRow")}
                    </Button>
                    <Tooltip label={t("timetable.duplicateRow")}>
                        <ActionIcon variant="light" onClick={() => {
                            let lastRow = value[value.length - 1];
                            addRow(structuredClone(lastRow));
                        }}>
                            <IconClipboardCopy />
                        </ActionIcon>
                    </Tooltip>
                </Group>

                <Group>
                    <Button
                        disabled={!dirty || !!invalids.size}
                        color="gray"
                        onClick={() => {
                            setDirty(false);
                            setTable(value);
                        }}
                    >
                        {t("cancel")}
                    </Button>

                    <Button
                        disabled={!dirty || !!invalids.size}
                        color="green"
                        onClick={() => {
                            setDirty(false);
                            onChange(table);
                        }}
                    >
                        {t("save")}
                    </Button>
                </Group>
            </Group>
        </Stack>
    );
}

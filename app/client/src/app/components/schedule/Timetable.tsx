import { ActionIcon, Button, CloseButton, Group, Stack, Table, TableData, Text, Tooltip } from "@mantine/core"
import { useTranslation } from "react-i18next"
import { TimeBox } from "./TimeBox";
import { Time } from "@ziltek/common/src/Time";
import { IconClipboardCopy } from "@tabler/icons-react";
import { createTimetableRow, Timetable, TimetableRow } from "@ziltek/common/src/schedule/timetable/Timetable";
import { applyListAction, ListAction } from "@ziltek/common/src/ListAction";

export interface TimetableProps {
    value: Timetable;
    onChange?: (value: Timetable) => void;
}

export const TimetableComponent = ({
    value,
    onChange,
}: TimetableProps) => {
    const { t } = useTranslation();

    const set = (x: number, y: number, v: Time) => {
        onChange?.(value.map((row, x2) => (
            row.map((cell, y2) => (
                (x == x2 && y == y2) ? { ...cell, value: v } : cell
            )) as TimetableRow
        )));
    };

    const removeColumn = (x: number) => {
        onChange?.(applyListAction(value, ListAction<TimetableRow>().Remove(x)));
    };

    const addRow = (row: TimetableRow) => {
        onChange?.([...value, row]);
    };

    const table: TableData = {
        head: [
            ...([
                t("bells.student"),
                t("bells.teacher"),
                t("bells.classEnd"),
            ]),
            ...(!!onChange ? [
                "_",
            ] : []),
        ],
        body: value.map((tup, x) => (
            [
                ...tup.map((item, y) => (
                    <TimeBox
                        key={`${x}-${y}`}
                        value={item.value}
                        onChange={!!onChange ? ((v) => {
                            set(x, y, v);
                        }) : undefined}
                    />
                )),
                ...(!!onChange ? [
                    <CloseButton
                        key={`remove-${x}`}
                        onClick={() => removeColumn(x)}
                    />
                ] : [])
            ]
        )),
    };

    return (
        <Stack>
            <Table w="100%" data={table} />
            {!value.length && <Text style={{ textAlign: "center" }}>{t("edit.noRows")}</Text>}
            {!!onChange && (
                <Group justify="space-between">
                    <Group>
                        <Button
                            variant="light"
                            onClick={() => addRow(createTimetableRow())}>
                            {t("edit.newRow")}
                        </Button>
                        <Tooltip label={t("edit.duplicateRow")}>
                            <ActionIcon variant="light" onClick={() => {
                                let lastRow = value[value.length-1];
                                addRow(structuredClone(lastRow));
                            }}>
                                <IconClipboardCopy />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Group>
            )}
        </Stack>
    )
}

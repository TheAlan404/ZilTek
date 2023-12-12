import { ActionIcon, Button, CloseButton, Group, Stack, Table, TableData, Text, Tooltip } from "@mantine/core"
import { DefaultTuple, Timetable, Tuple } from "../../../lib/timetable"
import { useTranslation } from "react-i18next"
import { TimeBox } from "./TimeBox";
import { useContext, useEffect, useState } from "react";
import { ChangesContext } from "../../ChangesContext";
import { Time } from "../../../lib/time";
import { notifications } from "@mantine/notifications";
import { IconClipboardCopy, IconRowInsertBottom } from "@tabler/icons-react";

export interface TimetableProps {
    value: Timetable,
    onChange: (x: number, y: number, value: string) => void,
    removeColumn: (x: number) => void,
    addRow: (row: Tuple | null) => void,
    onSave: () => void,
    onRevert: () => void,
    canRevert: boolean,
    canSave: boolean,
    variant: "readonly" | "editor",
}

export const TimetableComponent = ({
    value,
    variant = "readonly",
    onChange,
    removeColumn,
    addRow,
    onSave,
    onRevert,
    canRevert,
    canSave,
}: TimetableProps) => {
    const { t } = useTranslation();

    const table: TableData = {
        head: [
            ...([
                t("bells.student"),
                t("bells.teacher"),
                t("bells.classEnd"),
            ]),
            ...(variant == "editor" ? [
                "_",
            ] : []),
        ],
        body: value.map((tup, x) => (
            [
                ...tup.map((item, y) => (
                    <TimeBox
                        key={`${x}-${y}`}
                        value={item.value}
                        variant={item.variant}
                        readonly={variant == "readonly"}
                        onChange={(v) => {
                            onChange(x, y, v);
                        }}
                    />
                )),
                ...(variant == "editor" ? [
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
            {variant == "editor" && (
                <Group justify="space-between">
                    <Group>
                        <Button
                            variant="light"
                            onClick={() => addRow(DefaultTuple())}>
                            {t("edit.newRow")}
                        </Button>
                        <Tooltip label={t("edit.duplicateRow")}>
                            <ActionIcon variant="light" onClick={() => {
                                let lastRow = value[value.length-1];
                                addRow(lastRow.slice());
                            }}>
                                <IconClipboardCopy />
                            </ActionIcon>
                        </Tooltip>
                    </Group>

                    {canSave && <Text fw="bold">{t("edit.modified")}</Text>}

                    <Group>
                        <Button
                            color="red"
                            variant="light"
                            onClick={onRevert}
                            disabled={!canRevert}>
                            {t("edit.revert")}
                        </Button>
                        <Button
                            color="green"
                            variant="light"
                            onClick={onSave}
                            disabled={!canSave}>
                            {t("edit.save")}
                        </Button>
                    </Group>
                </Group>
            )}
        </Stack>
    )
}

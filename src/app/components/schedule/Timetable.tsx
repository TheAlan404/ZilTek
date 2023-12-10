import { Button, CloseButton, Group, Stack, Table, TableData, Text } from "@mantine/core"
import { DefaultTuple, Timetable } from "../../../lib/timetable"
import { useTranslation } from "react-i18next"
import { TimeBox } from "./TimeBox";
import { useContext, useEffect, useState } from "react";
import { ChangesContext } from "../../ChangesContext";
import { Time } from "../../../lib/time";
import { notifications } from "@mantine/notifications";

export interface TimetableProps {
    value: Timetable,
    onChange: (x: number, y: number, value: string) => void,
    removeColumn: (x: number) => void,
    addRow: () => void,
    onSave: () => void,
    onRevert: () => void,
    canRevert: boolean,
    canSave: boolean,
    variant: "readonly" | "editor",
}

export const CommitableTimetable = ({
    value,
    onChange,
}: {
    value: Timetable,
    onChange: (t: Timetable) => void,
}) => {
    const { t } = useTranslation();
    const { unsavedChanges, markAsDirty, markAsReverted, markAsSaved } = useContext(ChangesContext);
    const [table, setTable] = useState<Timetable>(value);
    const dirty = unsavedChanges.includes("timetable");

    useEffect(() => {
        if (!dirty) setTable(value);
    }, [value]);

    return (
        <TimetableComponent
            value={table}
            variant="editor"
            onChange={(x, y, v) => {
                if(!v) return;
                setTable(t => {
                    return t.map((row, rx) => (
                        rx == x ? (row.map((col, cy) => cy == y ? v : col)) : row
                    ))
                });
                markAsDirty("timetable");
            }}
            addRow={() => {
                setTable(t => [...t, DefaultTuple]);
                markAsDirty("timetable");
            }}
            onRevert={() => {
                setTable(value);
                markAsReverted("timetable");
                notifications.show({
                    message: t("edit.timetableReverted"),
                    color: "yellow",
                })
            }}
            onSave={() => {
                onChange(table);
                markAsSaved("timetable");
                notifications.show({
                    message: t("edit.timetableSaved"),
                    color: "green",
                })
            }}
            removeColumn={(x) => {
                setTable(t => t.filter((_, i) => i !== x));
                markAsDirty("timetable");
            }}
            canRevert={dirty}
            canSave={dirty}
        />
    );
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
                    <Button
						variant="light"
						onClick={addRow}>
						{t("edit.newRow")}
					</Button>

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

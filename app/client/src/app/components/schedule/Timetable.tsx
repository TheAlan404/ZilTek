import { ActionIcon, Box, Button, CloseButton, Group, Stack, Table, TableData, Text, Tooltip } from "@mantine/core"
import { useTranslation } from "react-i18next"
import { TimeBox } from "./TimeBox";
import { Time } from "@ziltek/common/src/Time";
import { IconClipboardCopy } from "@tabler/icons-react";
import { createTimetableRow, Timetable, TimetableRow } from "@ziltek/common/src/schedule/timetable/Timetable";
import { applyListAction, ListAction } from "@ziltek/common/src/ListAction";
import { BellType } from "@ziltek/common/src/schedule/timetable/BellType";

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
        const cloned = structuredClone(value);
        cloned[y][x] = {
            ...cloned[y][x],
            value: v,
        };
        onChange?.(cloned);
    };

    const removeRow = (y: number) => {
        onChange?.(applyListAction(value, ListAction<TimetableRow>().Remove(y)));
    };

    const addRow = (row: TimetableRow) => {
        onChange?.([...value, row]);
    };

    return (
        <Stack>
            <Stack>
                <Group grow>
                    {(["students", "teachers", "classEnd"] as BellType[]).map(type => (
                        <Text>
                            {t(`bells.${type}`)}
                        </Text>
                    ))}
                    <Box />
                </Group>

                {value.map((row, y) => (
                    <Group
                        key={y}
                        grow
                    >
                        {row.map((cell, x) => (
                            <Box
                                key={x}
                            >
                                <TimeBox
                                    value={cell.value}
                                    onChange={!!onChange ? ((v) => {
                                        set(x, y, v);
                                    }) : undefined}
                                />
                            </Box>
                        ))}

                        {!!onChange && (
                            <CloseButton
                                onClick={() => removeRow(y)}
                            />
                        )}
                    </Group>
                ))}
            </Stack>


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

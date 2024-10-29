import { ActionIcon, Box, Button, CloseButton, Group, SimpleGrid, Stack, Table, TableData, Text, Tooltip } from "@mantine/core"
import { useTranslation } from "react-i18next"
import { TimeBox } from "./TimeBox";
import { Time } from "@ziltek/common/src/Time";
import { IconClipboardCopy } from "@tabler/icons-react";
import { createTimetableRow, Timetable, TimetableRow } from "@ziltek/common/src/schedule/timetable/Timetable";
import { applyListAction, ListAction } from "@ziltek/common/src/ListAction";
import { BellType } from "@ziltek/common/src/schedule/timetable/BellType";
import { useSet } from "@mantine/hooks";

export const TimetableComponent = ({
    value,
    onChange,
    invalids = new Set(),
}: {
    value: Timetable;
    onChange?: (value: Timetable) => void;
    invalids?: Set<string>;
}) => {
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
        invalids.delete(`${y}-0`);
        invalids.delete(`${y}-1`);
        invalids.delete(`${y}-2`);
        onChange?.(applyListAction(value, ListAction<TimetableRow>().Remove(y)));
    };

    const addRow = (row: TimetableRow) => {
        onChange?.([...value, row]);
    };

    return (
        <Stack>
            <Stack align="center">
                <Group flex="1">
                    {(["students", "teachers", "classEnd"] as BellType[]).map(type => (
                        <Text
                            key={type}
                            fz="xs"
                            w="6em"
                            ta="center"
                            style={{ textWrap: "nowrap", overflow: "clip" }}
                        >
                            {t(`bells.${type}`)}
                        </Text>
                    ))}
                    <Box style={{ marginInlineStart: "auto" }} w={onChange ? "1.75rem" : "0px"} />
                </Group>

                {value.map((row, y) => (
                    <Group
                        key={y}
                        flex="1"
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
                                    onValidityChange={(valid) => {
                                        const key = `${y}-${x}`;
                                        if(valid) {
                                            invalids.delete(key);
                                        } else {
                                            invalids.add(key);
                                        }
                                    }}
                                />
                            </Box>
                        ))}

                        {!!onChange && (
                            <CloseButton
                                style={{ marginInlineStart: "auto" }}
                                onClick={() => removeRow(y)}
                            />
                        )}
                    </Group>
                ))}
            </Stack>

            {!value.length && <Text style={{ textAlign: "center" }}>{t("edit.noRows")}</Text>}
        </Stack>
    )
}

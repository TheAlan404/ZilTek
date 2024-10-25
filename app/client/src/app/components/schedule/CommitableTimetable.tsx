import { useTranslation } from "react-i18next";
import { useState } from "react";
import { TimetableComponent } from "./Timetable";
import { Timetable } from "@ziltek/common/src/schedule/timetable/Timetable";
import { Button, Group, Stack } from "@mantine/core";

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

    return (
        <Stack>
            <TimetableComponent
                value={table}
                onChange={(t) => {
                    setDirty(true);
                    setTable(t);
                }}
            />

            <Group>
                <Button
                    disabled={!dirty}
                    color="gray"
                    onClick={() => {
                        setDirty(false);
                        setTable(value);
                    }}
                >
                    {""}
                </Button>

                <Button
                    disabled={!dirty}
                    color="green"
                    onClick={() => {
                        setDirty(false);
                        onChange(table);
                    }}
                >
                    {""}
                </Button>
            </Group>
        </Stack>
    );
}

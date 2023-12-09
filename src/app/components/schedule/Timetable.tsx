import { CloseButton, Table, TableData } from "@mantine/core"
import { Timetable } from "../../../lib/timetable"
import { useTranslation } from "react-i18next"
import { TimeBox } from "./TimeBox";

export interface TimetableProps {
    value: Timetable,
    onChange: (x: number, y: number, value: Date) => void,
    removeColumn: (x: number) => void,
    variant: "readonly" | "editor",
}

export const TimetableComponent = ({
    value,
    variant = "readonly",
    onChange,
    removeColumn,
}: TimetableProps) => {
    const { t } = useTranslation();

    const table: TableData = {
        head: [
            ...([
                t("timetable.table.students"),
                t("timetable.table.teachers"),
                t("timetable.table.classEnd"),
            ]),
            ...(variant == "editor" ? [
                "",
            ] : []),
        ],
        body: value.map((tup, x) => (
            [
                ...tup.map((item, y) => (
                    <TimeBox
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
                        onClick={() => removeColumn(x)}
                    />
                ] : [])
            ]
        )),
    };

    return (
        <Table data={table} />
    )
}

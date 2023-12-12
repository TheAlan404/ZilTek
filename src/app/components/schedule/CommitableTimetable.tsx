import { useTranslation } from "react-i18next";
import { DefaultTuple, Timetable } from "../../../lib/timetable";
import { useContext, useEffect, useState } from "react";
import { ChangesContext } from "../../ChangesContext";
import { TimetableComponent } from "./Timetable";

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
        setTable(value);
    }, [value]);

    return (
        <TimetableComponent
            value={table}
            variant="editor"
            onChange={(x, y, v) => {
                if(!v) return;
                setTable(t => t.map((row, rx) => (
                        rx == x
                            ? (row.map(
                                (col, cy) => (cy == y
                                    ? ({
                                        value: v,
                                        variant: "idle",
                                    })
                                    : (col)
                                )
                            ))
                            : row
                    )));
                markAsDirty("timetable");
            }}
            addRow={(row) => {
                setTable(t => [...t, row || DefaultTuple]);
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

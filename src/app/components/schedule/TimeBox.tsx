import { TimeInput } from "@mantine/dates";
import { useUncontrolled } from "@mantine/hooks";
import { Time } from "../../../lib/time";
import { TextInput, Tooltip } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { Entry, TimeBoxVariant } from "../../../lib/timetable";

interface TimeBoxProps {
    value: Date,
    readonly: boolean,
    onChange: (v: Date) => void,
    variant: TimeBoxVariant,
}

export const TimeBox = ({
    value: _value,
    onChange: handleChange,
    readonly,
    variant = "idle",
}: TimeBoxProps) => {
    const { t } = useTranslation();
    let [value, onChange] = useUncontrolled({
        value: _value,
        finalValue: Time(),
        onChange: handleChange,
    });

    let c;
    if(variant == "playing") c = "violet";
    if(variant == "suspended") c = "red";

    let m;
    if(variant == "playing") m = "timebox.playing";
    if(variant == "suspended") m = "timebox.suspended";

    return (
        <TimeInput
            value={value}
            onChange={(e) => !readonly && onChange(e.currentTarget.value)}
            bg={c}
        />
    );
};

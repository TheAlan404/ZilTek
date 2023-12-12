import { TimeInput } from "@mantine/dates";
import { useUncontrolled } from "@mantine/hooks";
import { Time } from "../../../lib/time";
import { TextInput, Tooltip } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { Entry, TimeBoxVariant } from "../../../lib/timetable";

import { IMaskInput, IMask } from 'react-imask';

interface TimeBoxProps {
    value: Date,
    readonly: boolean,
    onChange: (v: Date) => void,
    variant: TimeBoxVariant,
    label: string | null,
    description: string | null,
}

export const TimeBox = ({
    value,
    onChange,
    readonly,
    variant = "idle",
    label,
    description,
}: TimeBoxProps) => {
    const { t } = useTranslation();

    let c;
    if(variant == "playing") c = "violet";
    if(variant == "suspended") c = "red";

    let m;
    if(variant == "playing") m = "timebox.playing";
    if(variant == "suspended") m = "timebox.suspended";

    return (
        <TextInput
            value={value}
            bg={c}
            style={{
                pointerEvents: readonly && "none",
            }}
            label={label}
            description={description}
            
            onAccept={(v) => !readonly && v !== value && onChange(v)}
            component={IMaskInput}
            mask="h:m"
            blocks={{
                h: {
                    mask: IMask.MaskedRange,
                    from: 0,
                    to: 24,
                    maxLength: 2,
                },
                m: {
                    mask: IMask.MaskedRange,
                    from: 0,
                    to: 60,
                    maxLength: 2,
                },
            }}
        />
    );
};

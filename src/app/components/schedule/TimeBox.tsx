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
    w: string | null,
}

export const TimeBox = ({
    value,
    onChange,
    readonly,
    variant = "idle",
    label,
    description,
    w,
}: TimeBoxProps) => {
    const { t } = useTranslation();

    let c;
    if(variant == "playing") c = "var(--mantine-color-violet-outline)";
    if(variant == "played") c = "var(--mantine-color-blue-outline)";
    if(variant == "suspended") c = "var(--mantine-color-red-outline)";
    if(variant == "interrupted") c = "var(--mantine-color-yellow-outline)";
    let bigOutline = variant == "playing";

    let m;
    if(variant == "playing") m = "timebox.playing";
    if(variant == "suspended") m = "timebox.suspended";

    return (
        <TextInput
            w={w}
            value={value}
            style={{
                pointerEvents: readonly && "none",
                outline: c && `${bigOutline ? "0.3em" : "0.1em"} solid ${c}`,
                borderRadius: "0.1em",
                outlineOffset: "0.2em",
            }}
            label={label}
            description={description}
            inputContainer={(children) => (
                <Tooltip label={m || ""} disabled={!m}>
                    {children}
                </Tooltip>
            )}
            
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

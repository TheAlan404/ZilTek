import { Time } from "@ziltek/common/src/Time";
import { Box, Group, Input, TextInput, Tooltip } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IMaskInput, IMask } from 'react-imask';
import { TimeState } from "@ziltek/common/src/state/TimeState";
import { useContext, useEffect, useState } from "react";
import { Controller } from "../../../host/ControllerAPI";

type Styling = {
    tooltip?: false | string;
    outlineColor?: string;
    outlineThickness?: string;
};

export const TimeBox = ({
    value,
    onChange,
    onValidityChange,
    disabled,
}: {
    value: Time;
    onChange?: (t: Time) => void;
    onValidityChange?: (valid: boolean) => void;
    disabled?: boolean;
}) => {
    const [intermediate, setIntermediate] = useState<string>(value);
    const { timeStates } = useContext(Controller);
    const { t } = useTranslation();

    useEffect(() => setIntermediate(value), [value]);
    useEffect(() => onValidityChange?.(intermediate === value), [intermediate]);

    const state = onChange ? undefined : timeStates[value];

    const styling: Styling = onChange ? ({
        outlineColor: intermediate !== value ? "red" : null,
        tooltip: intermediate !== value ? "invalid" : false,
    }) : ({
        playing: { outlineColor: "blue" },
        failed: { outlineColor: "red" },
        muted: { outlineColor: "red" },
        played: { outlineColor: "green" },
        stopped: { outlineColor: "yellow" },
        idle: { tooltip: false },
    } as Record<TimeState | "idle", Styling>)[state || "idle"];
    
    const outline = styling.outlineColor && `${styling.outlineThickness || "0.1em"} solid var(--mantine-color-${styling.outlineColor}-outline)`;
    const tooltipText: string | null = styling.tooltip === false ? null : t(`timebox.${styling.tooltip || state}`);

    return (
        <Tooltip label={tooltipText || ""} disabled={!tooltipText} withArrow>
            <Group justify="center">
                <Input.Wrapper
                    error={intermediate !== value}    
                >
                    <Input
                        value={intermediate}
                        disabled={disabled}
                        variant="filled"
                        styles={{
                            input: {
                                width: "5em",
                                height: "1em",
                                fontFamily: "var(--mantine-font-family-monospace)",
                            },
                        }}
                        style={{
                            pointerEvents: !onChange ? "none" : "unset",
                            outline,
                            borderRadius: "0.2em",
                            //outlineOffset: "0.2em",
                        }}
                        onFocus={(e) => e.currentTarget.select()}

                        component={IMaskInput}
                        {...{
                            onAccept: (s: string) => setIntermediate(s),
                            onComplete: (v: Time) => onChange?.(v),
                            mask: "h:m",
                            blocks: {
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
                            },
                        } as any}
                    />
                </Input.Wrapper>
            </Group>
        </Tooltip>
    );
};

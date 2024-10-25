import { Time } from "@ziltek/common/src/Time";
import { Box, Group, Input, TextInput, Tooltip } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IMaskInput, IMask } from 'react-imask';
import { TimeState } from "@ziltek/common/src/state/TimeState";
import { useContext, useEffect, useState } from "react";
import { Controller } from "../../../host/ControllerAPI";
import { IconLetterC } from "@tabler/icons-react";

export interface TimeBoxProps {
    value: Time;
    onChange?: (t: Time) => void;
}

export const TimeBox = ({
    value,
    onChange,
}: TimeBoxProps) => {
    const [intermediate, setIntermediate] = useState<string>(value);
    const { timeStates } = useContext(Controller);
    const { t } = useTranslation();

    //useEffect(() => setIntermediate(value), [value]);

    const state = onChange ? undefined : timeStates[value];

    let c = ({
        playing: "green",
        played: "blue",
        muted: "red",
        failed: "red",
        stopped: "yellow",
        "": "",
    } as Record<TimeState | "", string>)[state || ""];
    if(intermediate !== value) c = "dark";

    const color = `var(--mantine-color-${c}-outline)`;

    let tooltip: string | undefined;
    if (state == "playing") tooltip = t("timebox.playing");
    if (state == "muted") tooltip = t("timebox.suspended");

    const outline = color && `${state == "playing" ? "0.3em" : "0.1em"} solid ${color}`;

    return (
        <Tooltip label={tooltip || ""} disabled={!tooltip}>
            <Group justify="center">
                <Input.Wrapper
                    error={intermediate !== value}    
                >
                    <Input
                        value={intermediate}
                        variant="filled"
                        styles={{
                            input: {
                                width: "5em",
                                height: "1em",
                            },
                        }}
                        style={{
                            pointerEvents: !onChange ? "none" : "unset",
                            outline,
                            borderRadius: "0.1em",
                            outlineOffset: "0.2em",
                            "--input-font-family": "var(--mantine-font-family-monospace)",
                        }}

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

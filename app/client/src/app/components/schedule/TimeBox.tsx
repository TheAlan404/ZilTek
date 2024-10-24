import { Time } from "@ziltek/common/src/Time";
import { TextInput, Tooltip } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IMaskInput, IMask } from 'react-imask';
import { TimeState } from "@ziltek/common/src/state/TimeState";
import { useContext } from "react";
import { Controller } from "../../../host/ControllerAPI";

export interface TimeBoxProps {
    value: Time;
    onChange?: (t: Time) => void;
}

export const TimeBox = ({
    value,
    onChange,
}: TimeBoxProps) => {
    const { timeStates } = useContext(Controller);
    const { t } = useTranslation();

    const state = onChange ? undefined : timeStates[value];

    const c = ({
        playing: "green",
        played: "blue",
        muted: "red",
        failed: "red",
        stopped: "yellow",
        "": "",
    } as Record<TimeState | "", string>)[state || ""];

    const color = `var(--mantine-color-${c}-outline)`;

    let tooltip: string | undefined;
    if(state == "playing") tooltip = t("timebox.playing");
    if(state == "muted") tooltip = t("timebox.suspended");

    const outline = color && `${state == "playing" ? "0.3em" : "0.1em"} solid ${color}`;

    return (
        <TextInput
            value={value}
            ff="monospace"
            w="6em"
            style={{
                pointerEvents: !onChange ? "none" : "unset",
                outline,
                borderRadius: "0.1em",
                outlineOffset: "0.2em",
            }}

            inputContainer={(children) => (
                <Tooltip label={tooltip || ""} disabled={!tooltip}>
                    {children}
                </Tooltip>
            )}
            
            component={IMaskInput}
            {...{
                onAccept: (v: Time) => onChange?.(v),
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
            }}
        />
    );
};

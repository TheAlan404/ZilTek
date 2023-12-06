import { TimeInput } from "@mantine/dates";
import { useUncontrolled } from "@mantine/hooks";
import { Time } from "../../lib/time";
import { TextInput, Tooltip } from "@mantine/core";
import { useTranslation } from "react-i18next";

export const TimeBox = ({
    value: _value,
    defaultValue,
    onChange: handleChange,
    readonly,
    variant = "idle",
}) => {
    const { t } = useTranslation();
    let [value, onChange] = useUncontrolled({
        value: _value,
        defaultValue,
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
        <TextInput
            value={value}
            onChange={(e) => !readonly && onChange(e.currentTarget.value)}
            bg={c}
            inputContainer={m ? (({ children }) => (
                <Tooltip label={m}>
                    {children}
                </Tooltip>
            )) : ({ children }) => (
                <>{children}</>
            )}
        />
    );
};

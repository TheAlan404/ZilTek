import { useTranslation } from "react-i18next";
import { Button, Group, Input, Select, Text } from "@mantine/core";
import { Melody } from "@ziltek/common/src/Melody";
import { modals } from "@mantine/modals";
import { IconMusic, IconSelector } from "@tabler/icons-react";
import { MelodySelectModal } from "./MelodySelectModal";
import { randomId } from "@mantine/hooks";
import { secondsPretty } from "./melodySelectUtils";

export const MelodySelect = ({
    value,
    onChange,
}: {
    value: Melody;
    onChange: (m: Melody) => void;
}) => {
    const { t } = useTranslation();

    const onClick = () => {
        const modalId = randomId();
        console.debug(`Opening modal: ${modalId}`);
        modals.open({
            modalId,
            title: t("melodySelect.title"),
            children: (
                <MelodySelectModal
                    value={value}
                    onChange={(m) => {
                        modals.close(modalId);
                        onChange(m);
                    }}
                />
            )
        });
    };

    return (
        <Input
            w="100%"
            component="button"
            pointer
            leftSection={<IconMusic />}
            rightSection={<IconSelector />}
            onClick={onClick}
        >
            <Group>
                <Text ff="monospace">{value.filename}</Text>
                <Text>
                    {!!value.startTime && !!value.endTime && secondsPretty(value.endTime - value.startTime)}
                </Text>
            </Group>
        </Input>
    );
}

import { useContext } from "react";
import { Controller } from "../../../../host/ControllerAPI";
import { Button, CloseButton, Fieldset, Group, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { MelodySelect } from "../../../components/editor/MelodySelect";
import { Command } from "@ziltek/common/src/cmd/Command";
import { MelodyCommand } from "@ziltek/common/src/cmd/MelodyCommand";
import { ListAction } from "@ziltek/common/src/ListAction";
import { createMelody, Melody } from "@ziltek/common/src/Melody";
import { IconPlus } from "@tabler/icons-react";

export const QuickMelodiesSection = () => {
    const { data, processCommand } = useContext(Controller);
    const [t] = useTranslation();

    return (
        <Fieldset legend={t("editor.sections.quickMelodies.title")} w="100%">
            <Group justify="space-between" wrap="nowrap">
                <Text>{t("editor.sections.quickMelodies.desc")}</Text>
            </Group>
            <Stack p="md" py="xl">
                {data.quickMelodies.map((melody, index) => (
                    <Group justify="space-between" key={index} wrap="nowrap">
                        <MelodySelect
                            value={melody}
                            onChange={(value) => {
                                processCommand(Command.Melody(MelodyCommand.EditQuickMelodies(ListAction<Melody>().Modify({
                                    index,
                                    value,
                                }))));
                            }}
                        />
                        <CloseButton
                            onClick={() => {
                                processCommand(Command.Melody(MelodyCommand.EditQuickMelodies(ListAction<Melody>().Remove(index))));
                            }}
                        />
                    </Group>
                ))}
                <Button
                    variant="light"
                    leftSection={<IconPlus />}
                    color="green"
                    onClick={() => {
                        processCommand(Command.Melody(MelodyCommand.EditQuickMelodies(ListAction<Melody>().Add(createMelody()))));
                    }}
                >
                    {t("editor.sections.quickMelodies.add")}
                </Button>
            </Stack>
        </Fieldset>
    )
};

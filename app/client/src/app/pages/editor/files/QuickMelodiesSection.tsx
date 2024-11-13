import { useContext } from "react";
import { Controller } from "../../../../host/ctx/Controller";
import { Button, CloseButton, Fieldset, Group, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { MelodySelect } from "../../../components/editor/MelodySelect";
import { Command } from "@ziltek/common/src/cmd/Command";
import { MelodyCommand } from "@ziltek/common/src/cmd/MelodyCommand";
import { ListAction } from "@ziltek/common/src/ListAction";
import { createMelody, Melody } from "@ziltek/common/src/Melody";
import { IconPlus } from "@tabler/icons-react";
import { randomId } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { MelodySelectModal } from "../../../components/editor/MelodySelectModal";

export const QuickMelodiesSection = () => {
    const { data, processCommand } = useContext(Controller);
    const [t] = useTranslation();

    return (
        <Fieldset legend={t("quickMelodies.title")} w="100%">
            <Group justify="space-between" wrap="nowrap">
                <Text>{t("quickMelodies.desc")}</Text>
            </Group>
            <Stack p="md" py="xl">
                {data.quickMelodies.map((melody, index) => (
                    <Group flex="1" w="100%" key={index} wrap="nowrap">
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
                            style={{ marginInlineStart: "auto" }}
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
                        const modalId = randomId();
                        console.debug(`Opening modal: ${modalId}`);
                        modals.open({
                            modalId,
                            title: t("melodySelect.title"),
                            children: (
                                <MelodySelectModal
                                    value={createMelody()}
                                    onChange={(m) => {
                                        modals.close(modalId);
                                        processCommand(Command.Melody(MelodyCommand.EditQuickMelodies(ListAction<Melody>().Add(m))));
                                    }}
                                />
                            )
                        });
                    }}
                >
                    {t("quickMelodies.add")}
                </Button>
            </Stack>
        </Fieldset>
    )
};

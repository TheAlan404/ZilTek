import { ActionIcon, Button, Center, CloseButton, Fieldset, Flex, Group, Select, SimpleGrid, Stack, Table, Text, Tooltip } from "@mantine/core";
import { ReactNode, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ControllerAPI, StoredFile } from "../../../host/ControllerAPI";
import { IconPlus, IconReload } from "@tabler/icons-react";
import { ReloadButton } from "../../components/editor/ReloadButton";
import { MelodySelect } from "../../components/editor/MelodySelect";

export const EditorMelodies = () => {
    const { t } = useTranslation();
    const {
        data,
        fileHandlers,
        processCommand,
    } = useContext(ControllerAPI);

    const [files, setFiles] = useState([]);

    const reloadFiles = async () => {
        let allFiles = await fileHandlers.getAllFiles();
        setFiles(allFiles);
    };

    useEffect(() => {
        reloadFiles();
    }, []);
    
    return (
        <SimpleGrid cols={{ base: 1, md: 2 }}>
            <Fieldset legend={t("editor.sections.melodies.title")}>
                <Group justify="space-between" wrap="nowrap">
                    <Text>{t("editor.sections.melodies.desc")}</Text>
                    <ReloadButton onClick={reloadFiles} />
                </Group>
                {data.schedule.type == "timetable" ? (
                    <SimpleGrid py="xl" cols={{ base: 1, md: 3 }}>
                        {["student", "teacher", "classEnd"].map((type, index) => (
                            <MelodySelect
                                key={type}
                                label={<Text>{t(`bells.${type}`)}</Text>}
                                files={files}
                                value={data.schedule.type == "timetable" && data.schedule.melodies.default[index]}
                                onChange={(filename) => {
                                    processCommand({
                                        type: "setDefaultMelody",
                                        data: { index, filename }
                                    });
                                }}
                            />
                        ))}
                    </SimpleGrid>
                ) : (
                    "TODO"
                )}
            </Fieldset>
            <Fieldset legend={t("editor.sections.quickMelodies.title")}>
                <Group justify="space-between" wrap="nowrap">
                    <Text>{t("editor.sections.quickMelodies.desc")}</Text>
                    <ReloadButton onClick={reloadFiles} />
                </Group>
                <Stack p="md" py="xl">
                    {data.quickMelodies.map((melody, index) => (
                        <Group justify="space-between" key={index} wrap="nowrap">
                            <MelodySelect
                                files={files}
                                value={melody.filename}
                                onChange={(v) => {
                                    processCommand({
                                        type: "setQuickMelody",
                                        data: { filename: v, index },
                                    })
                                }}
                            />
                            <CloseButton
                                onClick={() => {
                                    processCommand({
                                        type: "removeQuickMelody",
                                        data: { index },
                                    })
                                }}
                            />
                        </Group>
                    ))}
                    <Button
                        variant="light"
                        leftSection={<IconPlus />}
                        color="green"
                        onClick={() => {
                            processCommand({
                                type: "addQuickMelody"
                            });
                        }}
                    >
                        {t("editor.sections.quickMelodies.add")}
                    </Button>
                </Stack>
            </Fieldset>
        </SimpleGrid>
    );
}

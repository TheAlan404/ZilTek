import { useContext } from "react"
import { Controller } from "../../../host/ControllerAPI"
import { Flex, Group, Paper, SegmentedControl, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import useMobile from "../../../hooks/useMobile";
import { TimetablePanel } from "./schedule/timetables/TimetablePanel";

export const EditorScheduleTab = () => {
    const { processCommand, data } = useContext(Controller);
    const { t } = useTranslation();
    const isMobile = useMobile();

    return (
        <Flex justify="center" pb="xl" mb="xl">
            <Flex w={isMobile ? "100%" : "50%"}>
                <Stack w="100%">
                    <Paper withBorder p="md" w="100%">
                        <Stack>
                            <Group justify="space-between">
                                <Text>{t("editor.sections.schedule.type.switch")}</Text>
                                <SegmentedControl
                                    disabled
                                    value={data.schedule.type}
                                    data={[
                                        { value: "timetable", label: t("editor.sections.schedule.type.timetable.name") },
                                        { value: "zones", label: t("editor.sections.schedule.type.zones.name") },
                                    ]}
                                />
                            </Group>
                        </Stack>
                    </Paper>
                    <Paper withBorder p="md" w="100%">
                        {data.schedule.type == "timetable" ? <TimetablePanel /> : "TODO"}
                    </Paper>
                </Stack>
            </Flex>
        </Flex>
    )
}

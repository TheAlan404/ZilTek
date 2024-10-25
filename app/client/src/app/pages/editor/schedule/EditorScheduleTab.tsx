import { ReactNode, useContext } from "react"
import { Controller } from "../../../../host/ControllerAPI"
import { Flex, Group, Paper, SegmentedControl, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import useMobile from "../../../../hooks/useMobile";
import { TimetablePanel } from "./timetables/TimetablePanel";
import { match } from "@alan404/enum";
import { Schedule } from "@ziltek/common/src/schedule/Schedule";
import { Command } from "@ziltek/common/src/cmd/Command";
import { ScheduleCommand } from "@ziltek/common/src/cmd/ScheduleCommand";
import { TimetableSchedule } from "@ziltek/common/src/schedule/timetable/TimetableSchedule";
import { TimetableMelodies } from "./timetables/TimetableMelodies";

export const EditorScheduleTab = () => {
    const { processCommand, data } = useContext(Controller);
    const { t } = useTranslation();
    const isMobile = useMobile();

    return (
        <Flex justify="center" pb="xl" mb="xl" mt="md">
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
                    
                    {match<Schedule, ReactNode>(data.schedule)({
                        Timetable: (schedule) => {
                            const setSchedule = (sched: TimetableSchedule) => processCommand(Command.Schedule(ScheduleCommand.SetSchedule(
                                Schedule.Timetable(sched)
                            )));

                            return (
                                <Stack>
                                    <TimetablePanel
                                        schedule={schedule}
                                        setSchedule={setSchedule}
                                    />

                                    <TimetableMelodies
                                        schedule={schedule}
                                        setSchedule={setSchedule}
                                    />
                                </Stack>
                            )
                        },
                        Zones: () => (
                            <></>
                        ),
                    })}
                </Stack>
            </Flex>
        </Flex>
    )
}

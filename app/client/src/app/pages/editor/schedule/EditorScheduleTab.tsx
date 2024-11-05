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

    return (
        <Flex justify="center" pb="xl" mb="xl" mt="md">
            <Flex w={{ base: "100%", md: "50%" }}>
                <Stack w="100%">
                    <Paper withBorder p="md" w="100%">
                        <Stack>
                            <Group justify="space-between">
                                <Text>{t("schedule.type")}</Text>
                                <SegmentedControl
                                    disabled
                                    value={data.schedule.type}
                                    data={[
                                        { value: "timetable", label: t("schedule.timetables") },
                                        { value: "zones", label: t("schedule.zones") },
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
                                    <TimetableMelodies
                                        schedule={schedule}
                                        setSchedule={setSchedule}
                                    />

                                    <TimetablePanel
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

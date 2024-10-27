import { Group, Paper, Progress, Stack, Text } from "@mantine/core"
import { useContext, useState } from "react";
import { Time, TimeFromDate, TimeUtil } from "@ziltek/common/src/Time";
import { useTranslation } from "react-i18next";
import { Controller } from "../../../host/ControllerAPI";
import { TimeBox } from "../../components/schedule/TimeBox";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useDate } from "../../../hooks/useClock";
import { computeTimings, Schedule } from "@ziltek/common/src/schedule/Schedule";

const pad = (v: number) => v.toString().padStart(2, "0");

const getNextPrev = (schedule: Schedule) => {
    const timings = Object.keys(computeTimings(schedule, new Date().getDay())) as Time[];
    
    const mins = (t: Time) => {
        let [h, m] = t.split(":").map(Number);
        return h*60+m;
    };

    const needle = mins(TimeFromDate(new Date()));

    let prev = timings.find((x) => mins(x) > needle);
    let next = timings.find((x) => mins(x) < needle);

    return [next, prev];
}

const toSecs = (d: Date) =>
    (d.getHours() * 60 * 60) + (d.getMinutes() * 60) + (d.getSeconds());

const getProgressBetween = (prev: Time, next: Time) => {
    let a = TimeUtil.toDate(prev);
    let b = TimeUtil.toDate(next);

    let current = toSecs(new Date());
    let x = toSecs(a);
    let y = toSecs(b);

    let len = y - x;
    let progressed = current - x;

    return (progressed / len) * 100;
}

export const ClockSection = () => {
    const { t, i18n: { language } } = useTranslation();
    const { data } = useContext(Controller);
    const [date, setDate] = useState(new Date());

    useDate((d) => setDate(d));

    let [next, prev] = getNextPrev(data.schedule);

    let noBells = !next && !prev;

    return (
        <Stack>
            <Stack gap={0}>
                <Group justify="space-between">
                    <Text>
                        {[
                            date.getDate(),
                            " ",
                            t(`months.${date.getMonth()}`),
                            ", ",
                            t(`days.${date.getDay()}`),
                        ].join("")}
                    </Text>
                    <Text c="dimmed" inline>
                        {date.getFullYear()}
                    </Text>
                </Group>

                <Text c="violet" fz="4em" w="100%" ta="center">
                    {TimeFromDate(date)}:{pad(date.getSeconds())}
                </Text>

                <Progress
                    color="violet"
                    value={(date.getSeconds() / 60) * 100}
                />
            </Stack>
            <Stack>
                {false && (
                    <Paper withBorder p="md">
                        <Group wrap="nowrap">
                            <IconAlertTriangle />
                            <Stack gap="0">
                                <Text>{t(`errors.pleaseUploadFiles`)}</Text>
                                <Text c="dimmed">{t(`errors.pleaseUploadFilesDesc`)}</Text>
                            </Stack>
                        </Group>
                    </Paper>
                )}
                {false && (
                    <Paper withBorder p="md">
                        <Group wrap="nowrap">
                            <IconAlertTriangle />
                            <Stack gap="0">
                                <Text>{t(`errors.pleaseSetMelodies`)}</Text>
                                <Text c="dimmed">{t(`errors.pleaseSetMelodiesDesc`)}</Text>
                            </Stack>
                        </Group>
                    </Paper>
                )}
                {!false && noBells && (
                    <Paper withBorder p="md" ta="center">
                        <Text c="dimmed" fs="italic">{t(`view.noBells`)}</Text>
                    </Paper>
                )}
                {prev && next && (
                    <Paper withBorder p="md">
                        <Stack>
                            <Stack gap={0}>
                                <Group justify="space-between" wrap="nowrap">
                                    <Text>{t(`view.prevBell`)}</Text>
                                    <Text>{t(`view.nextBell`)}</Text>
                                </Group>
                                <Group justify="space-between" grow={false} wrap="nowrap">
                                    <TimeBox
                                        value={prev}
                                    />
                                    <Text c="dimmed">
                                        {TimeUtil.relativeString(prev, language)}
                                    </Text>
                                    <Text c="dimmed" ta="right">
                                        {TimeUtil.relativeString(next, language)}
                                    </Text>
                                    <TimeBox
                                        value={next}
                                    />
                                </Group>
                            </Stack>
                            <Progress
                                value={getProgressBetween(prev, next)}
                                color="violet"
                            />
                        </Stack>
                    </Paper>
                )}
                {next && !prev && (
                    <Paper withBorder p="md">
                        <Group justify="space-between" grow wrap="nowrap">
                            <Text>{t(`view.nextBell`)}</Text>
                            <TimeBox
                                value={next}
                            />
                            <Text c="dimmed">
                                {TimeUtil.relativeString(next, language)}
                            </Text>
                        </Group>
                    </Paper>
                )}
                {prev && !next && (
                    <Paper withBorder p="md">
                        <Group justify="space-between" grow wrap="nowrap">
                            <Text c="dimmed">{t(`view.prevBell`)}</Text>
                            <TimeBox
                                value={prev}
                            />
                            <Text c="dimmed">
                                {TimeUtil.relativeString(prev, language)}
                            </Text>
                        </Group>
                    </Paper>
                )}
            </Stack>
        </Stack>
    )
}

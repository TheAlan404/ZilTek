import { Group, Paper, Progress, Stack, Text } from "@mantine/core"
import { useContext, useState } from "react";
import { Time, TimeUtil } from "@ziltek/common/src/Time";
import { useTranslation } from "react-i18next";
import { Controller } from "../../../host/ControllerAPI";
import { TimeBox } from "../../components/schedule/TimeBox";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useDate } from "../../../hooks/useClock";
import { computeTimings, Schedule } from "@ziltek/common/src/schedule/Schedule";

const pad = (v: number) => v.toString().padStart(2, "0");

const getNextPrev = (schedule: Schedule) => {
    const timings = (Object.keys(computeTimings(schedule, new Date().getDay())) as Time[])
        .sort((a, b) => mins(a) - mins(b));

    const needle = mins(TimeUtil.fromDate(new Date()));

    let prev = timings.findLast((x) => mins(x) <= needle);
    let next = timings.find((x) => mins(x) > needle);

    return [next, prev];
}

const mins = (t: Time) => {
    let [h, m] = t.split(":").map(Number);
    return (h*60)+m;
};

const toSecs = (d: Date) =>
    (d.getHours() * 60 * 60) + (d.getMinutes() * 60) + (d.getSeconds());

const getProgressBetween = (prev: Time, next: Time) => {
    let prevSecs = toSecs(TimeUtil.toDate(prev));
    let nextSecs = toSecs(TimeUtil.toDate(next));
    let currentSecs = toSecs(new Date());

    let len = nextSecs - prevSecs;
    let progressed = nextSecs - currentSecs;

    return (progressed / len) * 100;
}

export const ClockSection = () => {
    const { t, i18n: { resolvedLanguage } } = useTranslation();
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
                        {date.toLocaleString(resolvedLanguage, {
                            month: "long",
                            weekday: "long",
                            day: "numeric",
                        })}
                    </Text>
                    <Text c="dimmed" inline>
                        {date.getFullYear()}
                    </Text>
                </Group>

                <Text c="violet" fz="4em" w="100%" ta="center">
                    {TimeUtil.fromDate(date)}:{pad(date.getSeconds())}
                </Text>

                <Progress
                    color="violet"
                    value={(date.getSeconds() / 60) * 100}
                />
            </Stack>
            <Stack>
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
                                        {TimeUtil.relativeString(prev, resolvedLanguage)}
                                    </Text>
                                    <Text c="dimmed" ta="right">
                                        {TimeUtil.relativeString(next, resolvedLanguage)}
                                    </Text>
                                    <TimeBox
                                        value={next}
                                    />
                                </Group>
                            </Stack>
                            <Progress
                                value={getProgressBetween(next, prev)}
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
                                {TimeUtil.relativeString(next, resolvedLanguage)}
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
                                {TimeUtil.relativeString(prev, resolvedLanguage)}
                            </Text>
                        </Group>
                    </Paper>
                )}
            </Stack>
        </Stack>
    )
}

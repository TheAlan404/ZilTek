import { Group, Paper, Progress, Stack, Text } from "@mantine/core"
import { useInterval } from "@mantine/hooks"
import { useCallback, useContext, useEffect, useState } from "react";
import { Time, TimeToDate, formatRelative } from "../../../lib/time";
import { useTranslation } from "react-i18next";
import { ControllerAPI } from "../../../host/ControllerAPI";
import { TimeBox } from "../../components/schedule/TimeBox";
import { Entry, Timetable } from "../../../lib/timetable";
import { renderTimetableWithVariants } from "./ScheduleSection";
import { IconAlertTriangle } from "@tabler/icons-react";

const pad = (v: number) => v.toString().padStart(2, "0");

const getNextPrev = (table: Timetable) => {
    let t = Time(new Date());

    let flattened = table.flat().filter(x => x.value !== "00:00");
    
    let prev = flattened[0];
    let next = flattened[0];

    for(let entry of flattened) {
        if(TimeToDate(next.value) <= TimeToDate(t)) {
            prev = next;
            next = entry;
        }
    }

    return [next, prev];
}

export const ClockSection = () => {
    const { t, i18n: { language } } = useTranslation();
    const { renderedSchedule, logs, currentlyPlayingBell, files, data } = useContext(ControllerAPI);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [progressSec, setProgressSec] = useState(0);
    const [progressMin, setProgressMin] = useState(0);
    const [progressHr, setProgressHr] = useState(0);

    const update = useCallback(() => {
        let d = new Date();
        setDate([
            d.getDate(),
            " ",
            t(`months.${d.getMonth()}`),
            ", ",
            t(`days.${d.getDay()}`),
        ].join(""));

        setTime(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);

        setProgressSec((d.getSeconds() / 60) * 100);
        setProgressMin((d.getMinutes() / 60) * 100);
        setProgressHr((d.getHours() / 24) * 100);
    });
    const interval = useInterval(update, 1000);

    useEffect(() => {
        update();
        interval.start();
        return interval.stop;
    }, []);

    let [next, prev] = getNextPrev(renderTimetableWithVariants(renderedSchedule, logs, currentlyPlayingBell));

    let firstRender = date === "";
    let noBells = !next && !prev;
    let zeroFiles = !firstRender && Array.isArray(files) && !files.length;
    let unsetMelodies = !firstRender && Array.isArray(files) && (data.schedule.type == "timetable" ? (
        data.schedule.melodies.default.some(m => !files.some(f => f.filename == m))
    ) : (
        // TODO
        false
    ));

    let anyErrors = zeroFiles || unsetMelodies;

    return (
        <Stack>
            <Stack>
                <Group justify="space-between">
                    <Text>
                        {date}
                    </Text>
                    <Text c="dimmed" inline>
                        {new Date().getFullYear()}
                    </Text>
                </Group>

                <Text c="violet" fz="4em" w="100%">
                    {time}
                </Text>
                <Progress
                    color="violet"
                    value={progressSec}
                />
                <Progress
                    color="violet"
                    value={progressMin}
                />
                <Progress
                    color="violet"
                    value={progressHr}
                />
            </Stack>
            <Stack>
                {zeroFiles && (
                    <Paper withBorder p="md">
                        <Group wrap="nowrap">
                            <IconAlertTriangle />
                            <Stack>
                                <Text>{t(`errors.pleaseUploadFiles`)}</Text>
                                <Text c="dimmed">{t(`errors.pleaseUploadFilesDesc`)}</Text>
                            </Stack>
                        </Group>
                    </Paper>
                )}
                {unsetMelodies && (
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
                {!anyErrors && noBells && (
                    <Paper withBorder p="md" ta="center">
                        <Text c="dimmed" fs="italic">{t(`view.noBells`)}</Text>
                    </Paper>
                )}
                {next && (
                    <Paper withBorder p="md">
                        <Group justify="space-between" grow wrap="nowrap">
                            <Text>{t(`view.nextBell`)}</Text>
                            <TimeBox
                                {...next}
                                readonly
                            />
                            <Text c="dimmed">{formatRelative(language, next.value)}</Text>
                        </Group>
                    </Paper>
                )}
                {prev && (
                    <Paper withBorder p="md">
                        <Group justify="space-between" grow wrap="nowrap">
                            <Text c="dimmed">{t(`view.prevBell`)}</Text>
                            <TimeBox
                                {...prev}
                                readonly
                            />
                            <Text c="dimmed">{formatRelative(language, prev.value)}</Text>
                        </Group>
                    </Paper>
                )}
            </Stack>
        </Stack>
    )
}

import { Group, Paper, Progress, Stack, Text } from "@mantine/core"
import { useInterval } from "@mantine/hooks"
import { useCallback, useContext, useEffect, useState } from "react";
import { Time } from "../../../lib/time";
import { useTranslation } from "react-i18next";
import { ControllerAPI } from "../../../host/ControllerAPI";

const pad = (v) => v.toString().padStart(2, "0");

export const ClockSection = () => {
    const { t } = useTranslation();
    const { renderedSchedule, logs } = useContext(ControllerAPI);
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

    return (
        <Stack>
            <Stack>
                <Group justify="space-between">
                    <Text>
                        {date}
                    </Text>
                    <Text c="dark" inline>
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
                <Paper withBorder p="md">
                    {t("view.nextBell")}
                </Paper>
            </Stack>
        </Stack>
    )
}

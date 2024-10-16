import { ActionIcon, Button, Center, Code, Group, Loader, RangeSlider, Slider, Stack, Text } from "@mantine/core"
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next"
import { Controller, StoredFile } from "../../../../host/ControllerAPI";
import { IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { TimeBox } from "../../../components/schedule/TimeBox";

export const FileCutModal = ({
    file,
    onCut,
}: {
    file: StoredFile,
    onCut: (dur: [number, number]) => void,
}) => {
    const { t } = useTranslation();

    const [duration, setDuration] = useState(null);
    const [value, setValue] = useState([file.startTime || 0, file.endTime || 0]);
    const audioRef = useRef(new Audio());
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        audioRef.current.onloadedmetadata = () => {
            if(audioRef.current.duration === Infinity) {
                audioRef.current.currentTime = Number.MAX_SAFE_INTEGER;
                let temp = () => {
                    audioRef.current.removeEventListener("timeupdate", temp);
                    setDuration(Math.round(audioRef.current.duration));
                    setValue([file.startTime || 0, file.endTime || Math.round(audioRef.current.duration)]);
                    audioRef.current.currentTime = 0;
                };
                audioRef.current.addEventListener("timeupdate", temp);
            } else {
                setDuration(Math.round(audioRef.current.duration));
                setValue([file.startTime || 0, file.endTime || Math.round(audioRef.current.duration)]);
            }
        }

        let blob = file.data;
        audioRef.current.src = typeof blob === 'string' || blob instanceof String
            ? blob
            : URL.createObjectURL(blob);

        return () => {
            audioRef.current.pause();
        }
    }, []);

    useEffect(() => {
        audioRef.current.ontimeupdate = () => {
            setProgress(audioRef.current.currentTime);
            if(audioRef.current.currentTime > value[1]) {
                setPlaying(false);
            }
        }  
    }, [value[1]]);

    useEffect(() => {
        if (playing) {
            audioRef.current.currentTime = value[0];
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [playing, value[0]]);

    const label = (v) => {
        let s = v % 60;
        let m = Math.floor(v / 60);

        return [m, s]
            .map(x => x.toString().padStart(2, "0"))
            .join(":");
    };

    const labelToSecs = (l: string) => {
        let [m, s] = l.split(":");
        return ((Number(m) || 0) * 60) + (Number(s) || 0);
    };

    console.log(value)

    return (
        <Stack justify="space-between">
            {duration === null ? (
                <Center>
                    <Loader />
                    <Text>
                        {t("modals.cutFile.loading")}
                    </Text>
                </Center>
            ) : (
                <Stack>
                    <RangeSlider
                        defaultValue={[0, 0]}
                        value={value}
                        onChange={(v) => setValue(v)}
                        marks={playing && [{ value: progress }]}
                        thumbSize={14}
                        min={0}
                        max={duration}
                        minRange={1}
                        label={label}
                        py="xl"
                        my="xl"
                    />
                    <Stack>
                        <Group justify="space-between">
                            <Group>
                                <ActionIcon
                                    variant="light"
                                    color={playing ? "yellow" : "green"}
                                    onClick={() => setPlaying(p => !p)}
                                >
                                    {playing ? (
                                        <IconPlayerPause />
                                    ) : (
                                        <IconPlayerPlay />
                                    )}
                                </ActionIcon>
                                <Group>
                                    <TimeBox
                                        value={label(value[0])}
                                        onChange={(v) => setValue(([_, a]) => [labelToSecs(v), a])}
                                        w="5em"
                                    />
                                    <Text>{" - "}</Text>
                                    <TimeBox
                                        value={label(value[1])}
                                        onChange={(v) => setValue(([a, _]) => [a, labelToSecs(v)])}
                                        w="5em"
                                    />
                                </Group>
                            </Group>
                            <Group justify="center">
                                <Text>
                                    {t("modals.cutFile.duration")}
                                </Text>
                                <Code>
                                    {label(value[1] - value[0])}
                                </Code>
                            </Group>
                        </Group>
                        <Group justify="end">
                            <Button
                                variant="light"
                                color="gray"
                                onClick={() => modals.closeAll()}
                            >
                                {t("modals.cancel")}
                            </Button>
                            <Button
                                variant="light"
                                color="green"
                                onClick={() => onCut(value)}
                            >
                                {t("modals.cutFile.confirm")}
                            </Button>
                        </Group>
                    </Stack>
                </Stack>
            )}
        </Stack>
    )
}
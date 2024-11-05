import { Box, Button, Code, Divider, Group, LoadingOverlay, RangeSlider, Select, Stack, Text } from "@mantine/core";
import { Melody } from "@ziltek/common/src/Melody";
import { useContext, useEffect, useRef, useState } from "react";
import { useAudioPlayer } from "../../../hooks/useAudioPlayer";
import { FilesystemContext } from "../../../host/fs/FilesystemContext";
import { IconCheck, IconFileMusic, IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { TimeBox } from "../schedule/TimeBox";
import { getDuration, secondsPretty, secondsToTime, timeToSeconds } from "./melodySelectUtils";

export const MelodySelectModal = ({
    value: defaultValue,
    onChange,
    onCancel,
}: {
    value: Melody;
    onChange: (m: Melody) => void;
    onCancel?: () => void;
}) => {
    const [t] = useTranslation();
    const [melody, setMelody] = useState(defaultValue);
    const fs = useContext(FilesystemContext);
    const audioRef = useRef<HTMLAudioElement>(new Audio());
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState<ArrayBuffer | null>(null);
    const [duration, setDuration] = useState<number>(Infinity);
    const [error, setError] = useState<any>(null);
    const [play, setPlay] = useState(false);

    const melodyDuration = (melody.endTime || duration) - (melody.startTime || 0);

    useEffect(() => {
        setLoading(true);
        (async () => {
            let buffer = await fs.read(melody.filename);
            let dur = await getDuration(buffer, melody.filename);
            setFile(buffer);
            setDuration(dur);
            if(melody.endTime > dur) setMelody(m => ({ ...m, endTime: undefined }));
            setLoading(false);
        })();
    }, [melody.filename]);

    useEffect(() => {
        const source = URL.createObjectURL(new File([file], melody.filename))
        audioRef.current.src = source;
        return () => {
            audioRef.current.pause();
            setPlay(false);
            URL.revokeObjectURL(source);
        };
    }, [file]);

    useEffect(() => {
        const onUpdate = () => {
            setProgress(audioRef.current.currentTime);

            if (
                (audioRef.current.currentTime > (melody.endTime || Infinity))
                || (audioRef.current.currentTime < (melody.startTime || 0))
                || audioRef.current.ended
            ) {
                audioRef.current.currentTime = melody.startTime || 0;
            }
        };

        audioRef.current.addEventListener("timeupdate", onUpdate);
        audioRef.current.addEventListener("ended", onUpdate);

        return () => {
            audioRef.current.removeEventListener("timeupdate", onUpdate);
            audioRef.current.removeEventListener("ended", onUpdate);
        };
    }, [melody.startTime || 0, melody.endTime || duration]);

    useEffect(() => {
        if (play) {
            setError(null);
            audioRef.current.currentTime = melody.startTime || 0;
            audioRef.current.play().catch(setError);
        } else {
            audioRef.current.pause();
        }
    }, [play]);

    return (
        <Stack gap="lg">
            <Divider
                label={t("melodySelect.file")}
            />

            <Select
                disabled={!fs.isReady}
                data={fs.files.map(f => f.filename)}
                value={melody.filename}
                onChange={(filename) => setMelody(m => ({ ...m, filename }))}
                allowDeselect={false}
                searchable
                renderOption={({ checked, option: { value } }) => (
                    <Group flex="1" gap="xs">
                        <IconFileMusic />
                        <Text>{value}</Text>
                        {checked && <IconCheck style={{ marginInlineStart: 'auto' }} />}
                    </Group>
                )}
            />

            <Divider
                label={t("melodySelect.cut")}
            />

            <Stack pos="relative">
                <LoadingOverlay
                    visible={loading}
                />

                <Group grow>
                    <Text ta="center">
                        {t("fileDuration")}: <Code>{secondsPretty(duration)}</Code>
                    </Text>

                    <Text ta="center">
                        {t("melodyDuration")}: <Code>{secondsPretty(melodyDuration)}</Code>
                    </Text>
                </Group>

                <RangeSlider
                    disabled={loading}
                    defaultValue={[0, duration || 0]}
                    value={[
                        melody.startTime || 0,
                        melody.endTime || duration,
                    ]}
                    onChange={([startTime, endTime]: [number, number]) => setMelody(m => ({
                        ...m,
                        startTime,
                        endTime,
                    }))}
                    marks={(play && progress !== null) && [{ value: progress, label: secondsPretty(progress) }]}
                    thumbSize={14}
                    min={0}
                    max={duration}
                    minRange={2}
                    label={secondsPretty}
                    py="xl"
                    px="md"
                    bg="dark"
                    style={{ borderRadius: "var(--mantine-radius-md)" }}
                />

                <Group grow>
                    <Box>
                        <TimeBox
                            value={secondsToTime(melody.startTime || 0)}
                            onChange={(t) => {
                                let startTime = timeToSeconds(t);
                                if (startTime >= (melody.endTime || duration)) return;
                                setMelody(m => ({
                                    ...m,
                                    startTime,
                                }));
                            }}
                        />
                    </Box>
                    <Button
                        variant="light"
                        color={play ? "yellow" : "green"}
                        leftSection={play ? <IconPlayerPause /> : <IconPlayerPlay />}
                        onClick={() => setPlay(p => !p)}
                    >
                        {t(play ? "controls.stop" : "controls.play")}
                    </Button>
                    <Box>
                        <TimeBox
                            value={secondsToTime(melody.endTime || duration)}
                            onChange={(t) => {
                                let endTime = timeToSeconds(t);
                                if (endTime <= (melody.startTime || 0)) return;
                                setMelody(m => ({
                                    ...m,
                                    endTime,
                                }));
                            }}
                        />
                    </Box>
                </Group>
            </Stack>

            <Divider
            />

            <Group justify="end">
                <Button
                    variant="light"
                    color="gray"
                    onClick={() => onCancel ? onCancel() : onChange(defaultValue)}
                >
                    {t("modals.cancel")}
                </Button>
                <Button
                    variant="light"
                    color="green"
                    loading={loading}
                    onClick={() => onChange({
                        ...melody,
                        endTime: melody.endTime === duration ? undefined : melody.endTime,
                        startTime: melody.startTime === 0 ? undefined : melody.startTime,
                    })}
                >
                    {t("modals.confirm")}
                </Button>
            </Group>
        </Stack>
    )
};

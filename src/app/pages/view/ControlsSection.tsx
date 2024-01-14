import { Button, Divider, Group, SegmentedControl, Stack, Text } from "@mantine/core"
import { useContext } from "react";
import { useTranslation } from "react-i18next"
import { ControllerAPI } from "../../../host/ControllerAPI";
import { IconPlayerPause, IconPlayerPlay, IconPlayerStop } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";

export const ControlsSection = () => {
    const { isOn, processCommand, data } = useContext(ControllerAPI);
    const { t } = useTranslation();

    useHotkeys(new Array(10).fill(1).map((_,i)=>i).slice(1).map((i) => (
        [i.toString(), () => {
            let files = [
                null,
                ...(data.schedule.type == "timetable" ? (
                    data.schedule.melodies.default
                ) : []),
                ...data.quickMelodies,
            ];

            if(!files[i]) return;

            processCommand({
                type: "forcePlayAudio",
                data: {
                    filename: files[i],
                },
            })
        }]
    )));
    
    useHotkeys([
        ["q", () => processCommand({ type: "stopAllAudio" })],
        ["space", () => processCommand({ type: "stopAllAudio" })],
    ])

    return (
        <Stack align="end">
            <Group>
                <Text>{t("controls.bellStatus")}</Text>
                <SegmentedControl
                    value={isOn ? "on" : "off"}
                    onChange={(v) => {
                        processCommand({
                            type: "changeBellStatus",
                            data: {
                                on: v == "on",
                            }
                        })
                    }}
                    data={[
                        { value: "on", label: t("on") },
                        { value: "off", label: t("off") }
                    ]}
                    color={isOn ? "green" : "red"}
                />
            </Group>
            <Group>
                <Text>{t("controls.stopAudio")}</Text>
                <Button
                    variant="light"
                    size="compact-md"
                    color="red"
                    leftSection={<IconPlayerStop />}
                    onClick={() => processCommand({ type: "stopAllAudio" })}>
                    {t("controls.stopAudioButton")}
                </Button>
            </Group>
            <Divider w="100%" label={t("controls.playSection")} labelPosition="center" />
            {data.schedule.type == "timetable" ? (
                ["student", "teacher", "classEnd"].map((label, i) => (
                    <QuickMelody key={label} label={t(`bells.${label}`)} filename={data.schedule.type == "timetable" && data.schedule.melodies.default[i]} />
                ))
            ) : "TODO"}
            {!!data.quickMelodies.length && (
                <>
                    <Divider w="100%" label={t("controls.quickMelodies")} labelPosition="center" />
                    {data.quickMelodies.map((filename, i) => (
                        <QuickMelody key={i} filename={filename} />
                    ))}
                </>
            )}
        </Stack>
    )
}

const QuickMelody = ({ filename, label }) => {
    const {
        currentlyPlayingAudio,
        processCommand,
    } = useContext(ControllerAPI);
    const { t } = useTranslation();

    const isPlaying = filename === currentlyPlayingAudio;

    return (
        <Group>
            <Text>{label || filename}</Text>
            <Button
                leftSection={isPlaying ? <IconPlayerPause /> : <IconPlayerPlay />}
                variant="light"
                color={isPlaying ? "yellow" : "green"}
                size="compact-md"
                onClick={() => {
                    if (isPlaying) {
                        processCommand({ type: "stopAllAudio" })
                    } else {
                        processCommand({ type: "forcePlayAudio", data: { filename } });
                    }
                }}>
                {isPlaying ? t("controls.stop") : t("controls.play")}
            </Button>
        </Group>
    );
};

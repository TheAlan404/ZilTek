import { Button, Divider, Group, Kbd, SegmentedControl, Stack, Text, Tooltip } from "@mantine/core"
import React, { useContext } from "react";
import { useTranslation } from "react-i18next"
import { Controller } from "../../../host/ctx/Controller";
import { IconPlayerPause, IconPlayerPlay, IconPlayerStop } from "@tabler/icons-react";
import { HotkeyItem, useHotkeys } from "@mantine/hooks";
import { Command } from "@ziltek/common/src/cmd/Command";
import { match } from "@alan404/enum";
import { Melody } from "@ziltek/common/src/Melody";
import { Schedule } from "@ziltek/common/src/schedule/Schedule";
import { BellType } from "@ziltek/common/src/schedule/timetable/BellType";

export const ControlsSection = () => {
    const { audioState, processCommand, data } = useContext(Controller);
    const { t } = useTranslation();

    const scheduleMelodies: Melody[] = match<Schedule, Melody[]>(data.schedule)({
        Timetable: (schedule) => [
            schedule.melodies.default.students,
            schedule.melodies.default.teachers,
            schedule.melodies.default.classEnd,
        ],
        Zones: (): Melody[] => [],
    });

    const hotkeyMelodies: Melody[] = [
        ...scheduleMelodies,
        ...data.quickMelodies,
    ];

    useHotkeys(hotkeyMelodies.map((melody, i) => (
        [(i+1).toString(), () => {
            processCommand(Command.ForcePlayMelody(melody));
        }] as HotkeyItem
    )));
    
    useHotkeys([
        ["q", () => processCommand(Command.ForceStop())],
        ["space", () => processCommand(Command.ForceStop())],
    ])

    return (
        <Stack align="end">
            <Group>
                <Text>{t("controls.bellStatus")}</Text>
                <SegmentedControl
                    value={!audioState.muted ? "on" : "off"}
                    onChange={(v) => {
                        processCommand(Command.ToggleSystemEnabled(v === "on"));
                    }}
                    data={[
                        { value: "on", label: t("on") },
                        { value: "off", label: t("off") }
                    ]}
                    color={!audioState.muted ? "green" : "red"}
                />
            </Group>
            <Group>
                <Tooltip label={(
                    <Group><Kbd>Q</Kbd> / <Kbd>SPACE</Kbd></Group>
                )}>
                    <Text>{t("controls.stopAudio")}</Text>
                </Tooltip>
                <Button
                    variant="light"
                    size="compact-md"
                    color="red"
                    leftSection={<IconPlayerStop />}
                    onClick={() => processCommand(Command.ForceStop())}>
                    {t("controls.stopAudioButton")}
                </Button>
            </Group>

            <Divider w="100%" label={t("controls.playSection")} labelPosition="center" />

            {match<Schedule, React.ReactNode>(data.schedule)({
                Timetable: (schedule) => (
                    (["students", "teachers", "classEnd"] as BellType[]).map((type, i) => (
                        <QuickMelody
                            key={type}
                            label={t(`bells.${type}`)}
                            melody={schedule.melodies.default[type]}
                            kbd={(i+1).toString()}
                        />
                    ))
                ),
                Zones: () => <></>,
            })}
            
            {!!data.quickMelodies.length && (
                <>
                    <Divider w="100%" label={t("controls.quickMelodies")} labelPosition="center" />
                    {data.quickMelodies.map((melody, i) => (
                        <QuickMelody
                            key={i}
                            melody={melody}
                            kbd={(i+1+scheduleMelodies.length).toString()}
                        />
                    ))}
                </>
            )}
        </Stack>
    )
}

const QuickMelody = ({
    melody,
    kbd,
    label,
}: {
    melody: Melody;
    kbd?: string;
    label?: string;
}) => {
    const {
        processCommand,
        audioState,
    } = useContext(Controller);
    const { t } = useTranslation();

    const isPlaying = melody.filename === audioState.currentlyPlaying;

    return (
        <Group>
            <Tooltip label={<Kbd>{kbd}</Kbd>} disabled={!kbd}>
                <Text>{label || melody.filename}</Text>
            </Tooltip>
            <Button
                leftSection={isPlaying ? <IconPlayerPause /> : <IconPlayerPlay />}
                variant="light"
                color={isPlaying ? "yellow" : "green"}
                disabled={!melody}
                size="compact-md"
                onClick={() => {
                    if (isPlaying) {
                        processCommand(Command.ForceStop())
                    } else {
                        processCommand(Command.ForcePlayMelody(melody));
                    }
                }}>
                {isPlaying ? t("controls.stop") : t("controls.play")}
            </Button>
        </Group>
    );
};

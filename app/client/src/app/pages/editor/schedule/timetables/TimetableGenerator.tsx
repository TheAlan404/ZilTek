import { ActionIcon, Button, Fieldset, Group, NumberInput, Paper, ScrollArea, Select, SimpleGrid, Stack, Text, Title, Tooltip } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { TimeBox } from "../../../../components/schedule/TimeBox";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { TimetableComponent } from "../../../../components/schedule/Timetable";
import { Timetable, Tuple } from "../../../../../lib/timetable";
import { AddMinutesToTime, SubtractMinuesFromTime, Time } from "@ziltek/common/src/Time";
import { modals } from "@mantine/modals";

export type TimetableGenSegment = ({
    type: "startTime",
    startTime: string,
} | {
    type: "offset",
    offset: number
}) & ({
    classCount: number,
    classDuration: number,
    breakDuration: number,
    studentBellOffset: number,
});

const GeneratorPresets: TimetableGenSegment[][] = [
    [
        { type: "startTime", startTime: Time(9, 0), classDuration: 30, breakDuration: 10, classCount: 6 },
    ],
    [
        { type: "startTime", startTime: Time(8, 50), classDuration: 40, breakDuration: 10, classCount: 5, studentBellOffset: 2 },
        { type: "offset", offset: 50, classDuration: 40, breakDuration: 10, classCount: 3, studentBellOffset: 2 },
    ]
];

const generateTimetable = (segments: TimetableGenSegment[]) => {
    let table: Timetable = [];
    let currentTime = Time(0, 0);
    segments.forEach(segment => {
        if (segment.type == "startTime")
            currentTime = segment.startTime;
        else if (segment.type == "offset")
            currentTime = AddMinutesToTime(currentTime, segment.offset || 0);

        for (let i = 0; i < segment.classCount; i++) {
            let tuple: Tuple = [];
            if (segment.studentBellOffset) {
                tuple.push({
                    value: SubtractMinuesFromTime(currentTime, segment.studentBellOffset || 0),
                    variant: "idle",
                });
            } else {
                tuple.push({
                    value: Time(0, 0),
                    variant: "idle",
                });
            }
            tuple.push({
                value: currentTime,
                variant: "idle",
            });
            currentTime = AddMinutesToTime(currentTime, segment.classDuration || 0);
            tuple.push({
                value: currentTime,
                variant: "idle",
            });
            if (i < segment.classCount - 1) {
                currentTime = AddMinutesToTime(currentTime, segment.breakDuration || 0);
            };

            table.push(tuple);
        }
    });

    console.log(table);

    return table;
};

export const TimetableGenerator = ({
    onAccept,
}: {
    onAccept: () => void,
}) => {
    let { t } = useTranslation();
    let [segments, setSegments] = useState<TimetableGenSegment[]>([
        {
            type: "startTime",
            startTime: "09:00",
            breakDuration: 10,
            classCount: 1,
            classDuration: 40,
            studentBellOffset: 0,
        }
    ]);

    let elements = [];

    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
    }

    return (
        <Stack>
            <Paper withBorder p="md">

            </Paper>

            <Group justify="start">
                <Button variant="light" color="red" onClick={() => setSegments([])}>
                    {t("timetableGenerator.clear")}
                </Button>
                {GeneratorPresets.map((preset, i) => (
                    <Button key={i} variant="light" onClick={() => setSegments(preset.slice())}>
                        {t("timetableGenerator.preset", { index: i+1 })}
                    </Button>
                ))}
            </Group>

            <SimpleGrid cols={{ base: 1, md: 2 }}>
                <ScrollArea.Autosize mah="100%">
                    <Stack>
                        {segments.map((segment, i) => (
                            <TimetableGeneratorSegment
                                value={segment}
                                index={i}
                                onRemove={() => setSegments(segs => segs.filter((_, idx) => idx !== i))}
                                onChange={(v) => setSegments(segs => segs.map((seg, idx) => idx == i ? v : seg))}
                                key={i}
                            />
                        ))}

                        <Button
                            fullWidth
                            variant="light"
                            color="green"
                            leftSection={<IconPlus />}
                            onClick={() => {
                                setSegments(s => [
                                    ...s,
                                    {
                                        type: "offset",
                                        offset: 0,
                                        breakDuration: 10,
                                        classDuration: 40,
                                        classCount: 1,
                                        studentBellOffset: 0,
                                    }
                                ]);
                            }}
                        >
                            {t("timetableGenerator.addSegment")}
                        </Button>
                    </Stack>
                </ScrollArea.Autosize>
                <Stack>
                    <Title order={3}>{t("timetableGenerator.preview")}</Title>
                    <TimetableComponent value={generateTimetable(segments)} />
                </Stack>
            </SimpleGrid>

            <Group justify="end">
                <Button color="gray" variant="light" onClick={() => modals.closeAll()}>
                    {t("timetableGenerator.cancel")}
                </Button>
                <Button variant="light" onClick={() => {
                    onAccept(generateTimetable(segments));
                    modals.closeAll();
                }}>
                    {t("timetableGenerator.save")}
                </Button>
            </Group>
        </Stack>
    );
}

export const TimetableGeneratorSegment = ({
    value,
    onChange,
    index,
    onRemove,
}: {
    value: TimetableGenSegment,
    onChange: (v: TimetableGenSegment) => void,
    onRemove: () => void,
    index: number,
    calculatedTime: Date,
}) => {
    let { t } = useTranslation();

    return (
        <Fieldset legend={<Text>
            {t("timetableGenerator.segment", { index: index+1 })}
        </Text>}>
            <Stack>
                <Group wrap="nowrap" justify={index ? "space-between" : "center"}>
                    {!!index && (
                        <Select
                            data={[
                                { value: "startTime", label: t("timetableGenerator.segmentType.startTime") },
                                { value: "offset", label: t("timetableGenerator.segmentType.offset") },
                            ]}
                            value={value.type}
                            onChange={(v) => onChange({
                                ...value,
                                type: v,
                            })}
                            allowDeselect={false}
                        />
                    )}

                    {value.type == "startTime" ? (
                        <TimeBox
                            label={t("timetableGenerator.startTimeLabel")}
                            description={t("timetableGenerator.startTimeDesc")}
                            value={value.startTime}
                            onChange={(v) => onChange({
                                ...value,
                                startTime: v,
                            })}
                        />
                    ) : (
                        <NumberInput
                            value={value.offset}
                            onChange={(v) => onChange({
                                ...value,
                                offset: v,
                            })}
                            label={t("timetableGenerator.offsetLabel")}
                            description={t("timetableGenerator.offsetDesc")}
                            defaultValue={0}
                            min={0}
                        />
                    )}

                    {!!index && (
                        <Tooltip label={t("timetableGenerator.removeSegment")}>
                            <ActionIcon
                                variant="light"
                                color="red"
                                onClick={() => onRemove()}
                            >
                                <IconTrash />
                            </ActionIcon>
                        </Tooltip>
                    )}
                </Group>
                <SimpleGrid cols={{ base: 1, md: 2 }}>
                    {[
                        "classCount",
                        "classDuration",
                        "breakDuration",
                        "studentBellOffset",
                    ].map((key, i) => (
                        <NumberInput
                            value={value[key]}
                            onChange={(v) => onChange({
                                ...value,
                                [key]: v,
                            })}
                            label={t(`timetableGenerator.${key}Label`)}
                            description={t(`timetableGenerator.${key}Desc`)}
                            defaultValue={key == "studentBellOffset" ? 0 : 1}
                            min={key == "studentBellOffset" ? 0 : 1}
                            key={i}
                        />
                    ))}
                </SimpleGrid>
            </Stack>
        </Fieldset>
    );
}

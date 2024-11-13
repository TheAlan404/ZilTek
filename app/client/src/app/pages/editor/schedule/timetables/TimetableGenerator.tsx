import { ActionIcon, Button, CloseButton, Divider, Fieldset, Group, NumberInput, Paper, ScrollArea, Select, SimpleGrid, Stack, Text, Title, Tooltip } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { Time, TimeUtil } from "@ziltek/common/src/Time";
import { modals } from "@mantine/modals";
import { Timetable, TimetableRow } from "@ziltek/common/src/schedule/timetable/Timetable";
import { createFactory, Enum, EnumData, match } from "@alan404/enum";
import { TimetableEntry } from "@ziltek/common/src/schedule/timetable/TimetableEntry";
import { ReactNode } from "react";
import { TimeBox } from "../../../../components/schedule/TimeBox";
import { TimetableComponent } from "../../../../components/schedule/TimetableComponent";
import { IconCalendarClock, IconClockCheck, IconHourglass } from "@tabler/icons-react";

export const GenMarker = createFactory<GenMarker>();
export type GenMarker = Enum<{
    StartTime: Time;
    ExtendedBreak: number;
    Classes: {
        amount: number;
        studentOffset?: number;
        classDur: number;
        breakDur: number;
    };
}>;

const presets: GenMarker[][] = [
    [
        GenMarker.StartTime(Time(9, 0)),
        GenMarker.Classes({
            amount: 5,
            breakDur: 10,
            studentOffset: 2,
            classDur: 40,
        }),
        GenMarker.ExtendedBreak(40),
        GenMarker.Classes({
            amount: 3,
            breakDur: 10,
            studentOffset: 2,
            classDur: 40,
        }),
    ]
];

const generateTimetable = (markers: GenMarker[]) => {
    let table: Timetable = [];
    let currentTime = Time(0, 0);

    for (let marker of markers) {
        match(marker)({
            StartTime: (time) => { currentTime = time },
            ExtendedBreak: (dur) => { currentTime = TimeUtil.add(currentTime, dur) },
            Classes: ({
                amount,
                breakDur,
                classDur,
                studentOffset,
            }) => {
                for (let i = 0; i < amount; i++) {
                    if (i !== 0) currentTime = TimeUtil.add(currentTime, breakDur);

                    const students: TimetableEntry = !studentOffset ? {
                        value: Time(0, 0),
                    } : {
                        value: TimeUtil.add(currentTime, -studentOffset),
                    };

                    const teachers: TimetableEntry = {
                        value: currentTime,
                    };

                    currentTime = TimeUtil.add(currentTime, classDur);

                    const classEnd: TimetableEntry = {
                        value: currentTime,
                    };

                    const row: TimetableRow = [students, teachers, classEnd];
                    table.push(row);
                }
            },
        });
    }

    return table;
};

export const TimetableGenerator = ({
    onAccept,
}: {
    onAccept?: (table: Timetable) => void,
}) => {
    let { t } = useTranslation();
    let [markers, handlers] = useListState<GenMarker>([
        GenMarker.StartTime(Time(9, 0))
    ]);

    let elements = [];

    let currentTime = Time(0, 0);
    for (let i = 0; i < markers.length; i++) {
        const marker = markers[i];
        const isFirst = i == 0;
        const isLast = i == markers.length - 1;

        const beforeTime = currentTime;
        match(marker)({
            StartTime: (time) => { currentTime = time },
            ExtendedBreak: (dur) => { currentTime = TimeUtil.add(currentTime, dur) },
            Classes: ({ amount, breakDur, classDur }) => {
                currentTime = TimeUtil.add(currentTime, (classDur * amount) + (amount - 1) * breakDur);
            },
        })
        const afterTime = currentTime;

        const inner = match<GenMarker, ReactNode>(marker)({
            StartTime: (st) => (
                <Group justify="space-between">
                    <Text fw="bold">{t("gen.startTime")}</Text>
                    <Group>
                        <TimeBox
                            value={st}
                            onChange={(time) => handlers.setItem(i, GenMarker.StartTime(time))}
                        />
                        <CloseButton
                            onClick={() => handlers.remove(i)}
                        />
                    </Group>
                </Group>
            ),
            ExtendedBreak: (dur) => (
                <Group justify="space-between">
                    <Text fw="bold">{t("gen.break")}</Text>
                    <Group>
                        <TimeBox
                            value={TimeUtil.fromMins(dur)}
                            onChange={(time) => handlers.setItem(i, GenMarker.ExtendedBreak(TimeUtil.toMins(time)))}
                        />
                        <CloseButton
                            onClick={() => handlers.remove(i)}
                        />
                    </Group>
                </Group>
            ),
            Classes: (data) => {
                const set = (x: Partial<EnumData<GenMarker, "Classes">>) => {
                    handlers.setItem(i, GenMarker.Classes({
                        ...data,
                        ...x,
                    }));
                };

                return (
                    <Stack>
                        <Group justify="space-between">
                            <Group>
                                <Text fw="bold">{t("gen.classes")}</Text>
                                <Text>{beforeTime} - {afterTime}</Text>
                            </Group>

                            <CloseButton
                                onClick={() => handlers.remove(i)}
                            />
                        </Group>
                        <SimpleGrid cols={{ base: 2, md: 4 }}>
                            {(["amount", "studentOffset", "classDur", "breakDur"] as (keyof EnumData<GenMarker, "Classes">)[]).map(key => (
                                <NumberInput
                                    label={t(`gen.${key}`)}
                                    value={data[key]}
                                    allowDecimal={false}
                                    allowNegative={false}
                                    onChange={(x) => typeof x == "number" && set({ [key]: x })}
                                />
                            ))}
                        </SimpleGrid>

                    </Stack>
                );
            },
        });

        elements.push(
            <Paper key={i} withBorder p="sm">
                {inner}
            </Paper>
        );
    }

    const buttons = (
        <SimpleGrid cols={{ base: 1, sm: 3 }}>
            <Button
                variant="light"
                color="green"
                onClick={() => handlers.append(GenMarker.StartTime(Time(0, 0)))}
                leftSection={<IconClockCheck />}
            >
                {t("gen.startTime")}
            </Button>
            <Button
                variant="light"
                color="green"
                onClick={() => handlers.append(GenMarker.ExtendedBreak(0))}
                leftSection={<IconHourglass />}
            >
                {t("gen.break")}
            </Button>
            <Button
                variant="light"
                leftSection={<IconCalendarClock />}
                color="green"
                onClick={() => handlers.append(GenMarker.Classes({
                    amount: 2,
                    breakDur: 10,
                    classDur: 40,
                    studentOffset: 0,
                }))}
            >
                {t("gen.classes")}
            </Button>
        </SimpleGrid>
    );

    return (
        <Stack>
            <SimpleGrid cols={{ base: 1, xs: 2 }}>
                <Stack>
                    <Group>
                        {presets.map((preset, i) => (
                            <Button
                                variant="outline"
                                onClick={() => handlers.setState(preset)}
                            >
                                {t("gen.preset", { x: i+1 })}
                            </Button>
                        ))}

                        <Button
                            variant="outline"
                            color="red"
                            onClick={() => handlers.setState([GenMarker.StartTime(Time(9, 0))])}
                        >
                            {t("gen.reset")}
                        </Button>
                    </Group>

                    <Text>
                        {t("gen.p")}
                    </Text>

                    <Divider
                        w="100%"
                        label={t("gen.segments")}
                    />

                    {elements}

                    <Divider
                        w="100%"
                        label={t("gen.addSegment")}
                    />

                    {buttons}
                </Stack>

                <Stack>
                    <Divider
                        w="100%"
                        label={t("gen.preview")}
                    />

                    <TimetableComponent
                        value={generateTimetable(markers)}
                        forceIdle
                    />
                </Stack>
            </SimpleGrid>

            <Group justify="end" pt="xl">
                <Button color="gray" variant="light" onClick={() => modals.closeAll()}>
                    {t("modals.cancel")}
                </Button>
                <Button variant="light" onClick={() => {
                    onAccept(generateTimetable(markers));
                    modals.closeAll();
                }}>
                    {t("save")}
                </Button>
            </Group>
        </Stack>
    );
}

export const GenMarkerEditor = ({
    marker,
    onChange,
}: {
    marker: GenMarker;
    onChange: (m: GenMarker) => void;
}) => {
    return (
        <Paper withBorder p="sm">

        </Paper>
    )
};

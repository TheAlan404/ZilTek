import { Button, Divider, Group, SegmentedControl, Stack, Text } from '@mantine/core'
import { IconPlayerPlay, IconPlayerStop } from '@tabler/icons';
import React, { Component } from 'react'
import controller from '../api/controller';
import s from '../api/lang';

class PlayerControls extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isOn: controller.bellOnline,
        }
    }

    componentDidMount() {
        controller.sub("bellStatus", () => {
            this.setState({ isOn: controller.bellOnline });
        });
    }

    render() {
        return (
            <Stack>
                <Stack align="flex-end">
                    { /* god damn DOM only allowing string as input smh */}
                    <Group>
                        <Text>{s("bellStatus")}</Text>
                        <SegmentedControl
                            value={this.state.isOn ? "on" : "off"}
                            onChange={(v) => {
                                controller.setBellStatus(v == "on");
                            }}
                            data={[
                                { value: "on", label: s("on") },
                                { value: "off", label: s("off") }
                            ]}
                            color={this.state.isOn ? "green" : "red"}

                        />
                    </Group>
                </Stack>
                <Group grow>
                    <Divider my="xs" label={s("stopAudio")} labelPosition="center" />
                </Group>
                <Stack align="flex-end" spacing="xl">
                    <Group>
                        <Text>{s("stopAudio")}</Text>
                        <Button
                            onClick={() => controller.stopAudio()}
                            variant="outline"
                            color="red"
                            leftIcon={<IconPlayerStop />}>
                            {s("stopButton")}
                        </Button>
                    </Group>
                </Stack>
                <Group grow>
                    <Divider my="xs" label={s("playMelody")} labelPosition="center" />
                </Group>
                <Stack align="flex-end" spacing="xl">
                    <Group>
                        <Text>{s("studentBell") + " " + s("bell")}</Text>
                        <Button
                            onClick={() => controller.playAudioByName(controller.melodies.main[0])}
                            variant="light"
                            color="grape"
                            compact
                            leftIcon={<IconPlayerPlay />}>
                            {s("playButton")}
                        </Button>
                    </Group>
                    <Group>
                        <Text>{s("teacherBell") + " " + s("bell")}</Text>
                        <Button
                            onClick={() => controller.playAudioByName(controller.melodies.main[1])}
                            variant="light"
                            color="grape"
                            compact
                            leftIcon={<IconPlayerPlay />}>
                            {s("playButton")}
                        </Button>
                    </Group>
                    <Group>
                        <Text>{s("classBell") + " " + s("bell")}</Text>
                        <Button
                            onClick={() => controller.playAudioByName(controller.melodies.main[2])}
                            variant="light"
                            color="grape"
                            compact
                            leftIcon={<IconPlayerPlay />}>
                            {s("playButton")}
                        </Button>
                    </Group>
                </Stack>
                {controller.melodies.custom.length && <>
                    <Group grow>
                        <Divider my="xs" label={s("customMelodiesHeader")} labelPosition="center" />
                    </Group>
                    <Stack align="flex-end" spacing="xl">
                        {controller.melodies.custom.map(m =>
                            <Group>
                                <Text>{m}</Text>
                                <Button
                                    onClick={() => controller.playAudioByName(m)}
                                    variant="light"
                                    color="grape"
                                    compact
                                    leftIcon={<IconPlayerPlay />}>
                                    {s("playButton")}
                                </Button>
                            </Group>
                        )}
                    </Stack>
                </>}
            </Stack>
        )
    }
}

export default PlayerControls

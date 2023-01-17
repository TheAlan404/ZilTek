import { Button, Group, SegmentedControl, Stack, Text } from '@mantine/core'
import { IconPlayerPlay, IconPlayerStop } from '@tabler/icons';
import React, { Component } from 'react'
import controller from '../controller';
import s from '../lang';

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
            <Stack align="end">
                { /* god damn DOM only allowing string as input smh */ }
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
        )
    }
}

export default PlayerControls

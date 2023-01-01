import { Group, SegmentedControl, Text } from '@mantine/core'
import React, { Component } from 'react'
import s from '../lang';

class PlayerControls extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isOn: true,
        }
    }

    render() {
        return (
            <>
                { /* god damn DOM only allowing string as input smh */ }
                <Group>
                    <Text>Bell Status</Text>
                    <SegmentedControl
                        value={this.state.isOn ? "on" : "off"}
                        onChange={(v) => this.setState({ isOn: v == "on" })}
                        data={[
                            { value: "on", label: s("on") },
                            { value: "off", label: s("off") }
                        ]}
                        color={this.state.isOn ? "green" : "red"}

                        />
                </Group>
            </>
        )
    }
}

export default PlayerControls

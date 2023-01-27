import { Text, Progress, Group } from '@mantine/core'
import React, { Component } from 'react'
import s from '../lang';
import { dateToString } from '../timetables';

class Clock extends Component {
    constructor(props) {
        super(props);

        this.interval = null;

        this.state = {
            time: dateToString(new Date()) + ":" + (new Date().getSeconds().toString().padStart(2, "0")),
            progress: 100,
        };
    };

    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState({
                time: dateToString(new Date()) + ":" + (new Date().getSeconds().toString().padStart(2, "0")),
                progress: ((new Date().getSeconds() + (new Date().getMilliseconds() / 1000)) / 60) * 100,
            });
        }, 100);
    }

    render() {
        return (
            <div>
                <Group position="apart">
                    <Text>
                        {new Date().getDate()}
                        {" "}
                        {s("month" + new Date().getMonth())}
                        {", "}
                        {s("day" + new Date().getDay())}
                    </Text>
                    <Text c="dimmed" inline>
                        {new Date().getFullYear()}
                    </Text>
                </Group>

                <Text c="violet" fz="4em">{this.state.time}</Text>
                <Progress
                    size="xs"
                    color="violet"
                    value={this.state.progress}
                    />
            </div>
        )
    }
}

export default Clock

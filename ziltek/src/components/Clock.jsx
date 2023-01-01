import { Text } from '@mantine/core'
import React, { Component } from 'react'
import { dateToString } from '../timetables';

class Clock extends Component {
    constructor(props) {
        super(props);

        this.interval = null;

        this.state = {
            time: dateToString(new Date()) + ":" + (new Date().getSeconds().toString().padStart(2, "0")),
        };
    };

    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState({ time: dateToString(new Date()) + ":" + (new Date().getSeconds().toString().padStart(2, "0")) });
        }, 200);
    }

    render() {
        return (
            <>
                <Text c="indigo.7" fz="4em">{this.state.time}</Text>
            </>
        )
    }
}

export default Clock

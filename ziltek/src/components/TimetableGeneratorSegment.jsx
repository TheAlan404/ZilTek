import { Divider, Grid, Group, NumberInput, Select, Space } from '@mantine/core'
import React, { Component } from 'react'
import { newDate } from '../timetables';
import TimeBox from './TimeBox';
import s from "../lang.js";

class TimetableGeneratorSegment extends Component {
    constructor(props) {
        super(props)

        this.state = {
            type: this.props.type || "startTime",
            startTime: newDate(0, 0),
            offset: 0,
            classCount: 1,
            classDuration: 0,
            breakDuration: 0,
            studentBellOffset: 0,
        };
    };

    setState(s) {
        super.setState(s);
        if (!s.type) {
            (this.props.onChange || (() => 0))(this.state);
        }
    }

    componentDidUpdate(oldProps) {
        if (this.props === oldProps) return;
        this.setState({
            type: this.props.type || "startTime",
        });
    };

    render() {
        return (
            <>
                <Group>
                    <Select
                        label={s("Type")}
                        value={this.state.type}
                        onChange={(v) => this.setState({ type: v })}
                        data={[
                            { value: "startTime", label: s("startTime") },
                            { value: "offset", label: s("offset") },
                        ]}
                    />
                    {this.state.type == "startTime" ? (
                        <>
                            <TimeBox
                                label={s("startTime")}
                                description={s("startTimeDesc")}
                            />
                        </>
                    ) : (
                        <>
                            <NumberInput
                                label={s("offset")}
                                description={s("offsetDesc")}
                                defaultValue={0}
                                value={this.state.offset}
                                onChange={(v) => this.setState({ offset: v })}
                            />
                        </>
                    )}
                </Group>
                <Divider my="sm" />
                <Grid columns={2}>
                    <Grid.Col span={1}>
                        <NumberInput
                            label={s("classCount")}
                            description={s("classCountDesc")}
                            value={this.state.classCount}
                            onChange={(v) => this.setState({ classCount: v })}
                        />
                    </Grid.Col>
                    <Grid.Col span={1}>
                        <NumberInput
                            label={s("classDuration")}
                            description={s("classDurationDesc")}
                            value={this.state.classDuration}
                            onChange={(v) => this.setState({ classDuration: v })}
                        />
                    </Grid.Col>
                    <Grid.Col span={1}>
                        <NumberInput
                            label={s("breakDuration")}
                            description={s("breakDurationDesc")}
                            value={this.state.breakDuration}
                            onChange={(v) => this.setState({ breakDuration: v })}
                        />
                    </Grid.Col>
                    <Grid.Col span={1}>
                        <NumberInput
                            label={s("studentBellOffset")}
                            description={s("studentBellOffsetDesc")}
                            value={this.state.studentBellOffset}
                            onChange={(v) => this.setState({ studentBellOffset: v })}
                        />
                    </Grid.Col>
                </Grid>
            </>
        )
    }
}

export default TimetableGeneratorSegment

import { Button, Divider, Grid, NumberInput, Select, Text } from '@mantine/core';
import React, { Component } from 'react';
import s from "../../api/lang.js";
import { addMinutesToDate, dateToString, newDate } from '../../api/timetables.js';
import TimeBox from '../TimeBox';

class TimetableGeneratorSegment extends Component {
    constructor(props) {
        super(props)

        this.state = {
            type: this.props.type || "startTime",
            startTime: newDate(0, 0),
            offset: 0,
            classCount: 4,
            classDuration: 25,
            breakDuration: 5,
            studentBellOffset: 0,
        };
    };

    setState(s) {
        super.setState(s, () => {
            (this.props.onChange || (() => 0))(this.state);
        });
    }

    componentDidUpdate(oldProps) {
        if (this.props === oldProps) return;
        if (!this.props.data) return;
        console.log("gensegment cdu", this.props.data);
        super.setState(this.props.data);
    };

    render() {
        return (
            <>
                <Grid columns={3} align="flex-end">
                    <Grid.Col span={1}>
                        <Text fw={700}>
                            {s("segmentIndex", this.props.index+1)}
                        </Text>

                        <Text c="cyan.8">
                            {dateToString(this.props.durationInfo[0])}
                            -
                            {dateToString(this.props.durationInfo[1])}
                        </Text>

                        <Select
                            label={s("Type")}
                            value={this.state.type}
                            disabled={!this.props.allowTypeChange}
                            onChange={(v) => this.setState({ type: v })}
                            data={[
                                { value: "startTime", label: s("startTime") },
                                { value: "offset", label: s("offset") },
                            ]}
                        />
                    </Grid.Col>
                    <Grid.Col span={1}>
                        {this.state.type == "startTime" ? (
                            <>
                                <TimeBox
                                    label={s("startTime")}
                                    description={s("startTimeDesc")}
                                    time={this.state.startTime}
                                    onChange={(v) => this.setState({ startTime: v })}
                                />
                            </>
                        ) : (
                            <>
                                <NumberInput
                                    label={s("offset")}
                                    description={s("offsetDesc")}
                                    defaultValue={0}
                                    value={this.state.offset}
                                    min={0}
                                    onChange={(v) => this.setState({ offset: v })}
                                />
                            </>
                        )}
                    </Grid.Col>
                    <Grid.Col span={1}>
                        {this.props.isRemoveable ? <>
                            <Button
                                variant="outline"
                                color="red"
                                onClick={() => this.props.onRemove()}>
                                {s("removeSegment")}
                            </Button>
                        </> : <></>}
                    </Grid.Col>
                </Grid>
                <Divider my="sm" />
                <Grid columns={2} align="flex-end">
                    <Grid.Col span={1}>
                        <NumberInput
                            label={s("classCount")}
                            value={this.state.classCount}
                            min={1}
                            onChange={(v) => this.setState({ classCount: v })}
                        />
                    </Grid.Col>
                    <Grid.Col span={1}>
                        <NumberInput
                            label={s("classDuration")}
                            description={s("classDurationDesc")}
                            value={this.state.classDuration}
                            min={1}
                            onChange={(v) => this.setState({ classDuration: v })}
                        />
                    </Grid.Col>
                    <Grid.Col span={1}>
                        <NumberInput
                            label={s("breakDuration")}
                            description={s("breakDurationDesc")}
                            value={this.state.breakDuration}
                            min={1}
                            onChange={(v) => this.setState({ breakDuration: v })}
                        />
                    </Grid.Col>
                    <Grid.Col span={1}>
                        <NumberInput
                            label={s("studentBellOffset")}
                            description={s("studentBellOffsetDesc")}
                            value={this.state.studentBellOffset}
                            min={0}
                            onChange={(v) => this.setState({ studentBellOffset: v })}
                        />
                    </Grid.Col>
                </Grid>
            </>
        )
    }
}

export default TimetableGeneratorSegment

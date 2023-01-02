import { Button, Group, Paper, Stack, Text, Tooltip } from '@mantine/core'
import React, { Component } from 'react'
import { generateTimetable, newDate } from '../timetables'
import TimetableGeneratorSegment from './TimetableGeneratorSegment'
import s from '../lang'
import { closeAllModals } from "@mantine/modals";
import TimetableGrid from './TimetableGrid'

class TimetableGenerator extends Component {
	constructor(props) {
		super(props)

		this.state = {
			error: "",
			/** @type {import('../timetables').TimetableGenSegment[]} */
			segments: [{
				type: "startTime",
				startTime: newDate(0, 0),
			}],
		}
	}

	calculateErrors(segments) {
		segments = segments || this.state.segments;

		let errors = [];

		let e = (i, t, ...a) => s("segmentIndex", i+1) + ": " + s(t, ...a);

		if(segments.length <= 0) {
			errors.push("You broke the wizard. Congratulations. Was it worth it? " +
			"Because despite your reverse engineering, the only thing you've managed" +
			"to break so far is my heart.");
		};

		segments.forEach((segment, i) => {
			if(segment.type == "startTime") {
				
			} else if(segment.type == "offset") {

			} else {
				if(!i) {
					segment.type = "startTime";
				} else {
					errors.push(i + ":: The segment has acquired quantum insecurity. " +
					"Please select its type to give it confidence.");
					return;
				}
			}

			
			if(segment.classCount <= 0)
				errors.push(e(i, "err_numZero", s("classCount")));
			if(segment.classDuration <= 0)
				errors.push(e(i, "err_numZero", s("classDuration")));
			if(segment.breakDuration <= 0)
				errors.push(e(i, "err_numZero", s("breakDuration")));
			if(segment.studentBellOffset < 0)
				errors.push(e(i, "err_numNegative", s("studentBellOffset")));
		});

		return errors.join("\n\n");
	}

	removeSegment(i) {
		this.setState((state) => ({
			segments: [...state.segments.slice(0, i), ...state.segments.slice(i + 1)],
			error: this.calculateErrors(),
		}));

		console.log("removed segment", this.state.segments, i);
	}

	render() {
		return (
			<>
				<Stack>
					{this.state.segments.map((s, i) => (
						<Paper key={i} shadow="xs" p="md" withBorder>
							<TimetableGeneratorSegment
								index={i}
								type={i ? "offset" : "startTime"}
								allowTypeChange={!!i}
								onChange={(data) => {
									this.setState((state) => {
										state.segments[i] = Object.assign(state.segments[i], data);
										state.error = this.calculateErrors(state.segments);
										console.log("timegen state upd", state);
										return state;
									});
								}}
								isRemoveable={!!i}
								onRemove={() => this.removeSegment(i)}
							/>
						</Paper>
					))}
					<Group position='apart'>
						<Button
							variant="light"
							onClick={() => this.setState((state) => {
								state.segments.push({});
								state.error = this.calculateErrors(state.segments);
								return state;
							})}>
							{s("addSegment")}
						</Button>
						<Group>
							<Button
								color="red"
								variant='outline'
								onClick={() => closeAllModals()}>
								{s("cancel")}
							</Button>
							<Tooltip multiline label={
								this.state.error ? <>
									-
								</> : <>
									<TimetableGrid
										timetable={this.state.generated}
										readonly
									/>
									<Text fw={700}>{s("clickToRefresh")}</Text>
								</>
							}>
								<Button
									variant='light'
									disabled={this.state.error}
									onClick={() => this.setState({ generated: generateTimetable(this.state.segments) })}>
									{s("preview")}
								</Button>
							</Tooltip>
							<Tooltip multiline label={<div>
								{this.state.error}
							</div>}>
								<div>
									<Button
										color="green"
										disabled={this.state.error}
										onClick={() => {
											this.props.onSave(generateTimetable(this.state.segments));
										}}>
										{s("generate")}
									</Button>
								</div>
							</Tooltip>
						</Group>
					</Group>
				</Stack>
			</>
		)
	}
}

export default TimetableGenerator

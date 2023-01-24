import { Button, Divider, Group, Paper, Popover, Stack, Text, Tooltip, TypographyStylesProvider } from '@mantine/core'
import { closeAllModals } from "@mantine/modals"
import React, { Component } from 'react'
import s from '../../lang'
import { addMinutesToDate, generateTimetable, newDate } from '../../timetables'
import TimetableGrid from '../TimetableGrid'
import TimetableGeneratorSegment from './TimetableGeneratorSegment'

class TimetableGenerator extends Component {
	constructor(props) {
		super(props)

		this.state = {
			error: "",
			/** @type {import('../../timetables').TimetableGenSegment[]} */
			segments: [{
				type: "startTime",
				startTime: newDate(9, 0),
				classCount: 4,
				classDuration: 25,
				breakDuration: 5,
				studentBellOffset: 0,

				_startDate: newDate(0, 0),
				_endDate: newDate(0, 0),
			}],
		}
	}

	calculateErrors(segments) {
		segments = segments || this.state.segments;

		let errors = [];

		let e = (i, t, ...a) => s("segmentIndex", i + 1) + ": " + s(t, ...a);

		if (segments.length <= 0) {
			errors.push("You broke the wizard. Congratulations. Was it worth it? " +
				"Because despite your reverse engineering, the only thing you've managed" +
				"to break so far is my heart.");
		};

		segments.forEach((segment, i) => {
			if (segment.type == "startTime") {

			} else if (segment.type == "offset") {

			} else {
				if (!i) {
					segment.type = "startTime";
				} else {
					errors.push(i + ":: The segment has acquired quantum insecurity. " +
						"Please select its type to give it confidence.");
					return;
				}
			}


			if (segment.classCount <= 0)
				errors.push(e(i, "err_numZero", s("classCount")));
			if (segment.classDuration <= 0)
				errors.push(e(i, "err_numZero", s("classDuration")));
			if (segment.breakDuration <= 0)
				errors.push(e(i, "err_numZero", s("breakDuration")));
			if (segment.studentBellOffset < 0)
				errors.push(e(i, "err_numNegative", s("studentBellOffset")));
		});

		return errors.join("\n\n");
	}

	postProcessDurations(segments) {
		let time = newDate(0, 0);
		for (let seg of segments) {
			if (seg.type == "startTime") {
				time = new Date(seg.startTime);
			} else {
				time = addMinutesToDate(time, seg.offset);
			};

			seg._startDate = new Date(time);

			time = addMinutesToDate(time, seg.classCount * seg.classDuration);
			time = addMinutesToDate(time, (seg.classCount - 1) * seg.breakDuration);

			seg._endDate = new Date(time);
		};

		return segments;
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
					<Text style={{
						whiteSpace: "pre-wrap",
					}}>
						<TypographyStylesProvider>
							<div dangerouslySetInnerHTML={{ __html: s("ttg_desc") }} />
						</TypographyStylesProvider>
					</Text>


					<Divider my="md" />

					<Group>
						<Button
							variant='outline'
							color="red"
							onClick={() => {
								let segs = this.postProcessDurations([{
									type: "startTime",
									startTime: newDate(0, 0),
									classCount: 1,
									classDuration: 0,
									breakDuration: 0,
									studentBellOffset: 0,
					
									_startDate: newDate(0, 0),
									_endDate: newDate(0, 0),
								}]);
								this.setState({
									segments: segs,
									error: this.calculateErrors(segs),
								});
							}}>
							{s("clear")}
						</Button>
						{[
							[
								{ type: "startTime", startTime: newDate(9, 0), classDuration: 30, breakDuration: 10, classCount: 6 },
							],
							[
								{ type: "startTime", startTime: newDate(8, 50), classDuration: 40, breakDuration: 10, classCount: 5, studentBellOffset: 2 },
								{ type: "offset", offset: 50, classDuration: 40, breakDuration: 10, classCount: 3, studentBellOffset: 2 },
							]
						].map((v, i) =>
							<Button
								key={i}
								variant='outline'
								onClick={() => {
									let segs = this.postProcessDurations(v);
									this.setState({
										segments: segs,
										error: this.calculateErrors(segs),
									});
								}}>
								{s("preset") + " " + (i+1)}
							</Button>
						)}
					</Group>

					{this.state.segments.map((s, i) => (
						<Paper key={i} shadow="xs" p="md" withBorder>
							<TimetableGeneratorSegment
								index={i}
								type={i ? "offset" : "startTime"}
								allowTypeChange={!!i}
								data={s}
								onChange={(data) => {
									this.setState((state) => {
										state.segments[i] = Object.assign(state.segments[i], data);
										state.error = this.calculateErrors(state.segments);

										this.postProcessDurations(state.segments);

										console.log("timegen state upd", state);
										return state;
									});
								}}
								isRemoveable={!!i}
								onRemove={() => this.removeSegment(i)}
								durationInfo={[s._startDate, s._endDate]}
							/>
						</Paper>
					))}
					<Group position='apart'>
						<Button
							variant="light"
							onClick={() => this.setState((state) => {
								state.segments.push({
									_startDate: newDate(0, 0),
									_endDate: newDate(0, 0),
								});
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

							<Popover position='top' withArrow shadow="md">
								<Popover.Target>
									<Button
										variant='light'
										disabled={this.state.error}>
										{s("preview")}
									</Button>
								</Popover.Target>
								<Popover.Dropdown>
									{this.state.error ?
										<Text style={{
											whiteSpace: "pre-wrap",
										}}>
											{this.state.error}
										</Text> :
										<>
											<TimetableGrid
												timetable={generateTimetable(this.state.segments)}
												readonly
											/>
										</>}
								</Popover.Dropdown>
							</Popover>



							<Tooltip multiline label={<div style={{
								whiteSpace: "pre-wrap",
							}}>
								{this.state.error}
							</div>}>
								<div>
									<Button
										color="green"
										disabled={this.state.error}
										onClick={() => {
											this.props.onSave(generateTimetable(this.state.segments));
											closeAllModals();
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

import React, { Component } from 'react';
import { Text, Table, Button, CloseButton, Space, Group } from '@mantine/core';
import TimeBox from './TimeBox';
import { NullTuple } from '../timetables';
import s from '../lang';
import controller from '../controller';

class TimetableGrid extends Component {
	constructor(props) {
		super(props)

		this.state = {
			timetable: this.props.timetable || [],
			changes: this.props.changes || false,
			lastPlayedIndex: [-1, -1],
			suppressedIndex: [-1, -1],
		}
	}

	componentDidMount() {
		if(this.props.controllerRealtime) {
			controller.sub("execUpdate", ({ type, index }) => {
				if(type == "startPlay") {
					this.setState({ lastPlayedIndex: index });
				} else if (type == "endPlay") {
					this.setState({ lastPlayedIndex: [-1, -1] });
				};
			})

			controller.sub("suppressed", ({ index }) => {
				this.setState({ suppressedIndex: index, lastPlayedIndex: [-1, -1] });
			})
		}
	}


	addRow() {
		if (!this.state.changes) (this.props.onChanges || (() => { }))();
		this.setState((state) => {
			state.timetable.push(NullTuple());
			state.changes = true;
			return state;
		});

		console.log("added new row", this.state.timetable);
	};

	removeRow(i) {
		// hax
		if (!this.state.changes) (this.props.onChanges || (() => { }))();
		this.setState((state) => ({
			timetable: [...state.timetable.slice(0, i), ...state.timetable.slice(i + 1)],
			changes: true,
		}))

		console.log("removed row", this.state.timetable, i);
	}

	revertTable() {
		(this.props.onRevert || (() => { }))();
		this.setState({
			timetable: this.props.timetable || [],
			changes: false,
		});
	}

	componentDidUpdate(prevProps) {
		if (prevProps.timetable === this.props.timetable) return;
		this.setState({
			timetable: this.props.timetable,
			changes: this.props.changes || false,
		});
	}

	render() {
		return (
			<>
				{(this.state.timetable.length == 0) && <>
					<Button variant='light' disabled fullWidth>
						-- {s("empty")} --
					</Button>
					<Space h="md" />
				</>}
				<Table>
					<tbody>
						{this.state.timetable.length > 0 && <tr>
							<th>{s("studentBell")}</th>
							<th>{s("teacherBell")}</th>
							<th>{s("classBell")}</th>
						</tr>}
						{this.state.timetable.map((tuple, i) =>
							<tr key={i}>
								{tuple.map((t, ii) => <td key={ii}>
									<TimeBox
										time={t}
										readonly={this.props.readonly}

										isPlaying={this.props.controllerRealtime && (this.state.lastPlayedIndex[0] == i && this.state.lastPlayedIndex[1] == ii)}
										isSuppressed={this.props.controllerRealtime && (this.state.suppressedIndex[0] == i && this.state.suppressedIndex[1] == ii)}
										didPlay={this.props.controllerRealtime && (
											new Date().getHours() > t.getHours() || (new Date().getHours() == t.getHours() && new Date().getMinutes() >= t.getMinutes())
										)}

										onChange={(v) => {
											if (!this.state.changes) (this.props.onChanges || (() => { }))();
											this.setState((state) => {
												state.timetable[i][ii] = v;
												state.changes = true;
												return state;
											});
											console.log("value changed", i, ii, v);
										}}
									/>
								</td>)}
								{(!this.props.readonly && this.state.timetable.length - 1 == i) && <>
									<td>
										<CloseButton
											onClick={() => this.removeRow(i)}
										/>
									</td>
								</>}
							</tr>
						)}

					</tbody>
				</Table>
				{!this.props.readonly && <>
					<Group position='apart'>
						<Button
							variant='light'
							onClick={() => this.addRow()}>
							Add new row
						</Button>

						{this.props.onSave ? <>
							<Group position='left'>
								<Button
									color="red"
									variant='outline'
									disabled={!this.state.changes}
									onClick={() => this.revertTable()}>
									Revert
								</Button>
								<Button
									color="green"
									disabled={!this.state.changes}
									onClick={() => {
										this.props.onSave(this.state.timetable);
										this.setState({ changes: false });
									}}>
									Save
								</Button>
							</Group>
						</> : <></>}
					</Group>
				</>}
			</>
		)
	}
}

export default TimetableGrid

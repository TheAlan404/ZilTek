import React, { Component } from 'react';
import { Text, Table, Button, CloseButton, Space, Group } from '@mantine/core';
import TimeBox from './TimeBox';
import { NullTuple } from '../timetables';
import s from '../lang';

class TimetableGrid extends Component {
	constructor(props) {
		super(props)

		this.state = {
			timetable: this.props.timetable || [],
		}
	}

	addRow() {
		this.setState((state) => {
			state.timetable.push(NullTuple());
			return state;
		});

		console.log("added new row", this.state.timetable);
	};

	removeRow(i) {
		// hax
		this.setState((state) => ({
			timetable: [...state.timetable.slice(0, i), ...state.timetable.slice(i + 1)],
		}))

		console.log("removed row", this.state.timetable, i);
	}

	componentDidUpdate(prevProps) {
		if(prevProps.timetable === this.props.timetable) return;
		this.setState({
			timetable: this.props.timetable,
		});
	}

	render() {
		return (
			<>
				{(this.state.timetable.length == 0) && <>
					<Button variant='light' disabled fullWidth>
						-- Empty --
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
										onChange={(v) => {
											this.setState((state) => {
												state.timetable[i][ii] = v;
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
					<Group position='center'>
						<Button
							variant='light'
							onClick={() => this.addRow()}>
							Add new row
						</Button>

						{this.props.onSave ? <>
							<Button
								color="green"
								onClick={() => this.props.onSave(this.state.timetable)}>
								Save
							</Button>
						</> : <></>}
					</Group>
				</>}
			</>
		)
	}
}

export default TimetableGrid

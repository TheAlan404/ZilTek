import React, { Component } from 'react'
import { TimeInput } from '@mantine/dates';
import { newDate } from '../timetables';

class TimeBox extends Component {
	constructor(props) {
		super(props)

		let time = this.props.time;

		this.state = {
			value: time,
		}
	}


	render() {
		return (
			<>
				<TimeInput
					value={this.state.value}
					defaultValue={newDate(0, 0)}
					onChange={(value) => {
						this.setState({ value });
						(this.props.onChange || (()=>0))(value);
					}}
					disabled={this.props.readonly}
					/>
			</>
		)
	}
}

export default TimeBox

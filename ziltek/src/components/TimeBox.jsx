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

	componentDidUpdate(oldProps) {
		if(oldProps.time !== this.props.time)
			this.setState({ time: this.props.time });
	}

	render() {
		return (
			<>
				<TimeInput
					value={this.state.value}
					label={this.props.label}
					description={this.props.description}
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

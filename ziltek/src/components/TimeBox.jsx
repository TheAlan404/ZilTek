import React, { Component } from 'react'
import { TimeInput } from '@mantine/dates';

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

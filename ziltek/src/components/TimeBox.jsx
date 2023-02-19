import React, { Component } from 'react'
import { TimeInput } from '@mantine/dates';
import { newDate } from '../timetables';
import { Tooltip } from '@mantine/core';
import s from '../lang';

class TimeBox extends Component {
	constructor(props) {
		super(props)

		let time = this.props.time;

		this.state = {
			value: time,
		}
	}

	componentDidUpdate(oldProps) {
		//console.log("timebox cdu", oldProps, this.props);
		if (oldProps.time != this.props.time)
			this.setState({ time: this.props.time });
	}

	render() {
		let element = (
			<TimeInput
				styles={(theme) => {
					if (this.props.isPlaying) {
						return {
							input: {
								borderColor: theme.colors.violet[theme.fn.primaryShade()],
								borderWidth: 3
							},
						}
					} else if (this.props.isSuppressed) {
						return {
							input: { borderColor: theme.colors.red[theme.fn.primaryShade()] },
						}
					} else if (this.props.didPlay) {
						return {
							input: { borderColor: theme.colors.green[theme.fn.primaryShade()] },
						};
					} else {
						return {};
					}
				}}
				value={this.state.value}
				label={this.props.label}
				description={this.props.description}
				defaultValue={newDate(0, 0)}
				onChange={(value) => {
					this.setState({ value });
					(this.props.onChange || (() => 0))(value);
				}}
				disabled={this.props.readonly}
			/>
		);

		if (this.props.isPlaying) {
			return <Tooltip label={s("currentlyPlaying")}>
				{element}
			</Tooltip>
		} else {
			return element;
		}
	}
}

export default TimeBox

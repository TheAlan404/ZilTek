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
		let isLayered = !!this.props.underlayer;
		let isOverwritten = this.props.underlayer != this.state.time;
		let renderedValue = isLayered ? (isOverwritten ? this.state.value : this.props.underlayer) : this.state.value;

		let asd = { opacity: 1 }

		let element = (
			<TimeInput
				styles={(theme) => {
					if (this.props.isPlaying) {
						return {
							input: {
								borderColor: theme.colors.violet[theme.fn.primaryShade()],
								borderWidth: 3,

								...asd,
							},
						}
					} else if (this.props.isSuppressed) {
						return {
							input: { borderColor: theme.colors.red[theme.fn.primaryShade()], ...asd, },
						}
					} else if (this.props.didPlay) {
						return {
							input: { borderColor: theme.colors.green[theme.fn.primaryShade()], ...asd, },
						};
					} else if(isLayered && isOverwritten) {
						return {
							borderWidth: 3,
							borderColor: theme.colors.blue[theme.fn.primaryShade()],
							...asd,
						};
					} else if(this.props.underlayer) {
						return {
							input: {
								backgroundColor: theme.colors.gray[9],
								opacity: 0.7,
							},
						};
					} else {
						return {
							...asd,
						};
					}
				}}
				value={renderedValue}
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

		if (this.props.isPlaying || isOverwritten || isLayered) {
			let t;
			if(this.props.isPlaying) t = s("currentlyPlaying");
			else if(isOverwritten) t = s("overwritten");
			else if(isLayered) t = s("notOverwritten");
			return <Tooltip label={t}>
				{element}
			</Tooltip>
		} else {
			return element;
		}
	}
}

export default TimeBox

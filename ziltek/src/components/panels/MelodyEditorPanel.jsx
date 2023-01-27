import { Button, Center, Container, Group, Header, Paper, Select, Stack, Tooltip } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import React, { Component } from 'react'
import controller from '../../controller'
import fileStorage from '../../fileStorage'
import s from '../../lang'

class MelodyEditorPanel extends Component {
	constructor(props) {
	  	super(props)
	
	  	this.state = {
			files: fileStorage.getFiles(),
			melodies: controller.melodies,
		}
	}

	componentDidMount() {
		fileStorage.subscribeUpdate(() => {
			this.setState({
				files: fileStorage.getFiles(),
			})
		});
	}

	changeMelody(idx, newValue) {
		controller.melodies.main[idx] = newValue;
		controller.saveData();

		showNotification({
			message: s("melodyChanged"),
			color: "green",
		});

		this.setState({
			melodies: controller.melodies,
		});
	}
	
	render() {
		return (
			<Container size="xl">
				<Stack>
					<Header>
						{s("melodiesHeader")}
					</Header>

					<Select
						label={s("studentBell") + " " + s("bell")}
						data={this.state.files.map(f => f.filename)}
						searchable
						nothingFound="?"
						value={this.state.melodies.main[0]}
						onChange={(v) => this.changeMelody(0, v)}
						/>
					
					<Select
						label={s("teacherBell") + " " + s("bell")}
						data={this.state.files.map(f => f.filename)}
						searchable
						nothingFound="?"
						value={this.state.melodies.main[1]}
						onChange={(v) => this.changeMelody(1, v)}
						/>
					
					<Select
						label={s("classBell") + " " + s("bell")}
						data={this.state.files.map(f => f.filename)}
						searchable
						nothingFound="?"
						value={this.state.melodies.main[2]}
						onChange={(v) => this.changeMelody(2, v)}
						/>

					<Center>
						<Tooltip label="TODO">
							<Button
								variant="light">
								{s("customMelodies")}
							</Button>
						</Tooltip>
					</Center>
				</Stack>
			</Container>
		)
	}
}

export default MelodyEditorPanel

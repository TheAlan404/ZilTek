import { ActionIcon, Button, Center, Container, Grid, Group, Header, List, Paper, Select, Stack, Table, Text, Tooltip } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconPlus, IconTrash } from '@tabler/icons'
import React, { Component } from 'react'
import controller from '../../api/controller'
import fileStorage from '../../api/fileStorage'
import s from '../../api/lang'

class MelodyEditorPanel extends Component {
	constructor(props) {
	  	super(props)
	
	  	this.state = {
			files: fileStorage.getFiles(),
			melodies: structuredClone(controller.melodies),

			customMelodiesChanged: false,
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
			melodies: structuredClone(controller.melodies),
		});
	}

	addCustomMelodyRow() {

	}

	removeCustomMelodyRow() {

	}
	
	render() {
		return (
			<>
				<Header>
					{s("melodiesHeader")}
				</Header>
				<Stack px="xl">
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
				<Header>
					{s("customMelodiesHeader")}
				</Header>
				<Stack px="xl">
					<Text>
						{s("customMelodiesDesc")}
					</Text>

					<Group position='right'>
						<Tooltip.Group>
							<Tooltip label={s("clear")}>
								<ActionIcon
									onClick={() => {
										
									}}>
									<IconTrash />
								</ActionIcon>
							</Tooltip>
							<Tooltip label={s("add")}>
								<ActionIcon
									onClick={() => {
										this.setState((old) => {
											old.melodies.custom.push("");
											old.customMelodiesChanged = true;
											return old;
										});
									}}>
									<IconPlus />
								</ActionIcon>
							</Tooltip>
						</Tooltip.Group>
					</Group>

					<Table highlightOnHover>
						<tbody>
							{this.state.melodies.custom.map((m, i) =>
								<tr key={i}>
									<td>
										<Grid>
											<Grid.Col span="auto">
												<Select
													data={[s("delete"), ...this.state.files.map(f => f.filename)]}
													searchable
													nothingFound="?"
													value={m}
													onChange={(v) => {
														this.setState((old) => {
															old.melodies.custom[i] = v;
															old.customMelodiesChanged = true;
															return old;
														});
													}}
													/>
											</Grid.Col>
										</Grid>
									</td>
								</tr>)}
						</tbody>
					</Table>

					<Group position='right'>
						<Button
							color="red"
							disabled={!this.state.customMelodiesChanged}
							onClick={() => {
								this.setState({
									melodies: structuredClone(controller.melodies),
									customMelodiesChanged: false,
								});
							}}>
							{s("revert")}
						</Button>
						<Button
							color="green"
							disabled={!this.state.customMelodiesChanged}
							onClick={() => {
								controller.melodies.custom = this.state.melodies.custom.filter(x => x && this.state.files.some(f => f.filename == x));
								controller.saveData();

								showNotification({
									message: s("saved"),
									color: "green",
								});
						
								this.setState({
									melodies: structuredClone(controller.melodies),
									customMelodiesChanged: false,
								});
							}}>
							{s("save")}
						</Button>
					</Group>
				</Stack>
			</>
		)
	}
}

export default MelodyEditorPanel

import { ActionIcon, Checkbox, Container, Grid, Group, Header, Select, Space, Stack, Text, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { IconPlaylistX, IconWand } from '@tabler/icons';
import React, { Component } from 'react';
import controller from '../../controller';
import s from '../../lang';
import TimetableGenerator from '../generator/TimetableGenerator';
import TimetableGrid from '../TimetableGrid';

class TimetableEditorPanel extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selectValue: 0,
			isMain: true,
			isFullOverride: false,
			selectedTimetable: controller.timetables.main,
			changes: false,
		};
	}

	componentDidMount() {
		this.setTimetableGrid(0);
	}

	setTimetableGrid(id) {
		id = Number(id);
		console.log("Changed select to", id)
		let isMain = id === 0;
		let table = structuredClone(isMain
			? controller.timetables.main
			: (controller.timetables.overrides[id - 1] || { table: [] }).table);
		let isFullOverride = isMain ? false : (controller.timetables.overrides[id - 1] || { fullOverride: false }).fullOverride;

		console.dir({
			isMain,
			table,
			isFullOverride,
		})

		this.setState({
			selectValue: id,
			isMain,
			selectedTimetable: table,
			isFullOverride,
		});
	}

	setTimetableData(data) {
		console.log("save tt data", data);
		if (this.state.isMain) {
			controller.timetables.main = data;
		} else {
			controller.timetables.overrides[this.selectValue - 1].table = data;
		};

		controller.saveData();

		showNotification({
			message: s("savedTimetable"),
			color: "green",
		});
	}

	render() {
		return (
			<>

				<Header>Timetables</Header>
				<Space h="md" />

				<Stack>
					<Grid justify="space-between" align="center">
						<Grid.Col span="content">
							<Text>{s("selectDay")}</Text>
						</Grid.Col>
						<Grid.Col span="auto">
							<Select
								data={new Array(8).fill(0)
									.map((v, i) => i ? {
										value: i.toString(),
										label: s("day" + (i - 1)),
										group: "Overrides",
									} : {
										value: i.toString(),
										label: s("mainTimetable"),
										group: "Main",
									})}
								defaultValue="0"
								value={this.state.selectValue.toString()}
								onChange={(e) => this.setTimetableGrid(e)}
								disabled={this.state.changes}
							/>
						</Grid.Col>
						<Grid.Col span="content">
							<Group spacing="xs">
								<Tooltip.Group>
									<Tooltip label={s("clearTimetable")}>
										<ActionIcon
											onClick={() => {
												this.setState({
													changes: true,
													selectedTimetable: [],
												});
											}}>
											<IconPlaylistX />
										</ActionIcon>
									</Tooltip>
									<Tooltip label={s("generateTimetable")}>
										<ActionIcon
											onClick={() => openModal({
												title: <>
													<Group>
														<IconWand />
														<Text>{s("timetableGenerator")}</Text>
													</Group>
												</>,
												children: (<TimetableGenerator
													onSave={(timetable) => {
														this.setState({
															selectedTimetable: timetable,
															changes: true,
														});
													}}
													/>),
												size: "lg",
											})}>
											<IconWand />
										</ActionIcon>
									</Tooltip>
								</Tooltip.Group>
							</Group>
						</Grid.Col>
					</Grid>
					{this.state.isMain ? <>
						<Text>
							{/*s("mainTimetableInfo")*/}
						</Text>
					</> : <Tooltip multiline inline label={s("fullOverrideTooltip")}>
						<div>
							<Checkbox label={s("fullOverride")} />
						</div>
					</Tooltip>}
					<Container padding="md">
						<TimetableGrid
							timetable={this.state.selectedTimetable}
							changes={this.state.changes}
							onSave={(t) => {
								this.setTimetableData(t);
								this.setState({ changes: false });
							}}
							onChanges={() => {
								this.setState({ changes: true });
							}}
							onRevert={() => {
								this.setState({
									changes: false,
								});
								this.setTimetableGrid(this.state.selectValue);
							}}
						/>
					</Container>
				</Stack>
			</>
		)
	}
}

export default TimetableEditorPanel

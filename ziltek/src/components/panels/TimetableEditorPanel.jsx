import { ActionIcon, Checkbox, Container, Grid, Group, Header, Select, Space, Stack, Text, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { IconPlaylistX, IconWand } from '@tabler/icons';
import { useListState } from '@mantine/hooks';
import React, { Component, useEffect, useRef, useState } from 'react';
import controller from '../../controller';
import s from '../../lang';
import TimetableGenerator from '../generator/TimetableGenerator';
import TimetableGrid from '../TimetableGrid';

const DAYS = new Array(8).fill(0)
	.map((v, i) => i ? {
		value: i.toString(),
		label: s("day" + (i - 1)),
		group: "Overrides",
	} : {
		value: i.toString(),
		label: s("mainTimetable"),
		group: "Main",
	});

function TimetableEditorPanel({ }) {
	let [tableIndex, setTableIndex] = useState(0);
	let [changes, setChanges] = useState(false);
	let [isFullOverride, setIsFullOverride] = useState(false);
	let [table, handlers] = useListState([]);

	let fns = useRef();

	useEffect(() => {
		changeTableIndex(0);
	}, [])

	const clearTimetable = () => {
		handlers.setState([]);
		fns.current?.setChanges(true);
	};

	const changeTableIndex = (id) => {
		id = Number(id);
		
		let table = structuredClone((id === 0)
			? controller.timetables.main
			: (controller.timetables.overrides[id - 1] || { table: [] }).table);
		let ifo = (id === 0) ? false : (controller.timetables.overrides[id - 1] || { fullOverride: false }).fullOverride;

		setChanges(false);
		setIsFullOverride(ifo);
		handlers.setState(table);
		setTableIndex(id);
	};

	const saveTable = (data) => {
		if (tableIndex === 0) {
			controller.timetables.main = data;
		} else {
			if (!controller.timetables.overrides[tableIndex - 1])
				controller.timetables.overrides[tableIndex - 1] = { fullOverride: false, table: [] };
			controller.timetables.overrides[tableIndex - 1].table = data;
		};

		controller.saveData();

		showNotification({
			message: s("savedTimetable"),
			color: "green",
		});
	};

	const revert = () => {
		changeTableIndex(tableIndex);
	};

	const changeFullOverride = (b) => {
		if (tableIndex === 0) {
			// ..?
		} else {
			if (!controller.timetables.overrides[tableIndex - 1])
				controller.timetables.overrides[tableIndex - 1] = { fullOverride: false, table: [] };
			controller.timetables.overrides[tableIndex - 1].fullOverride = b;
		};

		setIsFullOverride(b);
		controller.saveData();

		showNotification({
			message: b ? s("fullOverrideSetToTrue") : s("fullOverrideSetToFalse"),
			color: "blue",
		});
	}

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
							data={DAYS}
							defaultValue="0"
							value={tableIndex.toString()}
							onChange={(e) => changeTableIndex(e)}
							disabled={changes}
						/>
					</Grid.Col>
					<Grid.Col span="content">
						<Group spacing="xs">
							<Tooltip.Group>
								<Tooltip label={s("clearTimetable")}>
									<ActionIcon
										color='red'
										onClick={() => clearTimetable()}>
										<IconPlaylistX />
									</ActionIcon>
								</Tooltip>
								<Tooltip label={s("generateTimetable")}>
									<ActionIcon
										color='green'
										onClick={() => openModal({
											title: <>
												<Group>
													<IconWand />
													<Text>{s("timetableGenerator")}</Text>
												</Group>
											</>,
											children: (<TimetableGenerator
												onSave={(timetable) => {
													handlers.setState(timetable);
													fns.current?.setChanges(true);
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
				{tableIndex === 0 ? <>
					<Text>
						{/*s("mainTimetableInfo")*/}
					</Text>
				</> : <Tooltip multiline inline label={s("fullOverrideTooltip")}>
					<div>
						<Checkbox
							label={s("fullOverride")}
							checked={isFullOverride}
							onChange={(e) => changeFullOverride(e.target.checked)} />
					</div>
				</Tooltip>}
				<Container padding="md">
					{(tableIndex != 0 && !isFullOverride) ? <div>
						<Text>override editor is broken, use full overwrite</Text>
					</div> : <TimetableGrid
						timetable={table}
						//deps={[tableIndex]}
						//renderMain={tableIndex != 0 && !isFullOverride}
						//underlayer={!isFullOverride && controller.timetables.main}
						onSave={(t) => saveTable(t)}
						cb={(obj) => {
							fns.current = obj;
						}}
						onChanges={(c) => setChanges(c)}
						onRevert={() => revert()}
					/>}
				</Container>
			</Stack>
		</>
	);
}

export default TimetableEditorPanel

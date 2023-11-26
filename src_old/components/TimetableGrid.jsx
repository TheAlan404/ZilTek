import React, { Component, useEffect, useState } from 'react';
import { Text, Table, Button, CloseButton, Space, Group } from '@mantine/core';
import TimeBox from './TimeBox';
import { NullTuple, isNullDate, mergeTimetables } from '../api/timetables';
import s from '../api/lang';
import controller from '../api/controller';
import { useListState } from '@mantine/hooks';

function TimetableGrid({
	timetable,
	underlayer,
	renderMain,
	controllerRealtime,
	readonly,
	onChanges,
	onSave,
	onRevert,
	deps,
	cb,
}) {
	let [changes, _setChanges] = useState(false);
	let setChanges = (v) => {
		onChanges(v);
		_setChanges(v);
	};
	let [table, handlers] = useListState([[]]);
	// isSuppressed, isPlaying, didPlay
	let [metaTable, metaHandlers] = useListState([{}]);

	let resetFromProps = () => {
		handlers.setState(timetable);
		
		if(!controllerRealtime) metaHandlers.filter(item => item && !item.underlayer);

		if(!controllerRealtime && renderMain && underlayer && underlayer.length) {
			underlayer.forEach((tuple, x) => {
				tuple.forEach((d, y) => {
					if(d && !isNullDate(d)) setMeta(x, y, { underlayer: d });
				});
			});
		}
	};

	useEffect(() => {
		resetFromProps();
	}, [timetable, ...(deps || [])]);

	useEffect(() => {
		if(cb) cb({ handlers, setChanges });
	}, [cb]);

	useEffect(() => {
		if(controllerRealtime) {
			controller.sub("execUpdate", ({ type, index }) => {
				if(type == "startPlay") {
					setMeta(...index, { isPlaying: true });
				} else if (type == "endPlay") {
					setMeta(...index, { didPlay: true });
				};
			});

			controller.sub("suppressed", ({ index }) => {
				setMeta(...index, { isSuppressed: true });
			});
		}
	}, []);

	let getCoords = (x, y) => x * 3 + y;

	let getMeta = (x, y) => {
		if(metaTable[getCoords(x, y)])
			return metaTable[getCoords(x, y)];
		return {};
	};

	let setMeta = (x, y, m) => {
		metaHandlers.setItem(getCoords(x, y), m);
	}

	const revert = () => {
		(onRevert || (()=>0))();
		setChanges(false);
		resetFromProps();
	};

	return (
		<>
			{(table.length == 0) && <>
				<Button variant='light' disabled fullWidth>
					-- {s("empty")} --
				</Button>
				<Space h="md" />
			</>}
			<Table>
				<tbody>
					{table.length > 0 && <tr>
						<th>{s("studentBell")}</th>
						<th>{s("teacherBell")}</th>
						<th>{s("classBell")}</th>
					</tr>}
					{(renderMain ? (underlayer || []) : table).map((tuple, i) =>
						<tr key={i}>
							{tuple.map((t, ii) => <td key={ii}>
								<TimeBox
									time={t}
									readonly={readonly}

									{...getMeta(i, ii)}

									onChange={(v) => {
										if (!changes) setChanges(true);
										let obj = table[i];
										obj[ii] = v;
										handlers.setItem(i, obj);
										console.log("value changed", i, ii, v);
									}}
								/>
							</td>)}
							{!readonly && <>
								<td>
									<CloseButton
										onClick={() => {
											if(!changes) setChanges(true);
											console.log("grid: remove", i);
											handlers.remove(i);
										}}
									/>
								</td>
							</>}
						</tr>
					)}

				</tbody>
			</Table>
			{!readonly && <>
				<Group position='apart'>
					<Button
						variant='light'
						onClick={() => {
							if(!changes) setChanges(true);
							handlers.append(NullTuple());
						}}>
						Add new row
					</Button>

					{onSave ? <>
						<Group position='left'>
							<Button
								color="red"
								variant='outline'
								disabled={!changes}
								onClick={() => revert()}>
								Revert
							</Button>
							<Button
								color="green"
								disabled={!changes}
								onClick={() => {
									onSave(table);
									setChanges(false);
								}}>
								Save
							</Button>
						</Group>
					</> : <></>}
				</Group>
			</>}
		</>
	);
};



export default TimetableGrid

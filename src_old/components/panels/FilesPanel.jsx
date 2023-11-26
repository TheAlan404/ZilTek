import { Badge, Center, Flex, Grid, Group, List, Paper, Stack, Text, Header, Space, ActionIcon, Button, SimpleGrid, Tooltip, Menu, Box, Table, FileButton, FileInput, Checkbox, TextInput } from '@mantine/core'
import React, { Component } from 'react'
import fileStorage from "../../api/fileStorage";
import { IconBrandYoutube, IconCheck, IconCursorText, IconCut, IconDownload, IconPlayerPlay, IconPlus, IconReload, IconSpacingHorizontal, IconTrash, IconUpload, IconVolume } from '@tabler/icons';
import s from '../../api/lang';
import importManager from '../../api/importManager';
import controller from '../../api/controller';
import { openModal } from '@mantine/modals';
import ImportFromYoutubeModal from '../modals/ImportFromYoutubeModal';
import { showNotification } from '@mantine/notifications';
import { useHover } from '@mantine/hooks';
import AudioEditorModal from '../modals/AudioEditorModal';

function HoverableIcon(props) {
	const { hovered, ref } = useHover();
	return (
		<div ref={ref}>
			{false ? <Checkbox /> : <IconVolume />}
		</div>
	);
}


class FileRenameModal extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<TextInput label={s("filename")} />
		);
	}
}


class FilesPanel extends Component {
	constructor(props) {
		super(props)

		this.inputRef = React.createRef();

		this.state = {
			files: fileStorage.getFiles(),
		}
	}

	componentDidMount() {
		fileStorage.subscribeUpdate(() => {
			this.setState({
				files: fileStorage.getFiles(),
			})
		});
	}

	updateNOW() {
		this.setState({
			files: fileStorage.getFiles(),
		})
	}

	render() {
		return (
			<Paper>
				<input style={{ display: "none" }}
					type="file"
					multiple
					onChange={(e) => importManager.bulk(Array.from(e.currentTarget.files))}
					ref={this.inputRef} />
				<Header>
					<Group position='apart'>
						<Group>
							{s("filesHeader")}
							<Text c="dimmed">
								({this.state.files.length} {s("files")})
							</Text>
						</Group>
						<Group>
							<Menu shadow="md" width={200}>
								<Menu.Target>
									<Tooltip label={s("addMelody")}>
										<ActionIcon>
											<IconPlus />
										</ActionIcon>
									</Tooltip>
								</Menu.Target>
								<Menu.Dropdown>
									<Menu.Item
										icon={<IconUpload />}
										onClick={() => this.inputRef.current.click()}>
										{s("upload")}
									</Menu.Item>
									<Menu.Item
										icon={<IconBrandYoutube />}
										onClick={() => openModal({
											title: <>
												<Group>
													<IconBrandYoutube />
													<Text>{s("fromYoutube")}</Text>
												</Group>
											</>,
											children: (<ImportFromYoutubeModal />),
											size: "lg",
										})}>
										{s("fromYoutube")}
									</Menu.Item>
								</Menu.Dropdown>
							</Menu>

							<Tooltip label={s("clickToRefresh")}>
								<ActionIcon
									onClick={() => this.updateNOW()}>
									<IconReload />
								</ActionIcon>
							</Tooltip>
						</Group>
					</Group>
				</Header>

				<Table highlightOnHover>
					<tbody>
						{this.state.files.map(f =>
							<tr key={f.filename}>
								<td>
									{this.renderFile(f)}
								</td>
							</tr>)}
					</tbody>
				</Table>
			</Paper>
		)
	}

	renderFile(f) {
		return <Grid>
			<Grid.Col span="auto">
				<Group>
					<HoverableIcon />
					<div>
						<Text style={{ overflowX: "auto" }}>{f.filename}</Text>
						{f.builtIn && <Badge>Built-In</Badge>}
					</div>
				</Group>
			</Grid.Col>
			<Grid.Col span="content">
				<Group>
					<Tooltip.Group>
						<Tooltip label={s("play")}>
							<ActionIcon
								onClick={() => controller.playAudioByName(f.filename)}>
								<IconPlayerPlay />
							</ActionIcon>
						</Tooltip>
						{/* <Tooltip label={s("cutMelody")}>
							<ActionIcon
								onClick={() => {
									openModal({
										title: s("cutMelody"),
										children: (<AudioEditorModal />),
										size: "lg",
									});
								}}>
								<IconCut />
							</ActionIcon>
						</Tooltip> */}
						{/* <Tooltip label={s("rename")}>
							<ActionIcon
								onClick={() => {
									openModal({
										title: s("rename"),
										children: (
											<>
												<FileRenameModal />
											</>
										),
									});
								}}>
								<IconCursorText />
							</ActionIcon>
						</Tooltip> */}
						<Tooltip label={s("download")}>
							<ActionIcon
								component="a"
								download={f.filename}
								href={URL.createObjectURL(new Blob([f.file]))}>
								<IconDownload />
							</ActionIcon>
						</Tooltip>
						<Tooltip label={s("delete")}>
							<ActionIcon
								disabled={f.builtIn}
								onClick={() => fileStorage.deleteFile(f.filename)}>
								<IconTrash />
							</ActionIcon>
						</Tooltip>
					</Tooltip.Group>
				</Group>
			</Grid.Col>
		</Grid>;
	}
}

export default FilesPanel

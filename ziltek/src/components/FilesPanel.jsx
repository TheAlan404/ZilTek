import { Badge, Center, Flex, Grid, Group, List, Paper, Stack, Text, Header, Space, ActionIcon, Button, SimpleGrid, Tooltip, Menu, Box } from '@mantine/core'
import React, { Component } from 'react'
import fileStorage from "../fileStorage";
import { IconBrandYoutube, IconPlus, IconReload, IconSpacingHorizontal, IconUpload, IconVolume } from '@tabler/icons';
import s from '../lang';

class FilesPanel extends Component {
	constructor(props) {
		super(props)

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

	render() {
		return (
			<Paper>
				<Header>
					<Group position='apart'>
						<Group>
							{s("filesHeader")}
							<Text dimmed>
								({this.state.files.length} {s("files")})
							</Text>
						</Group>
						<Group>
							<Tooltip.Group>
								<Tooltip label={s("addMelody")}>
									<Menu shadow="md" width={200}>
										<Menu.Target>
											<ActionIcon>
												<IconPlus />
											</ActionIcon>
										</Menu.Target>
										<Menu.Dropdown>
											<Menu.Item
												icon={<IconUpload />}>
												{s("upload")}
											</Menu.Item>
											<Menu.Item
												icon={<IconBrandYoutube />}>
												{s("fromYoutube")}
											</Menu.Item>
										</Menu.Dropdown>
									</Menu>
								</Tooltip>
								<Tooltip label={s("clickToRefresh")}>
									<ActionIcon
										onClick={() => this.forceUpdate()}>
										<IconReload />
									</ActionIcon>
								</Tooltip>
							</Tooltip.Group>
						</Group>
					</Group>
				</Header>

				<SimpleGrid cols={1}>
					{this.state.files.map(f =>
						<Box sx={(theme) => ({
							"&:hover": theme.fn.hover({
								backgroundColor: theme.colors.hover,
							})
						})}>
								<Grid>
									<Grid.Col span="auto">
										<Group>
											<IconVolume />
											<Text>{f.filename}</Text>
											{f.builtIn && <Badge>Built-In</Badge>}
										</Group>
									</Grid.Col>
									<Grid.Col span="content">
										<Group>
											<Tooltip.Group>
												<Tooltip label={s("trimAudio")}>
													<ActionIcon>
														<IconSpacingHorizontal />
													</ActionIcon>
												</Tooltip>
											</Tooltip.Group>
										</Group>
									</Grid.Col>
								</Grid>
						</Box>)}
				</SimpleGrid>
			</Paper>
		)
	}
}

export default FilesPanel

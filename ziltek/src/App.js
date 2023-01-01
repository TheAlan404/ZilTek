import { Container, Grid, Header, MantineProvider, Text, Space, Group, Button, LoadingOverlay, Loader, Center, Tooltip } from '@mantine/core';
import TimetableGrid from './components/TimetableGrid';
import { DummyTimetable2 } from './dummy';
import React, { Component } from 'react'
import MainLayout from './page/MainLayout';
import controller from './controller';
import { IconEdit } from "@tabler/icons";
import EditModeButtons from './components/EditModeButtons';
import fileStorage from './fileStorage';
import s from './lang';
import { NotificationsProvider } from '@mantine/notifications';
import EditorLayout from './page/EditorLayout';
import AppTitle from './components/AppTitle';

class App extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loadingText: "",
			errorText: "",
			mode: "edit", // "view" | "edit"
			isAudioPlaying: false,
		};
	}

	componentDidMount() {
		/*fileStorage.initialize({
			status: (t) => this.setState({ loadingText: t }),
			error: (e) => {
				console.log(e);
				this.setState({
					errorText: e.toString(),
					loadingText: "Error!",
				})
			},
			success: () => {
				this.setState({
					loadingText: "",
				});
			},
		});*/

		controller.loadData();

		controller.events.playing = () => {
			this.setState({ isAudioPlaying: true });
		};

		controller.events.stopped = () => {
			this.setState({ isAudioPlaying: false });
		};
	}


	render() {
		return (
			<>
				<Header>
					<Group position="apart" height="3em" p="sm" m="auto">
						<AppTitle />
						<Group>
							{this.state.isAudioPlaying ? <>
								<Tooltip label={s("clickToStopAudio")}>
									<Button
										compact
										variant='light'
										color="green"
										onClick={() => controller.stopAudio()}>
										{s("audioPlaying")}
									</Button>
								</Tooltip>
							</> : <>

							</>}
						</Group>
						<Group>
							{this.state.mode == "view" ? <Button
								variant='light'
								color="violet"
								leftIcon={<IconEdit />}
								onClick={() => this.setState({ mode: "edit" })}>
								Edit Mode
							</Button> : <EditModeButtons
								onClickExit={() => this.setState({ mode: "view" })}
							/>}
						</Group>
					</Group>
				</Header>

				<div>
					<LoadingOverlay
						visible={!!this.state.loadingText}
						loader={<Center>
							<Loader color="violet" />
							<Space w="md" />
							<br />
							<Text>{this.state.loadingText}</Text>
							<Text color="red">{this.state.errorText}</Text>
						</Center>}>
					</LoadingOverlay>

					<Space h="md" />

					<Container size="xl" px="xs">
						{this.state.mode == "view" ? <>
							<MainLayout />
						</> : <>
							<EditorLayout />
						</>}
					</Container>
				</div>
			</>
		)
	}
}

export default App;

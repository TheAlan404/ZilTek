import { Container, Grid, Header, MantineProvider, Text, Space, Group, Button, LoadingOverlay, Loader, Center } from '@mantine/core';
import TimetableGrid from './components/TimetableGrid';
import { DummyTimetable2 } from './dummy';
import React, { Component } from 'react'
import MainLayout from './page/MainLayout';
import controller from './controller';
import { IconEdit } from "@tabler/icons";
import EditModeButtons from './components/EditModeButtons';
import fileStorage from './fileStorage';

class App extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loadingText: "Loading...",
			errorText: "",
			mode: "view", // "view" | "edit"
		};
	}

	componentDidMount() {
		fileStorage.initialize({
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
				})
			},
		});
	}


	render() {
		return (
			<>
				<MantineProvider
					withGlobalStyles
					withNormalizeCSS
					theme={{ colorScheme: 'dark' }}>

					<Header>
						<Group position="apart" height="3em" p="sm" m="auto">
							<Text>ZilTek <Text c="dimmed" span fz="sm">by dennis</Text></Text>
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


					<LoadingOverlay
						visible={!!this.state.loadingText}
						loader={<Center>
							<Loader color="violet" />
							<Space w="md" />
							<br />
							<Text>{this.state.loadingText}</Text>
							<Text color="red">{this.state.errorText}</Text>
						</Center>}>
						<Space h="md" />

						{this.state.mode == "view" ? <>
							<MainLayout />
						</> : <>
						</>}
					</LoadingOverlay>
				</MantineProvider>
			</>
		)
	}
}

export default App;

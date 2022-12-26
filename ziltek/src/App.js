import { Container, Grid, Header, MantineProvider, Text, Space, Group, Button } from '@mantine/core';
import TimetableGrid from './components/TimetableGrid';
import { DummyTimetable2 } from './dummy';
import React, { Component } from 'react'
import MainLayout from './page/MainLayout';
import controller from './controller';
import { IconEdit } from "@tabler/icons";
import EditModeButtons from './components/EditModeButtons';

class App extends Component {
	constructor(props) {
		super(props)

		this.state = {
			mode: "view", // "view" | "edit"
		};
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

					<Space h="md" />

					{this.state.mode == "view" ? <>
						<MainLayout />
					</> : <>
					</>}

				</MantineProvider>
			</>
		)
	}
}

export default App;

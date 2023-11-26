import { Container, Grid, Header, MantineProvider, Text, Space, Group, Button, LoadingOverlay, Loader, Center, Tooltip } from '@mantine/core';
import TimetableGrid from './components/TimetableGrid';
import { DummyTimetable2 } from './api/dummy';
import React, { Component } from 'react'
import MainLayout from './layouts/MainLayout';
import controller from './api/controller';
import { IconEdit } from "@tabler/icons";
import EditModeButtons from './components/EditModeButtons';
import fileStorage from './api/fileStorage';
import s from './api/lang';
import { NotificationsProvider } from '@mantine/notifications';
import EditorLayout from './layouts/EditorLayout';
import AppTitle from './components/page/AppTitle';

function Layout() {
	const [loading, setLoading] = useState(false);
	const [loadingText, setLoadingText] = useState("");

	const [mode, setMode] = useState("view"); // "view" | "edit"

	return (
		<>
			

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
	);
}

class Appaaa extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loadingText: "",
			errorText: "",
			mode: "view", // "view" | "edit"
			isAudioPlaying: false,
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
				controller.loadData();
				controller.setupInterval();
				this.setState({
					loadingText: "",
				});
			},
		});

		controller.events.playing = () => {
			this.setState({ isAudioPlaying: true });
		};

		controller.events.stopped = () => {
			this.setState({ isAudioPlaying: false });
		};

		controller.sub("suppressed", () => {
			this.setState({ isSuppressed: true });
			setTimeout(() => this.setState({ isSuppressed: false }), 10000);
		});
	}
}

export default Layout;

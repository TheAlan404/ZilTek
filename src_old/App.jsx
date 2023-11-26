import { Container, Grid, Header, MantineProvider, Text, Space, Group, Button, LoadingOverlay, Loader, Center, Tooltip } from '@mantine/core';
import TimetableGrid from './components/TimetableGrid';
import { DummyTimetable2 } from './api/dummy';
import React, { Suspense, useState } from 'react'
import Layout from './Layout';
import AppAPI from './layers/AppAPI';
import LogsProvider from './layers/LogsProvider';
import DatabaseProvider from './layers/DatabaseProvider';
import Controller from './layers/Controller';
import LangProvider from './layers/Lang';
import { HostContext } from './contexts/HostContext';
import { useLocalStorage } from '@mantine/hooks';

function App() {
	let [hostMode, setHostMode] = useState();
	let [remoteList, setRemoteList] = useLocalStorage({
		key: "ziltek-remotes",
		defaultValue: [],
	});

	return (
		<Suspense fallback={
			<Center>
				<Loader color="violet" />
			</Center>
		}>
			<HostContext.Provider value={{
				hostMode,
				setHostMode,
				remoteList,
				setRemoteList,
			}}>

			</HostContext.Provider>
		</Suspense>
	);
}

export default App;

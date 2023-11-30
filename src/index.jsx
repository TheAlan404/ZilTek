import "./i18n";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ModalsProvider } from "@mantine/modals";
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';


import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';

import AppBase from './AppBase';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        defaultColorScheme="dark">
        <Notifications />
        <ModalsProvider>
            <AppBase />
        </ModalsProvider>
    </MantineProvider>
);

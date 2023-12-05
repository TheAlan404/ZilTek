import React from 'react';
import ReactDOM from 'react-dom/client';
import { ModalsProvider } from "@mantine/modals";
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { I18nextProvider } from "react-i18next";

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';

import AppBase from './AppBase';
import i18n from "./i18n";

const theme = createTheme({
    colors: {
        dark: [
            '#C1C2C5',
            '#A6A7AB',
            '#909296',
            '#5c5f66',
            '#373A40',
            '#2C2E33',
            '#25262b',
            '#1A1B1E',
            '#141517',
            '#101113',
        ],
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        defaultColorScheme="dark"
        theme={theme}>
        <I18nextProvider i18n={i18n} defaultNS={[]}>
            <Notifications />
            <ModalsProvider>
                <AppBase />
            </ModalsProvider>
        </I18nextProvider>
    </MantineProvider>
);

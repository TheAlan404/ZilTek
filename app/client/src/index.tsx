import React from 'react';
import ReactDOM from 'react-dom/client';
import { ModalsProvider } from "@mantine/modals";
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { I18nextProvider, useTranslation } from "react-i18next";

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import './styles.css';
import 'dayjs/locale/en';
import 'dayjs/locale/tr';

import i18n from "./i18n";
import { DatesProvider } from "@mantine/dates";
import { BaseRouter } from "./BaseRouter";

const theme = createTheme({
    cursorType: "pointer",
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
    components: {
        Tooltip: {
            defaultProps: {
                color: "dark",
            },
            styles: {
                color: "var(--mantine-color-text)"
            }
        }
    }
});

const Wrapper = () => {
    const { i18n } = useTranslation();

    return (
        <DatesProvider settings={{
            locale: i18n.language,
            weekendDays: [0],
            timezone: 'UTC'
        }}>
            <Notifications />
            <BaseRouter />
        </DatesProvider>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <MantineProvider
        defaultColorScheme="dark"
        theme={theme}>
        <I18nextProvider i18n={i18n} defaultNS={[]}>
            <Wrapper />
        </I18nextProvider>
    </MantineProvider>
);

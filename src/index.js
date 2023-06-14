import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from '@mantine/notifications';
import { MantineProvider } from '@mantine/core';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme: 'dark' }}>
        <NotificationsProvider>
            <ModalsProvider>
                <App />
            </ModalsProvider>
        </NotificationsProvider>
    </MantineProvider>
);

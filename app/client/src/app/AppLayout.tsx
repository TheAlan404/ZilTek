import { AppShell, Flex, Group } from "@mantine/core";
import { AppTitle } from "./components/view/AppTitle";
import { AppHeader } from "./components/view/AppHeader";
import { OnlineBadge } from "./components/view/OnlineBadge";
import { PageChangeButton } from "./components/view/PageChangeButton";
import { Outlet } from "react-router-dom"
import { useTranslation } from "react-i18next";
import { ModalsProvider } from "@mantine/modals";
import { DropzoneProvider } from "./DropzoneProvider";

export const AppLayout = () => {
    const [t] = useTranslation();

    return (
        <ModalsProvider labels={{
            confirm: t("modals.confirm"),
            cancel: t("modals.cancel"),
        }}>
            <DropzoneProvider />
            <AppShell
                header={{ height: 60 }}
            >
                <AppShell.Header>
                    <Flex px="md" h="100%" justify="space-between" align="center">
                        <AppTitle />
                        <AppHeader />
                        <Group>
                            <OnlineBadge />
                            <PageChangeButton />
                        </Group>
                    </Flex>
                </AppShell.Header>
                <AppShell.Main>
                    <Outlet />
                </AppShell.Main>
            </AppShell>
        </ModalsProvider>
    )
};

import { Space, Tabs } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconFileMusic, IconListDetails, IconMusic, IconSettings } from "@tabler/icons-react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";

export const EditorPage = () => {
    let { t } = useTranslation();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { target } = useParams();

    const section = pathname.split("/")[3] || "";

    return (
        <Tabs value={"/"+section} onChange={(v) => navigate(`/${target}/editor${v}`)}>
            <Tabs.List grow>
                <Tabs.Tab value="/" leftSection={<IconSettings />}>{t("editor.tabs.main")}</Tabs.Tab>
                <Tabs.Tab value="/schedule" leftSection={<IconListDetails />}>{t("editor.tabs.schedule")}</Tabs.Tab>
                <Tabs.Tab value="/files" leftSection={<IconFileMusic />}>{t("editor.tabs.files")}</Tabs.Tab>
            </Tabs.List>

            <Outlet />

            <Space h="50vh" />
        </Tabs>
    );
};

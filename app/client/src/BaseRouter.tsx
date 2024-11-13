import { createHashRouter, Router, RouterProvider } from "react-router-dom";
import { AppLayout } from "./app/AppLayout";
import { EditorPage } from "./app/pages/Editor";
import { ViewPage } from "./app/pages/View";
import { Landing } from "./landing/Landing";
import { AppBase } from "./landing/AppBase";
import { EditorMainTab } from "./app/pages/editor/main/EditorMainTab";
import { EditorScheduleTab } from "./app/pages/editor/schedule/EditorScheduleTab";
import { EditorFilesTab } from "./app/pages/editor/files/EditorFilesTab";

const router = createHashRouter([
    {
        path: "/",
        children: [
            {
                index: true,
                element: <Landing />,
            },
            {
                path: ":target",
                element: <AppBase />,
                children: [
                    {
                        element: <AppLayout />,
                        children: [
                            {
                                index: true,
                                element: <ViewPage />,
                            },
                            {
                                path: "editor",
                                element: <EditorPage />,
                                children: [
                                    {
                                        index: true,
                                        element: <EditorMainTab />,
                                    },
                                    {
                                        path: "schedule",
                                        element: <EditorScheduleTab />,
                                    },
                                    {
                                        path: "files",
                                        element: <EditorFilesTab />,
                                    },
                                ],
                            },
                        ],
                    }
                ]
            }
        ]
    }
]);

export const BaseRouter = () => {
    return (
        <RouterProvider
            router={router}
        />
    )
};

import { createHashRouter, Router, RouterProvider } from "react-router-dom";
import { AppLayout } from "./app/AppLayout";
import { EditorPage } from "./app/pages/Editor";
import { ViewPage } from "./app/pages/View";
import { Landing } from "./landing/Landing";
import { AppBase } from "./landing/AppBase";

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

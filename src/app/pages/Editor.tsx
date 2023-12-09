import { useState } from "react";

type Page = "main" | "files" | "schedule";

export const EditorPage = () => {
    let [page, setPage] = useState<Page>("main");

    return (
        "edit."
    );
};

import { useTranslation } from "react-i18next";
import { StoredFile } from "../../../host/ControllerAPI";
import { Select } from "@mantine/core";

export const MelodySelect = ({
    files,
    value,
    onChange,
    label,
}: {
    files: StoredFile[],
    value: string,
    onChange: (v: string) => void,
    label: React.ReactNode,
}) => {
    const { t } = useTranslation();

    return (
        <Select
            searchable
            label={label}
            data={files.map(f => f.filename)}
            placeholder={files.length ? t("edit.pickAFile") : t("errors.noFiles")}
            value={value}
            onChange={onChange}
        />
    );
}

import { useTranslation } from "react-i18next";
import { Button, Select } from "@mantine/core";
import { Melody } from "@ziltek/common/src/Melody";
import { modals } from "@mantine/modals";
import { IconMusicCog } from "@tabler/icons-react";

export const MelodySelect = ({
    value,
    onChange,
}: {
    value: Melody;
    onChange: (m: Melody) => void;
}) => {
    const { t } = useTranslation();

    return (
        <Button
            variant="outline"
            leftSection={<IconMusicCog />}
            onClick={() => {
                modals.openConfirmModal({

                });
            }}
        >
            {value.filename}
        </Button>
    );
}

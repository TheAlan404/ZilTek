import { useTranslation } from "react-i18next";
import useMobile from "../../../hooks/useMobile"
import { BUILD, VERSION } from "../../../meta";
import { Fieldset, Flex, Stack, Text } from "@mantine/core";

export const EditorMainTab = () => {
    const { t } = useTranslation();
    const isMobile = useMobile();

    return (
        <Flex justify="center" pb="xl" mb="xl">
            <Fieldset
                w={isMobile ? "100%" : "50%"}
                mb="xl"
                legend={t("editor.sections.ziltek.title")}>
                <Stack>
                    <Text>{t("editor.sections.ziltek.desc", {
                        version: VERSION,
                        build: BUILD,
                    })}</Text>
                    
                </Stack>
            </Fieldset>
        </Flex>
    )
}

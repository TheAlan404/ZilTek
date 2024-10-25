import { ActionIcon, Fieldset, Group, Highlight, Stack, Tooltip } from "@mantine/core";
import { BUILD, VERSION } from "../../../../meta";
import { useTranslation } from "react-i18next";
import { IconExternalLink } from "@tabler/icons-react";

const AUTHOR = "dennis";
const highlightStyles = {
    backgroundImage:
        'linear-gradient(45deg, var(--mantine-color-cyan-5), var(--mantine-color-indigo-5))',
    fontWeight: 700,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
};

export const ZilTekSection = () => {
    const { t } = useTranslation();

    return (
        <Fieldset
            legend={t("editor.sections.ziltek.title")}>
            <Stack ta="center">
                <Highlight
                    highlight={[VERSION, BUILD]}
                    highlightStyles={highlightStyles}
                >{t("editor.sections.ziltek.desc", {
                    version: VERSION,
                    build: BUILD,
                })}</Highlight>

                <Group justify="center">
                    <Highlight
                        highlight={["ZilTek", AUTHOR]}
                        color="violet"
                        highlightStyles={{
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                        {t("editor.sections.ziltek.made_by", { author: AUTHOR })}
                    </Highlight>
                    <Tooltip label={t("editor.sections.ziltek.website")}>
                        <ActionIcon
                            component="a"
                            variant="subtle"
                            href="https://deniz.blue/"
                            target="_blank"
                            color="dark">
                            <IconExternalLink />
                        </ActionIcon>
                    </Tooltip>
                </Group>
                {/* hostMode == "local" && <UpdateChecker /> */}
            </Stack>
        </Fieldset>
    );
};
import { Accordion, Checkbox, Code, Fieldset, Group, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDebug } from "../../../../hooks/useDebug";

export const DebugSection = () => {
    const { t } = useTranslation();
    const { categories, setCategories } = useDebug();

    const VALUES = [
        "clock",
        "socket",
        "timeStates",
        "network",
        "command",
    ];

    return (
        <Fieldset
            legend={t("editor.advanced")}>
            <Accordion>
                <Accordion.Item value="debug">
                    <Accordion.Control>
                        {t("editor.debug")}
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Stack>
                            {VALUES.map(key => (
                                <Group key={key}>
                                    <Checkbox
                                        checked={categories[key]}
                                        onChange={e => setCategories({
                                            ...categories,
                                            [key]: e.currentTarget.checked,
                                        })}
                                    />
                                    <Code>{key}</Code>
                                </Group>
                            ))}
                        </Stack>
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </Fieldset>
    );
};

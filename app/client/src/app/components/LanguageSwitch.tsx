import { useTranslation } from "react-i18next";
import { SegmentedControl } from "@mantine/core";

export const LanguageSwitch = () => {
	const { i18n } = useTranslation();

	return (
		<SegmentedControl
            value={i18n.resolvedLanguage}
            onChange={(v) => i18n.changeLanguage(v)}
            data={[
                { value: "en", label: "English" },
                { value: "tr", label: "Türkçe" },
            ]}
        />
	)
}

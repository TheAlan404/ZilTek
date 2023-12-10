import { useMediaQuery } from "@mantine/hooks";
import { useMantineTheme } from "@mantine/core";

export default function useMobile() {
    let theme = useMantineTheme();
    return useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);
}

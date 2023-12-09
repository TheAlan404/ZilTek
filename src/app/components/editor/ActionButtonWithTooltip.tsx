import { ActionIcon, MantineColor, Tooltip } from "@mantine/core"

export const ActionButtonWithTooltip = ({
    label,
    color = "gray",
    icon,
    onClick,
}: {
    label: React.ReactNode,
    icon: React.ReactNode,
    color: MantineColor,
    onClick: () => void,
}) => {
    return (
        <Tooltip label={label}>
            <ActionIcon
                onClick={onClick}
                color={color}
                variant="subtle"
            >
                {icon}
            </ActionIcon>
        </Tooltip>
    )
}
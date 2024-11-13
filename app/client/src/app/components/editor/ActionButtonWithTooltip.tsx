import { ActionIcon, MantineColor, Tooltip } from "@mantine/core"

export const ActionButtonWithTooltip = ({
    label,
    color = "gray",
    icon,
    onClick,
    loading,
}: {
    label: React.ReactNode,
    icon: React.ReactNode,
    color?: MantineColor,
    onClick?: () => void,
    loading?: boolean;
}) => {
    return (
        <Tooltip label={label}>
            <ActionIcon
                onClick={onClick}
                color={color}
                variant="light"
                loading={loading}
            >
                {icon}
            </ActionIcon>
        </Tooltip>
    )
}
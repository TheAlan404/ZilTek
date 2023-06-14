import React from 'react'
import { ActionIcon, Badge, Button, Group, Popover, SegmentedControl, Select, Text, Tooltip, UnstyledButton } from '@mantine/core';
import { IconTool } from '@tabler/icons';
import s from '../api/lang';
import controller from "../api/controller.js";

function AppTitle() {
    return <Group>
        <Popover>
            <Popover.Target>
                <Button
                    leftIcon={<IconTool />}
                    color="gray"
                    variant='light'>
                    <Text>ZilTek <Text c="dimmed" span fz="sm">by dennis</Text></Text>
                </Button>
            </Popover.Target>
            <Popover.Dropdown>
                <Select
                    label="Language"
                    data={s.languages.map(l => ({ value: l.id, label: `[${l.id.toUpperCase()}] ${l.label}` }))}
                    value={s.currentLang}
                    onChange={(id) => {
                        s.setLang(id);
                        window.location.reload();
                    } } />
            </Popover.Dropdown>
        </Popover>
        <Tooltip label={"Version " + controller.version}>
            <Badge
                radius="xs"
                variant='outline'
                color="orange">
                BETA
            </Badge>
        </Tooltip>
    </Group>;
}

export default AppTitle;
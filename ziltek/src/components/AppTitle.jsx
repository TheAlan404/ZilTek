import React from 'react'
import { ActionIcon, Button, Group, Popover, SegmentedControl, Select, Text, Tooltip, UnstyledButton } from '@mantine/core';
import { IconTool } from '@tabler/icons';
import s from '../lang';

class AppTitle extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
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
                        }}
                        />
                </Popover.Dropdown>
            </Popover>
		);
	}
}

export default AppTitle;
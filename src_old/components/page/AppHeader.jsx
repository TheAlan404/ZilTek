import { Button, Group, Header, Tooltip } from '@mantine/core';
import React, { useContext } from 'react';
import AppTitle from './AppTitle';
import { ControllerContext } from '../../contexts/ControllerContext';

export default function AppHeader() {
    let {
        isPlaying,
        stopAudio,
        setBellStatus,
    } = useContext(ControllerContext);

    return (
        <Header>
            <Group position="apart" height="3em" p="sm" m="auto">
                <AppTitle />
                <Group>
                    {isPlaying && <>
                        <Tooltip label={s("clickToStopAudio")}>
                            <Button
                                compact
                                variant='light'
                                color="green"
                                onClick={() => stopAudio()}>
                                {s("audioPlaying")}
                            </Button>
                        </Tooltip>
                    </>}
                    {this.state.isSuppressed && <>
                        <Tooltip label={s("clickToTurnOnBell")}>
                            <Button
                                compact
                                variant='light'
                                color="red"
                                onClick={() => {
                                    setBellStatus(true);
                                }}>
                                {s("bellSuppressed")}
                            </Button>
                        </Tooltip>
                    </>}
                </Group>
                <Group>
                    {this.state.mode == "view" ? <Button
                        variant='light'
                        color="violet"
                        leftIcon={<IconEdit />}
                        onClick={() => this.setState({ mode: "edit" })}>
                        {s("editMode")}
                    </Button> : <EditModeButtons
                        onClickExit={() => this.setState({ mode: "view" })}
                    />}
                </Group>
            </Group>
        </Header>
    );
}

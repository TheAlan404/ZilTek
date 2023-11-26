import React, { useContext } from 'react'
import { HostContext } from '../contexts/HostContext'
import { Center, Text } from '@mantine/core';

const HostSelection = () => {
    let { hostMode, setHostMode, remoteList, setRemoteList } = useContext(HostContext);

    return (
        <Center>
            <Text h={1}>ZilTek</Text>

            
        </Center>
    )
}

export default HostSelection

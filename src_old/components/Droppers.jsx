import React, { Component } from 'react'
import { Dropzone } from "@mantine/dropzone"
import { IconDragDrop, IconUpload } from '@tabler/icons'
import s from '../lang'
import importManager from '../importManager'

class Droppers extends Component {
    render() {
        return (
            <>
                <Dropzone.FullScreen
                    onDrop={(files) => importManager.bulk(files)}>
                    <Group position="center" spacing="xl">
                        <Dropzone.Accept>
                            <IconUpload
                                size={50}
                                stroke={1.5}
                            />
                        </Dropzone.Accept>
                        
                        <Dropzone.Idle>
                            <IconDragDrop size={50} stroke={1.5} />
                        </Dropzone.Idle>

                        <div>
                            <Text size="xl" inline>
                                {s("dropperTitle")}
                            </Text>
                            <Text size="sm" color="dimmed" inline mt={7}>
                                {s("dropperText")}
                            </Text>
                        </div>
                    </Group>
                </Dropzone.FullScreen>
            </>
        )
    }
}

export default Droppers

import { ActionIcon, Button, Tooltip } from '@mantine/core'
import { IconFileDownload, IconFileExport, IconFileImport, IconFileUpload } from '@tabler/icons'
import React, { Component } from 'react'

class EditModeButtons extends Component {
  render() {
    return (
      <>
        <Tooltip.Group openDelay={0}>
            <Tooltip label="Import">
                <ActionIcon>
                    <IconFileUpload />
                </ActionIcon>
            </Tooltip>
            <Tooltip label="Export">
                <ActionIcon>
                    <IconFileDownload />
                </ActionIcon>
            </Tooltip>
        </Tooltip.Group>
        <Button
            onClick={this.props.onClickExit}
            variant="light"
            color="red">
            Exit Edit Mode
        </Button>
      </>
    )
  }
}

export default EditModeButtons

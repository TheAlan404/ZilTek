import { ActionIcon, Button, Tooltip } from '@mantine/core'
import { IconFileDownload, IconFileExport, IconFileImport, IconFileUpload, IconTrash } from '@tabler/icons'
import React, { Component } from 'react'
import controller from '../controller'

class EditModeButtons extends Component {
	render() {
		return (
			<>
				<Tooltip.Group openDelay={0}>
					<Tooltip label="[DEV] Erase All Data (no confirmation!)">
						<ActionIcon
							onClick={() => controller.eraseAllData()}>
							<IconTrash />
						</ActionIcon>
					</Tooltip>
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

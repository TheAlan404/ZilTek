import { ActionIcon, Button, Text, Tooltip } from '@mantine/core'
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from '@mantine/notifications';
import { IconFileDownload, IconFileExport, IconFileImport, IconFileUpload, IconTrash } from '@tabler/icons'
import React, { Component } from 'react'
import controller from '../api/controller'
import importManager from '../api/importManager'
import s from '../api/lang'

class EditModeButtons extends Component {
	constructor(props) {
	  super(props)
	
	  this.inputRef = React.createRef();
	}
	
	render() {
		return (
			<>
				<input style={{ display: "none" }}
					type="file"
					accept='application/zip'
					onChange={(e) => {
						let [file] = e.currentTarget.files;
						console.log("import input", file);
						if(!["application/x-zip-compressed",
						"application/zip"
						].includes(file.type)) return;
						importManager.import(file);
					}}
					ref={this.inputRef} />
				<Tooltip.Group openDelay={0}>
					<Tooltip label={s("deleteAllData")}>
						<ActionIcon
							onClick={() => {
								openConfirmModal({
									title: s("delete"),
									centered: true,
									children: (
										<Text>
											{s("deleteConfirmation")}
										</Text>
									),
									labels: {
										confirm: s("delete"),
										cancel: s("cancel"),
									},
									confirmProps: { color: 'red' },
									onCancel: () => {},
									onConfirm: () => {
										showNotification({
											message: s("dataDeleted"),
											color: "red",
										});
										importManager.deleteAll();
										controller.loadData();
									},
								})
							}}>
							<IconTrash />
						</ActionIcon>
					</Tooltip>
					<Tooltip label={s("import")}>
						<ActionIcon
							onClick={() => this.inputRef.current.click()}>
							<IconFileUpload />
						</ActionIcon>
					</Tooltip>
					<Tooltip label={s("export")}>
						<ActionIcon
							onClick={() => importManager.export()}>
							<IconFileDownload />
						</ActionIcon>
					</Tooltip>
				</Tooltip.Group>
				<Button
					onClick={this.props.onClickExit}
					variant="light"
					color="red">
					{s("viewMode")}
				</Button>
			</>
		)
	}
}

export default EditModeButtons

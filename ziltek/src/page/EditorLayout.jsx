import React, { Component } from 'react'
import TimetableEditorPanel from '../components/TimetableEditorPanel'
import { Grid } from '@mantine/core'
import FilesPanel from '../components/FilesPanel'
import MelodyEditorPanel from '../components/panels/MelodyEditorPanel'

class EditorLayout extends Component {
  render() {
    return (
      <>
        <Grid gutter={50}>
          <Grid.Col span={4}>
            <FilesPanel />
          </Grid.Col>
          <Grid.Col span={4}>
            <TimetableEditorPanel />
          </Grid.Col>
          <Grid.Col span={4}>
            <MelodyEditorPanel />
          </Grid.Col>
        </Grid>

      </>
    )
  }
}

export default EditorLayout

import React, { Component } from 'react'
import TimetableEditorPanel from '../components/TimetableEditorPanel'
import { Grid } from '@mantine/core'
import FilesPanel from '../components/FilesPanel'

class EditorLayout extends Component {
  render() {
    return (
      <>
        <Grid>
          <Grid.Col span={4}>
            <FilesPanel />
          </Grid.Col>
          <Grid.Col span={4}>
            <TimetableEditorPanel />
          </Grid.Col>
        </Grid>

      </>
    )
  }
}

export default EditorLayout

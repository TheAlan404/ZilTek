import React, { Component } from 'react'

class FilesPanel extends Component {
  render() {
    return (
      <>
        <Grid>
            <Grid.Col span={3}>
              <TimetableGrid
                timetable={controller.getTimetableToday()}
                readonly
              />
            </Grid.Col>
          </Grid>
      </>
    )
  }
}

export default FilesPanel

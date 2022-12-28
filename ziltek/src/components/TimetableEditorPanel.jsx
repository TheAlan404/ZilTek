import { NativeSelect } from '@mantine/core'
import React, { Component } from 'react'
import TimetableGrid from './TimetableGrid';


const DATA = [
  "Main",
  ...([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ].map(d => d + " (overrides main)")),
  "Main Weekend",
  ...([
    "Saturday",
    "Sunday",
  ].map(d => d + " (overrides main weekend)")),
].map((v, i) => ({ value: i, label: v }));


class TimetableEditorPanel extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectValue: 0,
      selectedTimetable: [],
    }
  }

  setTimetableGrid(id) {
    
  }

  render() {
    return (
      <>
        <NativeSelect
          label="Select Day"
          data={DATA}
          onChange={(e) => this.setTimetableGrid(e.currentTarget.value)}
          />
        <TimetableGrid
          timetable={this.state.selectedTimetable}
          />
      </>
    )
  }
}

export default TimetableEditorPanel

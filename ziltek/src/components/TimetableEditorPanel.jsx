import { NativeSelect } from '@mantine/core'
import React, { Component } from 'react'
import TimetableGrid from './TimetableGrid'

class TimetableEditorPanel extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectValue: 0,
    }
  }


  render() {
    return (
      <>
        <NativeSelect
          label="Select Day"
          data={[
            
          ]}
          />
        <TimetableGrid />
      </>
    )
  }
}

export default TimetableEditorPanel

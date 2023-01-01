import { Button, Paper, Stack } from '@mantine/core'
import React, { Component } from 'react'
import TimetableGeneratorSegment from './TimetableGeneratorSegment'

class TimetableGenerator extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         segments: [],
      }
    }
    
  render() {
    return (
      <>
        <Stack>
            {this.state.segments.map((s, i) => (
                <Paper shadow="xs" p="md" withBorder>
                    <TimetableGeneratorSegment
                        key={i}
                        type={i ? "offset" : "startTime"}
                        onChange={(data) => this.setState((state) => {
                            state.segments[i] = Object.assign(state.segments[i], data);
                            return state;
                        })}
                        />
                </Paper>
            ))}
            <Button
                variant="light"
                onClick={() => this.setState((state) => {
                    state.segments.push({});
                    return state;
                })}>
                Add Segment
            </Button>
        </Stack>
      </>
    )
  }
}

export default TimetableGenerator

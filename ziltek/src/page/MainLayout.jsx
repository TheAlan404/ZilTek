import React, { Component } from 'react'
import { Container, Grid, Text } from '@mantine/core';
import TimetableGrid from '../components/TimetableGrid';
import { DummyTimetable2 } from '../dummy';
import controller from '../controller';

class MainLayout extends Component {
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

export default MainLayout

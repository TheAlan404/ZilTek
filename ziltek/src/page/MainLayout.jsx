import React, { Component } from 'react'
import { Container, Grid, Text } from '@mantine/core';
import TimetableGrid from '../components/TimetableGrid';
import { DummyTimetable2 } from '../dummy';
import controller from '../controller';
import PlayerControls from '../components/PlayerControls';

class MainLayout extends Component {
  constructor(props) {
    super(props)

    this.state = {
      table: [],
    }
  }

  componentDidMount() {
    this.setState({
      table: controller.getTimetableToday(),
    });

    controller.events.update.push(() => {
      console.log("update main layout table", controller.getTimetableToday());
      this.setState({
        table: controller.getTimetableToday(),
      })
    });
  }

  render() {
    return (
      <>
        <Grid>
          <Grid.Col span={3}>
            <TimetableGrid
              timetable={this.state.table}
              readonly
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <PlayerControls />
          </Grid.Col>
        </Grid>
      </>
    )
  }
}

export default MainLayout

import React, { Component } from 'react'
import { Center, Container, Grid, Group, Text } from '@mantine/core';
import TimetableGrid from '../components/TimetableGrid';
import { DummyTimetable2 } from '../api/dummy';
import controller from '../api/controller';
import PlayerControls from '../components/PlayerControls';
import Clock from '../components/Clock';

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

    controller.sub("update", () => {
      console.log("update main layout table", controller.getTimetableToday());
      this.setState({
        table: controller.getTimetableToday(),
      })
    });
  }

  render() {
    return (
      <>
        <Grid justify="space-between">
          <Grid.Col span={3}>
            <TimetableGrid
              timetable={this.state.table}
              readonly
              controllerRealtime
            />
          </Grid.Col>
          <Grid.Col span="auto">
            <Center>
              <Clock />
            </Center>
          </Grid.Col>
          <Grid.Col span="auto">
            <Group position='right'>
              <PlayerControls />
            </Group>
          </Grid.Col>
        </Grid>
      </>
    )
  }
}

export default MainLayout

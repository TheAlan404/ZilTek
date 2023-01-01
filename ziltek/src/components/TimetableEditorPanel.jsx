import { ActionIcon, Checkbox, Container, Divider, Grid, Group, Header, NativeSelect, Select, Space, Stack, Tooltip } from '@mantine/core'
import React, { Component } from 'react'
import s from '../lang';
import TimetableGrid from './TimetableGrid';
import { Text } from '@mantine/core';
import { IconPlaylistX, IconWand } from '@tabler/icons';
import controller from '../controller';
import { showNotification } from '@mantine/notifications';
import TimetableGenerator from './TimetableGenerator';
import { openModal } from '@mantine/modals';

class TimetableEditorPanel extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectValue: 0,
      isMain: true,
      isFullOverride: false,
      selectedTimetable: controller.timetables.main,
    };
  }

  componentDidMount() {
    this.setTimetableGrid(0);
  }

  setTimetableGrid(id) {
    id = Number(id);
    console.log("Changed select to", id)
    let isMain = id === 0;
    let table = structuredClone(isMain
      ? controller.timetables.main
      : (controller.timetables.overrides[id-1] || { table: [] }).table);
    let isFullOverride = isMain ? false : (controller.timetables.overrides[id-1] || { fullOverride: false }).fullOverride;
    
    console.dir({
      isMain,
      table,
      isFullOverride,
    })

    this.setState({
      selectValue: id,
      isMain,
      selectedTimetable: table,
      isFullOverride,
    });
  }

  clearTimetableButton() {

  }

  setTimetableData(data) {
    console.log("save tt data", data);
    if(this.state.isMain) {
      controller.timetables.main = data;
    } else {
      controller.timetables.overrides[this.selectValue-1].table = data;
    };

    controller.saveData();

    showNotification({
      message: "Saved",
      color: "green",
    });
  }

  render() {
    return (
      <>

        <Header>Timetables</Header>
        <Space h="md" />

        <Stack>
          <Grid justify="space-between" align="center">
            <Grid.Col span="content">
              <Text>{s("selectDay")}</Text>
            </Grid.Col>
            <Grid.Col span="auto">
              <Select
                data={new Array(8).fill(0)
                  .map((v, i) => i ? {
                    value: i.toString(),
                    label: s("day" + (i-1)),
                    group: "Overrides",
                  } : {
                    value: i.toString(),
                    label: s("mainTimetable"),
                    group: "Main",
                  })}
                defaultValue="0"
                value={this.state.selectValue.toString()}
                onChange={(e) => this.setTimetableGrid(e)}
              />
            </Grid.Col>
            <Grid.Col span="content">
              <Group spacing="xs">
              <Tooltip.Group>
                <Tooltip label={s("clearTimetable")}>
                  <ActionIcon>
                    <IconPlaylistX />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label={s("generateTimetable")}>
                  <ActionIcon
                    onClick={() => openModal({
                      title: <>
                        <IconWand />
                        <Text>{s("timetableGenerator")}</Text>
                      </>,
                      children: (<TimetableGenerator />),
                      size: "lg",
                    })}>
                    <IconWand />
                  </ActionIcon>
                </Tooltip>
              </Tooltip.Group>
              </Group>
            </Grid.Col>
          </Grid>
          {this.state.isMain ? <>
            <Text>
              {/*s("mainTimetableInfo")*/}
            </Text>
          </> : <Tooltip multiline inline label={s("fullOverrideTooltip")}>
            <div>
              <Checkbox label={s("fullOverride")} />
            </div>
          </Tooltip>}
          <Container padding="md">
            <TimetableGrid
              timetable={this.state.selectedTimetable}
              onSave={(t) => {
                this.setTimetableData(t);
              }}
              onChanges={() => {
                
              }}
              onRevert={() => {
                
              }}
            />
          </Container>
        </Stack>
      </>
    )
  }
}

export default TimetableEditorPanel

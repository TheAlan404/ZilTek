import { Button, Group, Space, Stack, Text, TextInput } from '@mantine/core'
import { closeAllModals } from '@mantine/modals';
import React, { Component } from 'react'
import importManager from '../importManager';
import s from '../lang';
import { getVideoID, validateYTLink } from '../util/ytdl-core-urlutils';

const INSTANCE = "https://tube.kuylar.dev";

class ImportFromYoutubeModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            searchValue: "",
            searchData: [],
            linkValue: "",
            videoData: {},
            valid: false,
        }
    }

    setLinkValue(v) {
        this.setState({ linkValue: v });
        if (validateYTLink(v)) {
            fetch(INSTANCE + "/api/video?v=" + getVideoID(v))
                .then((res) => res.json())
                .then(videoData => this.setState({ valid: true, videoData }));
        } else {
            this.setState({
                valid: false,
            })
        }
    }

    render() {
        return (
            <>
                <Stack>
                    <TextInput
                        label={s("youtubeLink")}
                        value={this.state.linkValue}
                        onChange={(event) => this.setLinkValue(event.currentTarget.value)} />

                    {this.state.valid && <>
                        <Text fw={500}>
                            {this.state.videoData.title}
                        </Text>
                        <Text>
                            {this.state.videoData.dateText}
                        </Text>
                        <Text>
                            {this.state.videoData.viewCount}
                        </Text>
                        <Text>
                            {this.state.videoData.channel?.title} - {this.state.videoData.channel?.subscribers}
                        </Text>
                    </>}

                    <Space h="lg" />

                    <Group position="apart">
                        <Text c="gray">
                            Provided using{" "}
                            <Text component="a" href={INSTANCE} target="_blank" c="dimmed">
                                LightTube
                            </Text>
                            {" "}by kuylar
                        </Text>

                        <Button
                            disabled={!this.state.valid}
                            onClick={() => {
                                importManager.downloadYoutubeLink(INSTANCE + "/proxy/media/" + this.state.videoData.id + "/251", this.state.videoData);
                                closeAllModals();
                            }}>
                            {s("fromYoutube")}
                        </Button>
                    </Group>
                </Stack>
            </>
        )
    }
}

export default ImportFromYoutubeModal

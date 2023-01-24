import { Autocomplete, Button, Group, Space, Stack, Text, TextInput, Image } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';
import React, { Component } from 'react';
import importManager from '../../importManager';
import s from '../../lang';
import { getVideoID, validateYTLink } from '../../util/ytdl-core-urlutils';

const INSTANCE = "https://tube.kuylar.dev";

class YoutubeVideoRenderer extends Component {
    render() {
        return (
            <Group noWrap>
                <Image
                    width={120}
                    height={90}
                    src={this.props.thumbnails?.[0]?.url || `https://img.youtube.com/vi/${this.props.id}/default.jpg`} />
                <Stack>
                    <Text fw={500}>
                        {this.props.title}
                    </Text>
                    <Text>
                        {this.props.dateText}
                    </Text>
                    <Text>
                        {this.props.viewCount}
                    </Text>
                    <Text>
                        {this.props.channel?.title} - {this.props.channel?.subscribers || "idk"} subs
                    </Text>
                </Stack>
            </Group>
        )
    }
}


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

    setSearchValue(v) {
        if (v) {
            console.log("YTSearch", v);
            console.log("YTSearch 1", INSTANCE + "/api/searchSuggestions?" + new URLSearchParams({ query: v }).toString());
            console.log("YTSearch 2", INSTANCE + "/api/search?" + new URLSearchParams({ query: v }).toString());
            Promise.all([
                fetch(INSTANCE + "/api/searchSuggestions?" + new URLSearchParams({ query: v }).toString())
                    .then((res) => res.json()),
                fetch(INSTANCE + "/api/search?" + new URLSearchParams({ query: v }).toString())
                    .then((res) => res.json())
            ]).then(([
                { autocomplete = [] },
                { results = [] },
            ]) => {
                console.log("YTSearch autocomplete", autocomplete);
                console.log("YTSearch results", results);
                this.setState({
                    searchValue: v,
                    searchData: [
                        /* ...autocomplete.map((v, i) => ({
                            type: "autocomplete",
                            suggestion: v,
                            value: "#" + i,
                        })), */
                        ...results.filter(r => r.type == "videoRenderer").map(r => ({
                            type: "result",
                            id: r.id,
                            value: r.id,
                            title: r.title,
                            thumbnails: r.thumbnails,
                            channel: r.channel,
                            viewCount: r.viewCount,
                            dateText: r.published,
                            duration: r.duration,
                        })),
                    ]
                })
            })
        } else {
            this.setState({ searchValue: "", searchData: [] });
        }
    }

    render() {
        return (
            <>
                <Stack>
                    {/* <Autocomplete
                        value={this.state.searchValue}
                        onChange={(v) => this.setSearchValue(v)}
                        label={s("youtubeSearch")}
                        placeholder={s("youtubeSearchPlaceholder")}
                        data={this.state.searchData}
                        itemComponent={(r) => <div>
                                {r.type == "result" ? <>
                                    <YoutubeVideoRenderer {...r} />
                                </> : <>
                                    <Text c="dimmed">
                                        {r.suggestion}
                                    </Text>
                                </>}
                            </div>}
                    /> */}

                    <TextInput
                        label={s("youtubeLink")}
                        value={this.state.linkValue}
                        onChange={(event) => this.setLinkValue(event.currentTarget.value)} />

                    {this.state.valid && <>
                        <YoutubeVideoRenderer {...this.state.videoData} />
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

import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { LIGHTTUBE_INSTANCES } from "../../../../meta";
import { ActionIcon, Avatar, Button, Center, Group, Image, Loader, LoadingOverlay, Paper, Progress, Select, SimpleGrid, Slider, Stack, Text, TextInput, Title, TypographyStylesProvider } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDebouncedValue } from "@mantine/hooks";
import { title } from "process";
import { IconPlayerPause, IconPlayerPlay, IconSearch } from "@tabler/icons-react";
import { ControllerAPI } from "../../../../host/ControllerAPI";
import { downloadWithProgress } from "../../../../lib/downloadWithProgress";
import { modals } from "@mantine/modals";

interface LTInstance {
    host: string,
    api: boolean,
    accounts: boolean,
}

interface SearchResult {
    id: string,
    title: string,
    duration: string,
    description: string,
    viewCount: string,
    published: string,
    thumbnails: Thumbnail[],
    channel: Channel,
}

interface Thumbnail {
    width: number,
    height: number,
    url: number,
}

interface Channel {
    id: string,
    title: string,
    avatar: string,
}

interface IVideoPicker {
    onPick: (s: Partial<SearchResult>) => void,
    currentlyPlaying: string,
    setCurrentlyPlaying: (id: string) => void,
    selectedInstance: string,
}

const VideoPickerContext = React.createContext<IVideoPicker>();

export const YouTubeVideoPicker = ({ processCommand }) => {
    let { t } = useTranslation();
    let [instances, setInstances] = useState<LTInstance[]>([{
        host: "https://tube.kuylar.dev",
        api: true,
        accounts: true,
    }]);
    let [selectedInstance, setSelectedInstance] = useState(instances[0].host);
    let [query, setQuery] = useState("");
    let [debouncedQuery] = useDebouncedValue(query, 200);
    let [results, setResults] = useState<SearchResult[]>([]);
    
    useEffect(() => {
        (async () => {
            let req = await fetch(LIGHTTUBE_INSTANCES);
            let json = await req.json();
            setInstances(json);
        })();
    }, []);
    
    let [isLoading, setLoading] = useState(false);
    let search = useCallback(() => {
        setResults([]);
        setLoading(true);
        if(!debouncedQuery) {
            return;
        }
        (async () => {
            let req = await fetch(`${selectedInstance}/api/search?${
                new URLSearchParams({
                    query: debouncedQuery,
                }).toString()
            }`);
            let json = await req.json();
            let res = json.data.searchResults.filter(r => r.type == "videoRenderer");
            console.log(res);
            setResults(res);
            setLoading(false);
        })();
    }, [debouncedQuery, selectedInstance]);

    let [currentlyPlaying, setCurrentlyPlaying] = useState("");
    let [downloadProgress, setDownloadProgress] = useState(null);
    
    return (
        <Stack>
            {downloadProgress === null ? (
                <>
                    <Select
                        data={instances.map(i => i.host)}
                        value={selectedInstance}
                        onChange={(v) => setSelectedInstance(v)}
                    />

                    <Group align="end">
                        <TextInput
                            label={t("yt.search")}
                            placeholder={t("yt.search")}
                            value={query}
                            onChange={(e) => setQuery(e.currentTarget.value)}
                            style={{ flexGrow: 1 }}
                        />
                        <Button
                            variant="light"
                            color="green"
                            onClick={() => search()}
                            leftSection={<IconSearch />}
                        >
                            {t("yt.search")}
                        </Button>
                    </Group>

                    <VideoPickerContext.Provider value={{
                        currentlyPlaying,
                        setCurrentlyPlaying,
                        selectedInstance,
                        onPick: async ({ id, title }) => {
                            setDownloadProgress(0);
                            let blob = await downloadWithProgress(`${selectedInstance}/proxy/media/${id}/251`, (p) => {
                                setDownloadProgress(p);
                            });

                            processCommand({
                                type: "addFile",
                                data: {
                                    filename: `${title}.webm`,
                                    filedata: blob,
                                },
                            });
                            modals.closeAll();
                        },
                    }}>
                        <Stack pos="relative">
                            <LoadingOverlay
                                visible={isLoading}
                            />
                            {(!!debouncedQuery && results.length) ? (
                                results.map((result, i) => (
                                    <VideoRenderer
                                        {...result}
                                        key={i}
                                    />
                                ))
                            ) : (
                                <Center py="lg">
                                    <Text>{t("yt.beginSearching")}</Text>
                                </Center>
                            )}
                        </Stack>
                    </VideoPickerContext.Provider>
                </>
            ) : (
                <Center py="lg">
                    <Stack w="90%">
                        <Group justify="center">
                            <Loader />
                            <Text>{t("yt.downloading")}</Text>
                        </Group>
                        <Progress
                            value={downloadProgress}
                            w="100%"
                        />
                    </Stack>
                </Center>
            )}
        </Stack>
    )
}

const VideoRenderer = ({
    id,
    title,
    channel,
    description,
    duration,
    thumbnails,
    viewCount,
    published,
}: SearchResult) => {
    return (
        <Paper withBorder p="md">
            <Stack>
                <SimpleGrid cols={{
                    base: 1,
                    md: 2,
                }}>
                    <Image
                        src={thumbnails[0].url}
                        radius="md"
                    />
                    <Stack>
                        <Title order={4}>
                            {title}
                        </Title>
                        <Text>
                            {viewCount}
                            {" | "}
                            {published}
                        </Text>
                        <Group align="center">
                            <Avatar
                                src={channel.avatar}
                                size="sm"
                            />
                            <Title order={6}>
                                {channel.title}
                            </Title>
                        </Group>
                        <TypographyStylesProvider style={{
                            paddingLeft: 0,
                            marginLeft: 0,
                        }} w="100%" dangerouslySetInnerHTML={{
                                __html: description,
                            }}>
                        </TypographyStylesProvider>
                    </Stack>
                </SimpleGrid>
                <BasicPlayer
                    {...({
                        id,
                        title,
                        channel,
                        description,
                        duration,
                        thumbnails,
                        viewCount,
                        published,
                    })}
                />
            </Stack>
        </Paper>
    )
}

const BasicPlayer = (props: SearchResult) => {
    let { t } = useTranslation();
    let {
        selectedInstance,
        currentlyPlaying,
        setCurrentlyPlaying,
        onPick,
    } = useContext(VideoPickerContext);

    let [paused, setPaused] = useState(true);
    let [progress, setProgress] = useState(0);

    let audioRef = useRef(useMemo(() => {
        return new Audio(`${selectedInstance}/proxy/media/${props.id}/251`);
    }, [props.id, selectedInstance]));

    useEffect(() => {
        if(currentlyPlaying !== props.id) {
            audioRef.current.pause();
        }
    }, [currentlyPlaying]);

    useEffect(() => {
        audioRef.current.load();

        audioRef.current.onpause = () => {
            setPaused(true);
        }

        audioRef.current.onplay = () => {
            setPaused(false);
        }

        audioRef.current.onplaying = () => {
            setPaused(false);
        }

        audioRef.current.ontimeupdate = (e) => {
            setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }

        return () => {
            audioRef.current.pause();
        }
    }, [audioRef.current]);

    return (
        <Stack>
            <Group justify="space-between">
                <Group w="80%">
                    <ActionIcon
                        variant="light"
                        color={(currentlyPlaying == props.id && !paused) ? "yellow" : "green"}
                        onClick={() => {
                            if(currentlyPlaying !== props.id) {
                                setCurrentlyPlaying(props.id);
                            }

                            if(paused)
                                audioRef.current.play();
                            else
                                audioRef.current.pause();
                        }}
                    >
                        {currentlyPlaying == props.id && !paused ? (
                            <IconPlayerPause />
                        ) : (
                            <IconPlayerPlay />
                        )}
                    </ActionIcon>
                    <Slider
                        style={{ flexGrow: 1 }}
                        value={progress}
                        label={null}
                        step={0.0005}
                        onChangeEnd={(v) => {
                            audioRef.current.currentTime = audioRef.current.duration * (v / 100);
                        }}
                    />
                </Group>
                <Button
                    variant="light"
                    color="green"
                    onClick={() => onPick({ ...props })}
                >
                    {t("yt.pick")}
                </Button>
            </Group>
        </Stack>
    );
}

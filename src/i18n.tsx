import i18n from "i18next";
import { initReactI18next } from "react-i18next";

let resources = {
    en: {
        translation: {
            by_dennis: "by dennis",
            error: "Error",
            errors: {
                noFiles: "No files found",
                noFilesLong: "No files found - upload files using the buttons or drop the file into ZilTek.",
            },
            language: "Language",

            days: [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
            ],

            mode: {
                local: {
                    button: "Enter Local Mode",
                    checkbox: "Enable local mode for this computer",
                    desc: "When ZilTek starts, it will enter local mode automatically if enabled",
                    running: "Running in Local Mode",
                    exit: "Exit Local Mode",
                },
                remote: {
                    name: "Remote Mode",
                    desc: "Connect to another ZilTek running in Local Mode to remote control it",
                    list: "Remotes List",
                    add: "Add a Remote",
                    running: "Connected to a remote ZilTek",
                    exit: "Exit Remote Mode",
                },
                proxyurl: "Proxy URL",
            },

            menu: {
                edit: "Editor",
                view: "Main Menu"
            },

            header: {
                audioPlaying: "Playing: {{filename}}",
                audioPlayingTooltip: "Currently playing {{filename}}, click to stop.",
            },

            edit: {
                unsavedChanges: "There are unsaved changes",
                pickAFile: "Pick a file",
                reloadFiles: "Reload files",
                bytes: "({{bytes}} bytes)",
                renameFile: "Rename File",
                deleteFile: "Delete File",
                fileSearchResults_one: "{{count}} result",
                fileSearchResults_other: "{{count}} results",
                fileSearchNoResults: "No files found",
            },

            notif: {
                fileRenamed: "File renamed from {{from}} to {{to}}",
                fileDeleted: "{{filename}} was deleted",
                fileUploadedTitle: "File Uploaded",
                fileUploaded: "Uploaded {{filename}} successfully",
            },

            modals: {
                cancel: "Cancel",
                deleteFile: {
                    title: "Delete File?",
                    content: "Are you sure you want to delete {{filename}}? This action is irreversible.",
                    confirm: "Delete",
                },
                renameFile: {
                    title: "Renaming File",
                    filename: "New Filename",
                    confirm: "Rename",
                },
            },

            bells: {
                student: "Students Bell",
                teacher: "Teachers Bell",
                classEnd: "Class End Bell",
            },

            editor: {
                tabs: {
                    main: "Main Settings",
                    schedule: "Schedules",
                    files: "Files",
                    melodies: "Melodies",
                },
                sections: {
                    quickMelodies: {
                        title: "Edit Quick Melodies",
                        desc: "Quick melodies are listed in the main view with a play button.",
                        add: "Add a quick melody",
                    },

                    melodies: {
                        title: "Edit Melodies",
                        desc: "Set which melodies should play for each type of bell",
                    },

                    files: {
                        title: "Edit Files",
                        desc: "Manage the files and melodies here",
                        amount_one: "{{count}} file",
                        amount_other: "{{count}} files",
                        searchPlaceholder: "Search files...",
                        upload: "Upload a file",
                        downloadFromYoutube: "Download from YouTube",
                        playAudio: "Play Audio",
                    },

                    schedule: {
                        type: {
                            switch: "Schedule Type",
                            timetable: {
                                name: "Timetables",
                                overrides: "Overrides",
                                mainTimetable: "Main Timetable",
                                main: "Main",
                                daySelect: "Select Day",
                            },
                            zones: {
                                name: "Zones",
                            },
                        },
                    },
                },
            },

            audio: {
                playfailed: "Audio play failed! Try clicking on the window or check app permissions.",
            },
        }
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en",
        fallbackLng: "en",

        interpolation: {
            escapeValue: false
        }
    });

export default i18n;

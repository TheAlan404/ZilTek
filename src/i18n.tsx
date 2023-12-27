import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            by_dennis: "by dennis",
            error: "Error",
            errors: {
                noFiles: "No files found",
                noFilesLong: "No files found - upload files using the buttons or drop the file into ZilTek.",
            },
            language: "Language",
            deleteAllData: "Delete All Data",

            days: [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
            ],

            months: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
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
                proxyurl: "Relay URL",
            },

            on: "On",
            off: "Off",
            controls: {
                bellStatus: "Bell Status",
                stopAudio: "Stop Audio",
                stopAudioButton: "Stop",
                playSection: "Play Melodies",
                quickMelodies: "Quick Melodies",
                play: "Play",
                stop: "Stop",
            },

            menu: {
                edit: "Editor",
                view: "Main Menu"
            },

            header: {
                audioPlaying: "Playing: {{filename}}",
                audioPlayingTooltip: "Currently playing {{filename}}, click to stop.",
                online: "Online",
                offline: "Offline",
                connected: "Connected",
                hostOffline: "Host Offline",
                suppressed: "Bell Suppressed",
                suppressedTooltip: "Click to turn on the bell",
            },

            view: {
                nextBell: "Next Bell",
                prevBell: "Previous Bell",

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
                newRow: "Add new row",
                duplicateRow: "Duplicate the last row",
                revert: "Revert",
                save: "Save",
                modified: "Modified",
                noRows: "Empty",
            },

            notif: {
                fileRenamed: "File renamed from {{from}} to {{to}}",
                fileDeleted: "{{filename}} was deleted",
                fileUploadedTitle: "File Uploaded",
                fileUploaded: "Uploaded {{filename}} successfully",
                changesIgnored: "Your changes were ignored",
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
                unsavedChanges: {
                    title: "You have unsaved changes!",
                    content: "Are you sure you want to ignore your changes?",
                    confirm: "Ignore Changes",
                },
                clearTimetable: {
                    title: "Clear Timetable?",
                    content: "Are you sure you want to clear it? There is no undo!",
                    confirm: "Clear",
                },
                addRemote: {
                    title: "Add Remote",
                    labelName: "Label",
                    placeholderName: "Enter custom label for the remote",
                    labelId: "UUID",
                    placeholderId: "UUID of the host ZilTek",
                    add: "Add",
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
                        audioPlaying: "Playing Audio",
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
                                clear: "Clear",
                                generate: "Generate",
                            },
                            zones: {
                                name: "Zones",
                            },
                        },
                    },

                    ziltek: {
                        title: "ZilTek",
                        desc: "You are running version {{version}}, build {{build}}",
                        made_by: "ZilTek, made by {{author}}",
                        website: "See my website!",
                        checkingForUpdates: "Checking for updates...",
                        upToDate: "ZilTek is up to date!",
                        updateError: "Update check error, see console",
                        updateAvailable: "Update available: {{current}} -> {{available}}",
                        updateButton: "Update",
                        recheckUpdates: "Re-check updates",
                    },

                    rc: {
                        title: "Remote Control",
                    },

                    maintenance: {
                        title: "Maintenance",
                    },
                },
            },

            timetableGenerator: {
                title: "Timetable Generator Wizard",
                classCountLabel: "Class Count",
                classCountDesc: "Amount of classes",
                breakDurationLabel: "Break Duration",
                breakDurationDesc: "(in minutes)",
                classDurationLabel: "Class Duration",
                classDurationDesc: "(in minutes)",
                studentBellOffsetLabel: "Student Bell Offset",
                studentBellOffsetDesc: "How many minutes to put the students bell before the teachers bell",
                preview: "Preview",
                segmentType: {
                    startTime: "Set Start Time",
                    offset: "Offset from last segment",
                },
                offsetLabel: "Offset from last segment",
                offsetDesc: "Specify how many minutes this segment should start after the last one",
                startTimeLabel: "Segment Start Time",
                startTimeDesc: "Specify when this segment starts",
                removeSegment: "Remove Segment",
                clear: "Clear All",
                addSegment: "Add Segment",
                cancel: "Cancel",
                save: "Save Timetable",
                segment: "Segment {{index}}",
                preset: "Preset {{index}}",
            },

            rc: {
                enabled: "Enable Remote Control",
                enabledDesc: "Control ZilTek from another device",
                hostId: "Host ID",
                connectedRemotes: "Connected Remotes",
                noRemotesConnected: "No remotes connected",
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

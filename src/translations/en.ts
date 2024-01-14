import { DEFAULT_RELAY } from "../meta";

export default {
    by_dennis: "by dennis",
    error: "Error",
    errors: {
        noFiles: "No files found",
        noFilesLong: "No files found - upload files using the buttons or drop the file into ZilTek.",
        pleaseSetMelodies: "Melodies are not selected",
        pleaseSetMelodiesDesc: "Go to Editor > Melodies and set some",
        pleaseUploadFiles: "No files found",
        pleaseUploadFilesDesc: "Go to Editor > Files to upload some melodies",
    },
    language: "Language",
    deleteAllData: "Delete All Data",
    download: "Download ZilTek as an App",
    importFromZip: "Import from Zip",
    exportToZip: "Export to Zip",

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
            edit: "Edit",
            connect: "Connect",
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
        noBells: "No bells for today",
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
        deletedEverything: "Everything was deleted",
        deletedRemote: "Remote was removed",
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
            labelRelay: "Relay URL",
            placeholderRelay: DEFAULT_RELAY,
            add: "Add",
            save: "Save",
            delete: "Remove",
        },
        deleteRemote: {
            title: "Delete Remote",
            content: "Delete remote?",
            confirm: "Remove",
        },
        clearAllData: {
            title: "Clear All Data",
            content: "This will delete everything except files. Are you sure? This is permanent",
            confirm: "Delete Everything",
        },
        trustRemote: {
            title: "Trust Remote?",
            content: "Are you sure you want to trust this remote? Trusted remotes can connect without confirmation.",
            confirm: "Yes",
        },
        editRemoteLabel: {
            title: "Edit Label",
            label: "Label",
            confirm: "Set Label",
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
                        fullOverride: "Full Override",
                        fullOverrideDesc: "When turned on, completely uses this table instead of overriding based on main table",
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
        authenticatedRemotes: "Trusted Remotes",

        connecting: "Connecting...",
        connectingDesc: "Connecting to remote...",
        waitingForAcception: "Waiting for acception...",
        waitingForAcceptionDesc: "The connection must be accepted from the remote control tab.",
        denied: "Denied",
        deniedDesc: "The host denied your connection request.",
        kicked: "Kicked",
        kickedDesc: "The host closed your connection",
        hostOffline: "Host Offline",
        hostOfflineDesc: "Host disconnected from relay. Once the host is online again you will automatically be reconnected.",
        
        remoteId: "This remote's ID:",
        disconnect: "Disconnect",

        trustRemote: "Trust Remote",
        connected: "Connected",
        editLabel: "Edit label",
        removeTrust: "Remove Trust",
        kickRemote: "Kick Remote",
    },

    audio: {
        playfailed: "Audio play failed! Try clicking on the window or check app permissions.",
    },
};

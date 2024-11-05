export default {
    language: "Language",
    error: "Error",
    bells: {
        students: "Students Bell",
        teachers: "Teachers Bell",
        classEnd: "Class End Bell",
    },

    on: "On",
    off: "Off",
    exit: "Exit",
    save: "Save",
    cancel: "Cancel",

    modals: {
        cancel: "Cancel",
        confirm: "Confirm",
    },

    controls: {
        bellStatus: "Bell",
        stopAudio: "Stop Audio",
        stopAudioButton: "Stop",
        playSection: "Play...",
        quickMelodies: "Quick Melodies",
        stop: "Stop",
        play: "Play",
        playLocally: "Play on this device",
        playOnHost: "Play on connected device",
    },

    view: {
        noBells: "No bells today",
        prevBell: "Previous Bell",
        nextBell: "Next Bell",
    },

    timebox: {
        invalid: "Invalid value",
        playing: "Playing...",
        played: "Played",
        failed: "Failed to play",
        muted: "Bell was muted",
        stopped: "Bell interrupted",
    },

    tabs: {
        main: "Main Settings",
        schedule: "Schedule",
        files: "Files",
    },

    about: {
        title: "About ZilTek",
        content: "You are running version {{version}} build {{build}}! Thanks for using ZilTek.",
        madeby: "Made with love by {{author}} - support me!",
        website: "My website",
    },
    
    rc: {
        title: "Remote Control",
        toggle: "Enable Remote Control",
        toggleDesc: "Manage and play bells from another device, remotely",
        relay: "Relay URL",
        relayDesc: "What server to use",
        hostId: "Host ID",
        trustedList: "Trusted Remotes",
        connectedList: "Connected Remotes",
        connectionRequests: "Connection Requests",
        connected: "Connected",
        trustRemote: "Trust Remote",
        editLabel: "Edit Label",
        removeTrust: "Remove Trust",
        kickRemote: "Kick Remote",
        qrcodeDesc: "Scan this QR code on your phone to control this ZilTek remotely",
    },

    maintenance: {
        title: "Maintenance",
        deleteAll: "Delete Everything",
        deleteAllConfirmation: "Are you sure? This process is irreversible!",
    },

    schedule: {
        type: "Schedule Type",
        timetables: "Timetables",
        zones: "Zones",
    },
    
    timetable: {
        melodies: "Melodies",
        tables: "Tables",
        mainGroup: "Main",
        main: "Main Timetable",
        overridesGroup: "Day-specific",
        clear: "Clear",
        clearConfirmation: "Are you sure you want to clear this timetable?",
        generate: "Generate",
        enabled: "Enabled",
        enabledDesc: "Should ZilTek use this day override?",
        newRow: "New Row",
        duplicateRow: "Duplicate Row",
    },

    quickMelodies: {
        title: "Quick Melodies",
        desc: "Show some melodies in the main view to play them fast, for example a national anthem",
        add: "Add",
    },

    melodySelect: {
        title: "Melody Picker",
        file: "File",
        cut: "Cut",
    },

    fileDuration: "File Duration",
    melodyDuration: "Melody Duration",

    files: {
        title: "Files",
        desc: "Upload some files to use in melodies",
        amount: "{{count}} files",
        rename: "Rename",
        delete: "Delete",
        deleteConfirmation: "Are you sure you want to delete {{filename}}?",
        refresh: "Refresh",
        upload: "Upload",
        download: "Download",
        search: "Search...",
        searchResults: "Found {{count}} files",
    },

    menu: {
        edit: "Edit",
        view: "View",
    },

    editor: {
        advanced: "Advanced",
        debug: "Debugging",
    },

    header: {
        audioPlayingTooltip: "Click to stop",
        online: "Online",
        offline: "Offline",
        connected: "Connected",
    },

    loadingScreen: {
        self: "This device's ID",
        connectTo: "Connecting to",
        storage: "Loading...",
        storageDesc: "Waiting for storage to be ready",
        connected: "Waiting...",
        connectedDesc: "Connected, waiting for a state update",
        connecting: "Connecting...",
        connectingDesc: "Connecting to the relay server",
        inQueue: "In queue",
        inQueueDesc: "Waiting to be accepted. Click the accept button on the other ZilTek.",
        hostDisconnected: "Host Disconnected",
        hostDisconnectedDesc: "Host's connection with the relay was lost",
        kicked: "Kicked",
        kickedDesc: "Host kicked you",
        remoteDisconnected: "Remote Disconnected",
        remoteDisconnectedDesc: "This device was disconnected from the relay",
    },

    instance: {
        delete: "Delete",
        deleteConfirmation: "Are you sure you want to delete this remote?",
        deletedRemote: "Remote deleted",
        edit: "Edit Remote",
        save: "Save",
        add: "Add",
        list: "Remote Connections List",
        listDesc: "Control a ZilTek running in another device",
        connect: "Connect",
        name: "Name",
        namePlaceholder: "Add a label",
        id: "Host ID",
        idPlaceholder: "01b5177e-0ce0-41e5-8f02-c0514eda513f",
        relay: "Relay URL",
        relayPlaceholder: "wss://ziltek.deniz.blue",
    },

    download: "Download ZilTek as a Desktop App",
    autoLocal: "Always use this device",
    autoLocalDesc: "If checked, uses this device on startup",
    enterLocal: "Use this device",
};

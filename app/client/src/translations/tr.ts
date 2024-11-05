import { LanguageResource } from "./type";

const tr: LanguageResource = {
    language: "Dil",
    error: "Hata",
    bells: {
        students: "Öğrenci Zili",
        teachers: "Öğretmen Zili",
        classEnd: "Ders Sonu Zili",
    },

    on: "Açık",
    off: "Kapalı",
    exit: "Çıkış",
    save: "Kaydet",
    cancel: "İptal",

    modals: {
        cancel: "İptal",
        confirm: "Onayla",
    },

    controls: {
        bellStatus: "Zil",
        stopAudio: "Sesi durdur",
        stopAudioButton: "Durdur",
        playSection: "Çal...",
        quickMelodies: "Hazırda Melodiler",
        stop: "Durdur",
        play: "Oynat",
        playLocally: "Bu cihazda çal",
        playOnHost: "Bağlanılan cihazda çal",
    },

    view: {
        noBells: "Bugün için zil yok",
        prevBell: "Önceki Zil",
        nextBell: "Sonraki Zil",
    },

    timebox: {
        invalid: "Geçersiz değer",
        playing: "Çalıyor...",
        played: "Çaldı",
        failed: "Çalma başarısız",
        muted: "Zil kapalıydı",
        stopped: "Yarıda kesildi",
    },

    tabs: {
        main: "Ana Ayarlar",
        schedule: "Çizelge",
        files: "Dosyalar",
    },

    about: {
        title: "ZilTek Hakkında",
        content: "Sürüm {{version}} yapı {{build}}'ü kullanıyorsunuz! ZilTek'i kullandığınız için teşekkürler.",
        madeby: "{{author}} tarafından yapıldı",
        website: "Web sitem",
    },
    
    rc: {
        title: "Uzaktan Kontrol",
        toggle: "Uzaktan Kontrolü Aktifleştir",
        toggleDesc: "Başka cihazlardan ZilTek'i kontrol edin",
        relay: "Röle URL'si",
        relayDesc: "Kullanılacak sunucu",
        hostId: "Host ID'si",
        trustedList: "Güvenilen Cihazlar",
        connectedList: "Bağlı Cihazlar",
        connectionRequests: "Bağlantı İstekleri",
        connected: "Bağlı",
        trustRemote: "Cihaza güven",
        editLabel: "Etiketi değiştir",
        removeTrust: "Güveni kaldır",
        kickRemote: "Bağlantısını kes",
        qrcodeDesc: "Bu QR kodu telefonunuzdan tarayıp ZilTek'i uzaktan kontrol edin",
    },

    maintenance: {
        title: "Bakım",
        deleteAll: "Herşeyi Sil",
        deleteAllConfirmation: "Emin misiniz? Bu işlem geri alınamaz!",
    },

    schedule: {
        type: "Çizelge Türü",
        timetables: "Zaman Tablosu",
        zones: "Alanlar",
    },
    
    timetable: {
        melodies: "Melodiler",
        tables: "Tablolar",
        mainGroup: "Ana",
        main: "Ana Tablo",
        overridesGroup: "Günlük Tablolar",
        clear: "Sil",
        clearConfirmation: "Tamamen silmek istediğinizden emin misiniz?",
        generate: "Oluşturucu",
        enabled: "Aktif",
        enabledDesc: "Aktif ise aşağıdaki tablo bu gün için kullanılır",
        newRow: "Yeni Satır",
        duplicateRow: "Son Satırı Klonla",
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
        self: "Bu cihazın ID'si",
        connectTo: "Bağlanılan cihazın ID'si",
        storage: "Yükleniyor...",
        storageDesc: "Dosya sisteminin hazır olması bekleniyor",
        connected: "Yükleniyor...",
        connectedDesc: "Bağlandı, veri bekleniyor",
        connecting: "Bağlanılıyor...",
        connectingDesc: "Röle sunucusuna bağlanılıyor...",
        inQueue: "Kuyrukta",
        inQueueDesc: "Bağlantı isteğinin kabul edilmesi bekleniliyor. Bağlanılan ZilTek'ten kabul edin.",
        hostDisconnected: "Host'un Bağlantısı Kesildi",
        hostDisconnectedDesc: "Bağlanılan ZilTek'in röle ile olan bağlantısı kesildi",
        kicked: "Atıldı",
        kickedDesc: "Bağlanılan ZilTek sizi attı",
        remoteDisconnected: "Bağlantınız Kesildi",
        remoteDisconnectedDesc: "Bu cihazın röle ile olan bağlantısı kesildi",
    },

    download: "Download ZilTek as a Desktop App",
    autoLocal: "Always use this device",
    autoLocalDesc: "If checked, uses this device on startup",
    enterLocal: "Use this device",
};

export default tr;

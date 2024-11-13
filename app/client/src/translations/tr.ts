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
        copyFrom: "Kopyala",
        copyFromConfirmation: "Seçtiğiniz tablo bu tabloya kopyalanacaktır. Emin misiniz?",
        actions: "Aksiyonlar",
        table: "Tablo",
    },

    gen: {
        segments: "Parçalar",
        addSegment: "Ekle",
        startTime: "Başlangıç Saatini Belirle",
        break: "Mola/Boşluk",
        classes: "Dersler",
        amount: "Ders miktarı",
        studentOffset: "Öğrenci farkı",
        classDur: "Ders Süresi",
        breakDur: "Tenefüs Süresi",
        preview: "Önizleme",
        preset: "Örnek {{x}}",
        reset: "Sıfırla",
        p: "Derslerin uzunluklarını vb. girerek tablo oluşturun",
    },

    quickMelodies: {
        title: "Hazırda Melodiler",
        desc: "Ana menüde çalma butonu eklenir. İstiklal marşı vb. koymanız önerilir",
        add: "Ekle",
    },

    melodySelect: {
        title: "Melodi Seçici",
        file: "Dosya",
        cut: "Kes",
    },

    fileDuration: "Dosya Uzunluğu",
    melodyDuration: "Melodi Uzunluğu",

    files: {
        title: "Dosyalar",
        desc: "Melodilerde kullanmak için dosya ekleyin",
        amount: "{{count}} dosya",
        rename: "Yeniden adlandır",
        delete: "Sil",
        deleteConfirmation: "{{filename}}'yı silmek istediğinizden emin misiniz?",
        refresh: "Yenile",
        upload: "Yükle",
        download: "İndir",
        search: "Ara...",
        searchResults: "{{count}} dosya bulundu",
    },

    menu: {
        edit: "Düzenle",
        view: "Ana Menü",
    },

    editor: {
        advanced: "Gelişmiş",
        debug: "Debugging",
    },

    header: {
        audioPlayingTooltip: "Tıklayarak durdur",
        online: "Çevrimiçi",
        offline: "Çevrimdışı",
        connected: "Bağlandı",
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

    download: "ZilTek'i uygulama olarak indir",
    autoLocal: "Her zaman bu cihazı kullan",
    autoLocalDesc: "Tiklendiyse cihaz açıldığında hemen bu cihazı kullanır",
    enterLocal: "Bu cihazı kullan",

    instance: {
        delete: "Sil",
        deleteConfirmation: "Bu uzaktan bağlantıyı silmek istediğinize emin misiniz?",
        deletedRemote: "Uzaktan bağlantı silindi",
        edit: "Uzaktan bağlantıyı düzenle",
        save: "Kaydet",
        add: "Ekle",
        list: "Uzaktan bağlantılar listesi",
        listDesc: "Başka bir cihazda çalışan ZilTek'e bağlan",
        connect: "Bağlan",
        name: "Etiket",
        namePlaceholder: "Bir etiket ekle",
        id: "Host ID'si",
        idPlaceholder: "01b5177e-0ce0-41e5-8f02-c0514eda513f",
        relay: "Röle URL'si",
        relayPlaceholder: "wss://ziltek.deniz.blue",
    },
};

export default tr;

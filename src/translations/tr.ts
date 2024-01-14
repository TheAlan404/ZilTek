import { DEFAULT_RELAY } from "../meta";

export default {
    by_dennis: "deniz tarafından",
    error: "Hata",
    errors: {
        noFiles: "Hiçbir dosya bulunamadı",
        noFilesLong: "Hiçbir dosya bulunamadı - butonları kullanarak ya da dosyayı ZilTek'e sürükleyerek dosya yükleyin.",
        pleaseUploadFiles: "Hiçbir dosya bulunamadı, lütfen editörü kullanarak dosya yükleyin",
        pleaseSetMelodies: "Melodiler düzgün ayarlı değil",
    },
    language: "Dil",
    deleteAllData: "Bütün verileri sil",
    download: "ZilTek'i uygulama olarak indir",
    importFromZip: "Zip'ten İçe Aktar",
    exportToZip: "Zip olarak Dışa Aktar",

    days: [
        "Pazar",
        "Pazartesi",
        "Salı",
        "Çarşamba",
        "Perşembe",
        "Cuma",
        "Cumartesi",
    ],

    months: [
        "Ocak",
        "Şubat",
        "Mart",
        "Nisan",
        "Mayıs",
        "Haziran",
        "Temmuz",
        "Ağustos",
        "Eylül",
        "Ekim",
        "Kasım",
        "Aralık",
    ],

    mode: {
        local: {
            button: "Yerel Moda Gir",
            checkbox: "Bu bilgisayar için yerel modu aktifleştir",
            desc: "ZilTek açıldığı anda eğer bu ayar aktif ise otomatik olarak yerel moda girer",
            running: "Yerel Modda Çalışıyor",
            exit: "Yerel moddan çık",
        },
        remote: {
            name: "Uzaktan Bağlantı",
            desc: "Yerel modda çalışan başka bir ZilTek'e bağlan",
            list: "Kumandalar Listesi",
            add: "Kumanda Ekle",
            running: "Başka bir ZilTek'e uzaktan bağlanıldı",
            exit: "Uzaktan kontrol modundan çık",
            edit: "Düzenle",
            connect: "Bağlan",
        },
        proxyurl: "Relay URL'si",
    },

    on: "Açık",
    off: "Kapalı",
    controls: {
        bellStatus: "Zil Durumu",
        stopAudio: "Sesi Durdur",
        stopAudioButton: "Durdur",
        playSection: "Melodi Çal",
        quickMelodies: "Hızlı Melodiler",
        play: "Çal",
        stop: "Durdur",
    },

    menu: {
        edit: "Editör",
        view: "Ana Menü"
    },

    header: {
        audioPlaying: "Çalıyor: {{filename}}",
        audioPlayingTooltip: "Şu anda {{filename}} oynatılıyor, durdurmak için tıkla.",
        online: "Çevrimiçi",
        offline: "Çevrimdışı",
        connected: "Bağlanıldı",
        hostOffline: "Bağlanılan ZilTek çevrimdışı",
        suppressed: "Zil Susturuldu",
        suppressedTooltip: "Tıklayarak zili geri aç",
    },

    view: {
        nextBell: "Sonraki Zil",
        prevBell: "Önceki Zil",
        noBells: "Bu gün herhangi bir zil yok",
    },

    edit: {
        unsavedChanges: "Kaydedilmemiş değişiklikler var",
        pickAFile: "Bir dosya seç",
        reloadFiles: "Dosyaları yenile",
        bytes: "({{bytes}} byte)",
        renameFile: "Yeniden Adlandır",
        deleteFile: "Sil",
        fileSearchResults: "{{count}} sonuç",
        fileSearchNoResults: "Hiçbir dosya bulunamadı",
        newRow: "Yeni Satır",
        duplicateRow: "Bir önceki satırı kopyala",
        revert: "Geri Al",
        save: "Kaydet",
        modified: "Değiştirildi",
        noRows: "Boş",
    },

    notif: {
        fileRenamed: "Dosyanın ismi {{from}}'dan {{to}}'a değiştirildi",
        fileDeleted: "{{filename}} silindi",
        fileUploadedTitle: "Dosya Yüklendi",
        fileUploaded: "{{filename}} başarıyla yüklendi",
        changesIgnored: "Değişikliklerin görmezden gelindi",
        deletedEverything: "Herşey silindi",
        deletedRemote: "Kumanda silindi",
    },

    modals: {
        cancel: "İptal",
        deleteFile: {
            title: "Dosyayı sil?",
            content: "{{filename}}'yı silmek istediğine emin misin? Bu işlem geri alınamaz!",
            confirm: "Sil",
        },
        renameFile: {
            title: "Dosyayı yeniden adlandır",
            filename: "Yeni Dosya İsmi",
            confirm: "Yeniden Adlandır",
        },
        unsavedChanges: {
            title: "Kaydedilmemiş değişikliklerin var!",
            content: "Değişikliklerini görmezden gelmek istediğine emin misin?",
            confirm: "Değişiklikleri yoksay",
        },
        clearTimetable: {
            title: "Zaman tablosunu sil?",
            content: "Silmek istediğinden emin misin? Bu işlem geri alınamaz",
            confirm: "Clear",
        },
        addRemote: {
            title: "Kumanda Ekle",
            labelName: "Etiket",
            placeholderName: "Herhangi birşeyler yaz",
            labelId: "UUID",
            placeholderId: "Diğer ZilTek'in UUID'si",
            labelRelay: "Relay URL'si",
            placeholderRelay: DEFAULT_RELAY,
            add: "Ekle",
            save: "Kaydet",
            delete: "Kaldır",
        },
        deleteRemote: {
            title: "Kumandayı Sil",
            content: "Emin misiniz?",
            confirm: "Kaldır",
        },
        clearAllData: {
            title: "Bütün Verileri Sil",
            content: "Bu işlem dosyalar dışında herşeyi silecek. Emin misiniz?",
            confirm: "Herşeyi Sil",
        },
        trustRemote: {
            title: "Kumandaya Güven",
            content: "Bu kumandaya güvendiğinizden emin misiniz? Güvenilen kumandalar onay gerekmeden bağlanabilir.",
            confirm: "Evet",
        },
        editRemoteLabel: {
            title: "Etiketi Değiştir",
            label: "Etiket",
            confirm: "Tamam",
        },
    },

    bells: {
        student: "Öğrenci Zili",
        teacher: "Öğretmen Zili",
        classEnd: "Ders Bitiş Zili",
    },

    editor: {
        tabs: {
            main: "Ana Ayarlar",
            schedule: "Programlar",
            files: "Dosyalar",
            melodies: "Melodiler",
        },
        sections: {
            quickMelodies: {
                title: "Hızlı Melodileri Düzenle",
                desc: "Hızlı Melodiler ana menüde bir oynat butonu ile gösterilir.",
                add: "Hızlı Melodi Ekle",
            },

            melodies: {
                title: "Melodileri Düzenle",
                desc: "Her tür zil için çalınacak melodileri ayarla",
            },

            files: {
                title: "Dosyaları Düzenle",
                desc: "Dosyaları ve melodileri burada düzenleyebilirsiniz",
                amount: "{{count}} dosya",
                searchPlaceholder: "Dosya ara...",
                upload: "Dosya Yükle",
                downloadFromYoutube: "YouTube'dan indir",
                playAudio: "Sesi Oynat",
                audioPlaying: "Ses Oynatılıyor",
            },

            schedule: {
                type: {
                    switch: "Program Tipi",
                    timetable: {
                        name: "Zaman Tabloları",
                        overrides: "Üstüne yazmalar",
                        mainTimetable: "Ana Zaman Tablosu",
                        main: "Ana",
                        daySelect: "Günü Seç",
                        clear: "Temizle",
                        generate: "Oluştur",
                        fullOverride: "Tamamen Üstüne Yaz",
                        fullOverrideDesc: "Aktif edildiği zaman bu tablo kullanılır, aktif değil ise ana tablonun üstüne konularak hesaplanır",
                    },
                    zones: {
                        name: "Bölgeler",
                    },
                },
            },

            ziltek: {
                title: "ZilTek",
                desc: "Sürüm {{version}}, yapı {{build}}'ı kullanıyorsunuz",
                made_by: "{{author}} tarafından ZilTek",
                website: "web sayfama gitmek için tıkla",
                checkingForUpdates: "Güncellemelere bakılıyor...",
                upToDate: "ZilTek'iniz güncel!",
                updateError: "Güncelleme hatası, konsola bkz.",
                updateAvailable: "Güncelleme var: {{current}} -> {{available}}",
                updateButton: "Güncelle",
                recheckUpdates: "Güncellemelere yeniden bak",
            },

            rc: {
                title: "Uzaktan Kontrol",
            },

            maintenance: {
                title: "Bakım",
            },
        },
    },

    timetableGenerator: {
        title: "Zaman Tablosu Oluşturucusu",
        classCountLabel: "Ders Miktarı",
        classCountDesc: "Kaç tane ders var?",
        breakDurationLabel: "Tenefüs Süresi",
        breakDurationDesc: "(dk.)",
        classDurationLabel: "Ders Süresi",
        classDurationDesc: "(dk.)",
        studentBellOffsetLabel: "Öğrenci-Öğretmen Farkı",
        studentBellOffsetDesc: "Öğrenci zili öğretmen zilinden kaç dakika önce çalsın?",
        preview: "Önizleme",
        segmentType: {
            startTime: "Başlangıç Zamanı",
            offset: "Öncekinden fark ile",
        },
        offsetLabel: "Önceki bölümden fark",
        offsetDesc: "Önceki bölümden kaç dakika sonra bu bölüm başlasın?",
        startTimeLabel: "Bölüm Başlangıç Zamanı",
        startTimeDesc: "Bu bölümün başlama saati",
        removeSegment: "Bölümü Sil",
        clear: "Hepsini Temizle",
        addSegment: "Bölüm Ekle",
        cancel: "İptal",
        save: "Zaman Tablosunu Kaydet",
        segment: "Bölüm {{index}}",
        preset: "Önayar {{index}}",
    },

    rc: {
        enabled: "Uzaktan Kontrolü Aktifleştir",
        enabledDesc: "ZilTek'i başka bir cihazdan kontrol et",
        hostId: "Host ID",
        connectedRemotes: "Bağlananlar",
        noRemotesConnected: "Hiçbir kumanda bağlanmadı",
        authenticatedRemotes: "Güvenilen Kumandalar",

        connecting: "Bağlanılıyor...",
        connectingDesc: "Lütfen bekleyin...",
        waitingForAcception: "Kabül bekleniyor...",
        waitingForAcceptionDesc: "Bağlantı uzaktan kontrol kısmından kabül edilmelidir.",
        denied: "Reddedildi",
        deniedDesc: "Bağlanılan ZilTek bağlantıyı reddetti.",
        kicked: "Bağlantı Kesildi",
        kickedDesc: "Bağlanılan ZilTek bağlantınızı kesti.",
        hostOffline: "Çevrimdışı",
        hostOfflineDesc: "Bağlanılan ZilTek şuan çevrimdışı. Çevrimiçi olduğu zaman otomatik olarak yeniden bağlanılacak.",

        remoteId: "Bu kumandanın ID'si:",
        disconnect: "Bağlantıyı Kes",

        trustRemote: "Kumandaya Güven",
        connected: "Bağlandı",
        editLabel: "Etiketi değiştir",
        removeTrust: "Güveni kaldır",
        kickRemote: "Bağlantıyı Kes",
    },

    audio: {
        playfailed: "Sesi oynatma başarısız! Pencereye tıklamayı deneyin",
    },
};

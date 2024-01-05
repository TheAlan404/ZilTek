import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import { DEFAULT_RELAY } from "./meta";

const resources = {
    en: {
        translation: {
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
            },

            audio: {
                playfailed: "Audio play failed! Try clicking on the window or check app permissions.",
            },
        }
    },

    tr: {
        translation: {
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
            },

            audio: {
                playfailed: "Sesi oynatma başarısız! Pencereye tıklamayı deneyin",
            },
        }
    },
};

i18n
    .use(LanguageDetector)
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

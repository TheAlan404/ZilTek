const STRINGS = {
    en_studentBell: "Students",
    tr_studentBell: "Öğrenci",
    en_teacherBell: "Teachers",
    tr_teacherBell: "Öğretmen",
    en_classBell: "Class End",
    tr_classBell: "Ders Çıkışı",
    en_bell: "Bell",
    tr_bell: "Zili",

    en_editMode: "Edit Mode",
    tr_editMode: "Düzenleme Modu",
    en_viewMode: "Exit Edit Mode",
    tr_viewMode: "Düzenleme Modundan Çık",

    en_audioPlaying: "Audio is playing",
    tr_audioPlaying: "Ses oynatılıyor",
    en_clickToStopAudio: "Click to stop audio",
    tr_clickToStopAudio: "Sesi durdurmak için tıkla",

    en_loaded: "Loaded ZilTek successfully",
    tr_loaded: "Başarıyla yüklendi",
    en_welcome: "Welcome to ZilTek. Use the edit mode to set up.",
    tr_welcome: "ZilTek'e hoşgeldiniz. Düzenleme modundan ayarlayın.",

    en_mainTimetable: "Main Timetable",
    tr_mainTimetable: "Ana Zaman Çizelgesi",
    ...([
        ["Sunday", "Pazar"],
        ["Monday", "Pazartesi"],
        ["Tuesday", "Salı"],
        ["Wednesday", "Çarşamba"],
        ["Thursday", "Perşembe"],
        ["Friday", "Cuma"],
        ["Saturday", "Cumartesi"],
    ].reduce((prev, cur, i) => ({
        ...prev,
        ["en_day" + i]: cur[0],
        ["tr_day" + i]: cur[1],
    }), {})),
    en_selectDay: "Select Day",
    tr_selectDay: "Günü seç",
    en_clearTimetable: "Clear timetable",
    tr_clearTimetable: "Zaman çizelgesinin tümünü temizle",
    en_generateTimetable: "Generate timetable (wizard)",
    tr_generateTimetable: "Zaman çizelgesi oluşturucu",
    en_fullOverride: "Full Override",
    en_fullOverrideTooltip: "When checked, this timetable wont be overlayed on top of the main timetable and will be used as-is.",
    tr_fullOverride: "Üzerine yazma",
    tr_fullOverrideTooltip: "Eğer tiklenir ise, bu zaman çizelgesi bulunduğu gibi kullanılır ve ana zaman çizelgesinin üzerine yazılmaz.",
    
    en_on: "On",
    tr_on: "Açık",
    en_off: "Off",
    tr_off: "Kapalı",

    en_mainTimetableInfo: "This is the main timetable.",
    tr_mainTimetableInfo: "Bu ana zaman çizelgesi.",

    en_unsavedChanges: "You have unsaved changes!",
    tr_unsavedChanges: "Keydedilmemiş değişikliklerin var!",

    // -- timetable generator --

    en_timetableGenerator: "Timetable Generator Wizard",
    tr_timetableGenerator: "Zaman Çizelgesi Oluşturucu",

    en_ttg_desc: "Welcome to the <b>Timetable Generator Wizard</b>.\n" +
        " - The generator works using '<i>segments</i>'. A segment can be one of two types:\n\n" +
        "   - <i>Start time segment</i>: The start time defines when the segment starts.\n" +
        "   - <i>Offset segment</i>: The offset value defines how much time to skip between the current and the one before it.\n\n" +
        " - The 'student bell offset' property defines how much time there should be between the student and teacher bell.\n\n" +
        " - Below are also some presets for you to try out.",
    tr_ttg_desc: "<b>Zaman Çizelgesi Oluşturucusu</b>'na hoşgeldiniz.\n" +
        " - Oluşturucu, '<i>bölüm</i>'ler ile çalışır. Bir bölüm iki türden olabilir:\n\n" +
        "   - <i>Başlangıç zamanlı bölüm</i>: Başlangıç zamanı bölümün başladığı zamanı belirler.\n" +
        "   - <i>Eklenmeli bölüm</i>: Eklenme değeri, bir önceki bölümden ne kadar sonra kendisinin başladığını belirler.\n\n" +
        " - 'Öğrenci Zili Farkı' değeri öğrenci ve öğretmen zili arasındakı zaman farkını belirler.\n\n" +
        " - Aşağıda denemeniz için birkaç önayar verilmiştir.",

    en_clear: "Clear",
    tr_clear: "Temizle",

    en_startTime: "Start Time",
    tr_startTime: "Başlangıç Zamanı",
    en_startTimeDesc: "Starting time of the segment",
    tr_startTimeDesc: "Bu bölümün başlangıç zamanı",
    en_offset: "Offset",
    tr_offset: "Eklenme",
    en_offsetDesc: "How many minutes to skip from the last segment",
    tr_offsetDesc: "Önceki bölümün son zamanından kaç dakika sonra başlaması",
    en_classCount: "Class Count",
    tr_classCount: "Ders Sayısı",
    en_classDuration: "Class Duration",
    tr_classDuration: "Ders Süresi",
    en_classDurationDesc: "(in minutes)",
    tr_classDurationDesc: "(dakika)",
    en_breakDuration: "Break Duration",
    tr_breakDuration: "Tenefüs Süresi",
    en_breakDurationDesc: "(in minutes)",
    tr_breakDurationDesc: "(dakika)",
    en_studentBellOffset: "Student Bell Offset",
    tr_studentBellOffset: "Öğrenci Zili Farkı",
    en_studentBellOffsetDesc: "How many minutes to play the student bell before the teachers bell",
    tr_studentBellOffsetDesc: "Öğretmen zilinden kaç dakika önce öğrenci zili çalması",
    en_addSegment: "Add Segment",
    tr_addSegment: "Bölüm Ekle",
    en_type: "Type",
    tr_type: "Tip",
    en_cancel: "Cancel",
    tr_cancel: "İptal",
    en_save: "Save",
    tr_save: "Kaydet",
    en_revert: "Revert",
    tr_revert: "Geri Al",
    en_preview: "Preview",
    tr_preview: "Önizleme",
    en_generate: "Generate",
    tr_generate: "Oluştur",
    en_removeSegment: "Remove Segment",
    tr_removeSegment: "Bölümü Sil",

    en_segmentIndex: "Segment $0",
    tr_segmentIndex: "Bölüm $0",

    en_segmentStartsAt: "Segment starts at $0",
    tr_segmentStartsAt: "Bölüm $0'de başlar",

    en_preset: "Preset",
    tr_preset: "Önayar",
    
    en_clickToRefresh: "Click the button to refresh",
    tr_clickToRefresh: "Butona tıklayarak güncelle",

    // -- dropper --

    en_dropperTitle: "Drop files here",
    tr_dropperTitle: "Buraya dosyalarını sürükle",
    en_dropperText: "To import audio or configurations",
    tr_dropperText: "Ses veya ayar dosyaları içe aktarılır",
    
    // -- files --

    en_files: "files",
    tr_files: "dosya",
    en_filesHeader: "Files",
    tr_filesHeader: "Dosyalar",
    
    en_delete: "Delete",
    tr_delete: "Sil",
    
    en_upload: "Upload",
    tr_upload: "Yükle",
    en_download: "Download",
    tr_download: "İndir",
    
    en_fileAlreadyExists: "The file $0 already exists!",
    tr_fileAlreadyExists: "$0 adında bir dosya zaten var!",
    
    // -- errors --
    
    en_fatalError: "Fatal Error! Report to developer",
    tr_fatalError: "Kritik hata! Yazılımcıya bildirin",

    en_error: "Error!",
    tr_error: "Hata!",
    en_err_datacorrupt: "JSON data is corrupt! Import a backup or set up again.",
    tr_err_datacorrupt: "JSON verisi bozuk! Yedeği yeniden yükleyin yada en baştan ayarlayın.",

    en_err_numZero: "$0 should be greater or equal to 1",
    tr_err_numZero: "$0 1'e eşit veya 1'den büyük olmalıdı",
    en_err_numNegative: "$0 cannot be negative",
    tr_err_numNegative: "$0 negatif sayı olamaz",
    
    // -- melodies --
    
    en_setAsMelody: "Set As Melody",
    tr_setAsMelody: "Melodi olarak ayarla",
    
    en_addMelody: "Add Melody",
    tr_addMelody: "Melodi Ekle",

    en_fromYoutube: "Import from Youtube",
    tr_fromYoutube: "Youtube'dan al",

    en_trimAudio: "Trim Audio",
    tr_trimAudio: "Sesi kes",
    
    // -- controller info --
    
    en_currentlyPlaying: "This bell is currently playing",
    tr_currentlyPlaying: "Bu zil şuan çalıyor",
    en_touchWindowPls: "Cannot play the audio! Please interact with the browser window.",
    tr_touchWindowPls: "Ses çalınamıyor! Lütfen pencereye tıklayın.",

    en_bellStatus: "Bell Status",
    tr_bellStatus: "Zil Durumu",
    en_clickToTurnOnBell: "The bells are off. Click to turn the bells back on",
    tr_clickToTurnOnBell: "Ziller kapalı. Zilleri tekrar açmak için tıkla",
    en_bellSuppressed: "Current bell is suppressed",
    tr_bellSuppressed: "Şuanki zil susturuldu",
    
    // -- controls --

    en_playMelody: "Play Melody",
    tr_playMelody: "Melodi Çal",
    
    en_playButton: "PLAY",
    tr_playButton: "ÇAL",
    en_stopAudio: "Stop Audio",
    tr_stopAudio: "Sesi Durdur",
    en_stopButton: "STOP",
    tr_stopButton: "DURDUR",

    en_play: "Play",
    tr_play: "Çal",
    
    // -- youtube --
    
    en_youtubeSearch: "Youtube Search",
    tr_youtubeSearch: "Youtube Arama",
    en_youtubeSearchPlaceholder: "Start typing to search",
    tr_youtubeSearchPlaceholder: "Aramak için yazmaya başla",

    en_youtubeLink: "Youtube Link/URL",
    tr_youtubeLink: "Youtube Linki",

    en_downloadingYT: "Downloading from youtube (this might take a while)...",
    tr_downloadingYT: "Youtube'dan indiriliyor (biraz uzun sürebilir)...",
    en_downloadedYT: "Downloaded from Youtube!",
    tr_downloadedYT: "Youtube'dan indirildi!",
    
    // -- import/export --
    
    en_exporting: "Exporting...",
    tr_exporting: "Dışa Aktarılıyor...",
    en_exported: "Exported!",
    tr_exported: "Dışa Aktarıldı!",
    en_importedConfig: "Imported config",
    tr_importedConfig: "Ayarlar içe aktarıldı",
    en_importedAudio: "Imported: $0",
    tr_importedAudio: "İçe Aktarıldı: $0",
    en_importingAudio: "Importing: $0",
    tr_importingAudio: "İçe Aktarılıyor: $0",
    en_importedAll: "Everything has been imported!",
    tr_importedAll: "Herşey içe aktarıldı!",

    en_importing: "Importing",
    tr_importing: "İçe Aktarılıyor",
    en_imported: "Imported!",
    tr_imported: "İçe Aktarıldı!",
    en_importingFiles: "Importing $0 files...",
    tr_importingFiles: "$0 dosya içe aktarılıyor...",
    en_audioImported: "Imported $0 audio files",
    tr_audioImported: "$0 adet ses dosyası yüklendi",

    en_import: "Import configuration",
    tr_import: "Ayarları İçe Aktar",
    en_export: "Export configuration (download)",
    tr_export: "Ayarları Dışa Aktar (indir)",

    // -- clear data --

    en_deleteAllData: "Clear configuration (delete everything)",
    tr_deleteAllData: "Ayarları temizle (herşeyi sil)",
    en_deleteConfirmation: "Are you sure you want to delete everything? All timetables, melodies and configurations will be deleted.",
    tr_deleteConfirmation: "Heyşeyi silmek istediğinizden emin misiniz? Bütün zaman çizelgeleri, melodiler ve ayarlar silinicek.",
    en_dataDeleted: "Data deleted.",
    tr_dataDeleted: "Veriler silindi.",
};

/**
 * @param {import("./util/TypeUtils").GetUnprefixedKeys<STRINGS>} id String ID
 * @param  {...import("./util/TypeUtils").ExtractStringArgs<STRINGS, id>} a Extra values
 * @returns {string}
 */
const s = (id, ...a) => {
    let str = STRINGS[s.currentLang + "_" + id] || id;
    a.forEach((v, i) => str = str.replace("$"+i, v));
    return str;
};

s.languages = [
    {
        id: "en",
        label: "English",
    },
    {
        id: "tr",
        label: "Türkçe (Turkish)",
    },
];

s.currentLang = "en";

if(s.languages.map(l => l.id).includes(localStorage.getItem("_lang")))
    s.currentLang = localStorage.getItem("_lang");

s.setLang = (l) => {
    s.currentLang = l;
    localStorage.setItem("_lang", l);
};

export default s;
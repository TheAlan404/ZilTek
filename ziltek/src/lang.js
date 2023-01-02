const STRINGS = {
    en_studentBell: "Students",
    tr_studentBell: "Öğrenci",
    en_teacherBell: "Teachers",
    tr_teacherBell: "Öğretmen",
    en_classBell: "Class End",
    tr_classBell: "Ders Çıkışı",

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

    en_error: "Error!",
    tr_error: "Hata!",
    en_err_datacorrupt: "JSON data is corrupt! Import a backup or set up again.",
    tr_err_datacorrupt: "JSON verisi bozuk! Yedeği yeniden yükleyin yada en baştan ayarlayın.",

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

    en_timetableGenerator: "Timetable Generator Wizard",
    tr_timetableGenerator: "Zaman Çizelgesi Oluşturucu",

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
    en_err_numZero: "$0 should be greater or equal to 1",
    tr_err_numZero: "$0 1'e eşit veya 1'den büyük olmalıdı",
    en_err_numNegative: "$0 cannot be negative",
    tr_err_numNegative: "$0 negatif sayı olamaz",

    en_clickToRefresh: "Click the button to refresh",
    tr_clickToRefresh: "Butona tıklayarak güncelle",
};

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
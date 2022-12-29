const STRINGS = {
    en_studentBell: "Students",
    tr_studentBell: "Öğrenci",
    en_teacherBell: "Teachers",
    tr_teacherBell: "Öğretmen",
    en_classBell: "Class End",
    tr_classBell: "Ders Çıkışı",
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
};

const s = (id, ...a) => {
    return STRINGS[s.currentLang + "_" + id] || id;
};

s.currentLang = "en";

export default s;
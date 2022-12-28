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
};

const s = (id, ...a) => {
    return STRINGS[s.currentLang + "_" + id] || id;
};

s.currentLang = "en";

export default s;
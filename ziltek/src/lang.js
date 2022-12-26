const STRINGS = {
    en_studentBell: "Students",
    tr_studentBell: "Öğrenci",
    en_teacherBell: "Teachers",
    tr_teacherBell: "Öğretmen",
    en_classBell: "Class End",
    tr_classBell: "Ders Çıkışı",
};

const s = (id, ...a) => {
    return STRINGS[s.currentLang + "_" + id];
};

s.currentLang = "en";

export default s;
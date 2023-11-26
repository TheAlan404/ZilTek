import React, { createContext, useContext, useState } from 'react';
import { STRINGS, languages } from '../api/lang';

export const LangContext = createContext([() => {}, () => {}]);

LangContext.displayName = "LangContext";

const LangProvider = () => {
    let [langId, setLangId] = useState(() => localStorage.getItem("_lang") || "en");

    let s = (id, ...a) => {
        let str = STRINGS[s.currentLang + "_" + id] || id;
        a.forEach((v, i) => str = str.replace("$"+i, v));
        return str;
    };

    return (
        <LangContext.Provider value={[s, {
            setLangId,
            languages,
        }]}>

        </LangContext.Provider>
    )
}

export default LangProvider

/**
 * @typedef {(
 *  id: import("../util/TypeUtils").GetUnprefixedKeys<STRINGS>,
 *  ...x: import("../util/TypeUtils").ExtractStringArgs<STRINGS, id>
 * ) => string} lang_completor
 */

/**
 * @returns {lang_completor}
 */
export const useLang = () => {
    return useContext(LangContext)[0];
}
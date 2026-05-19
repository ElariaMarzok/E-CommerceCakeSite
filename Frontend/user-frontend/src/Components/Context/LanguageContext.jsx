import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Initialize from localStorage so preference persists across sessions
  const [lang, setLang] = useState(
    () => localStorage.getItem("preferredLang") || "en"
  );

  const switchLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem("preferredLang", newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
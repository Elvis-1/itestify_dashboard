import { createContext, useState } from "react";

export const DarkModeContext = createContext()

export const DarkModeContextProvider = ({children}) => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    function toggleTheme(checked) {
        setIsDarkMode(checked);
        document.documentElement.classList.toggle("dark", checked);
    }

    return(
        <DarkModeContext.Provider value={{isDarkMode, toggleTheme}}>
            {children}
        </DarkModeContext.Provider>
    )
}
import { createContext, useEffect, useState } from "react"

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children  }) => {
    const [theme, setTheme] = useState(localStorage.getItem("theme"));

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [theme]);

	useEffect(() => {
        if (localStorage.getItem("theme") === "dark" || window.matchMedia('(prefer-color-scheme: dark)').matches) {
            setTheme("dark");
        } else {
            setTheme("light");
        }
	}, [])

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{ children }
		</ThemeContext.Provider>
	)
}

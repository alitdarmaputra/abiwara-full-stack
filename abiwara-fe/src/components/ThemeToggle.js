import { IoSunny, IoMoon } from "react-icons/io5";

export default function ThemeToggle({ transparantNavbar, theme, setTheme, ...props }) {
    return (
        <button className={`rounded-md overflow-hidden flex items-center justify-center w-8 h-8 transition-all dark:text-gray-200 ${transparantNavbar ? 'text-gray-200' : 'text-black' }`} onClick={() => {
            localStorage.setItem("theme", `${localStorage.getItem("theme") === "dark" ? "light" : "dark"}`)
            setTheme(theme === "dark" ? "light" : "dark");
        }} {...props}>
            <IoSunny id="sun-icon" className={`w-6 h-6 absolute ${theme === "dark" ? "scale-100 rotate-0" : "scale-0 rotate-180"} transition-all`} />
            <IoMoon id="moon-icon" className={`w-6 h-6 absolute ${theme === "dark" ? "scale-0 rotate-180" : "scale-100 rotate-0"} transition-all`} />
        </button>
    )
}

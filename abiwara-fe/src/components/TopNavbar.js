import { useAuth } from "../context/auth"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user";
import ThemeToggle from "./ThemeToggle";
import { ThemeContext } from "../context/theme";

export default function TopNavbar() {
    const auth = useAuth();
	const { user } = useContext(UserContext);
    const [isActive, setActive] = useState(false);
    const navigate = useNavigate();
	const { theme, setTheme } = useContext(ThemeContext);

    const handleDisplayModal = () => {
        setActive(!isActive);
    }

    const handleLogout = e => {
        e.preventDefault();
		auth.setAuthToken();
        navigate("/login");
    }

    return (
        <>
            <div className="top__navbar_container px-2 absolute bg-[#F5F5FC] dark:bg-[#1A202C] w-full flex items-center h-20 mb-10 z-10 dark:text-gray-200">
                <div className="right__navbar_side flex flex-grow items-center justify-end">
					<div id="navbar__darkmode" className="text-red-200 px-6">
						<ThemeToggle transparantNavbar={false} theme={theme} setTheme={setTheme} />
					</div>
                    <div onClick={handleDisplayModal} className="hover:cursor-pointer profile__container flex items-center">
                        <div className="profile__image w-8 h-8 rounded-full md:mr-5 bg-cover" style={{
							backgroundImage: `url("${user?.img.image_url}")`
                        }}></div>
                        <div className="profile__name_role mr-5">
                            <h3 className="font-bold md:inline hidden text-xs">{user?.name}</h3>
                            <p className="md:block hidden text-sm">{user?.role === 1 ? "Admin" : user?.role === 2 ? "Operator" : "Anggota"}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${isActive ? "opacity-100" : "opacity-0 scale-0"} transition-opacity modal_menu__container absolute right-4 top-20 bg-white shadow-lg w-56 px-5 pt-5 rounded-lg z-50 dark:bg-[#161B26] dark:text-gray-200`}>
                <div onClick={() => navigate("/")} className="hover:text-blue-900 hover:cursor-pointer text-left p-2 hover:bg-blue-100 rounded-md w-full mb-3">
                   Halaman Utama 
                </div>
                <hr className="mb-3"></hr>
                <button onClick={handleLogout} className="hover:text-blue-900 text-left p-2 hover:bg-blue-100 rounded-md w-full mb-5">
                    Logout
                </button>
            </div>
        </>
    )
}

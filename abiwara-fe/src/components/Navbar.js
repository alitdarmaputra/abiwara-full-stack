import { ReactComponent as Logo } from "../assets/logo.svg";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { useContext, useEffect, useState } from "react";
import { FaBook, FaCircleInfo, FaQuestion } from "react-icons/fa6";
import ThemeToggle from "./ThemeToggle";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/user";
import { useAuth } from "../context/auth";
import { ThemeContext } from "../context/theme";

export default function Navbar() {
    const [openMenu, setOpenMenu] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const [translateNavbar, setTranslateNavbar] = useState(0);
    const [transparantNavbar, setTransparantNavbar] = useState(true);
	const { authToken, setAuthToken } = useAuth();
	const { user } = useContext(UserContext);
	const location = useLocation();
	const navigate = useNavigate();
	const { theme, setTheme } = useContext(ThemeContext);

    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    function updateNavbar() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            // Scrolling Down
            setTranslateNavbar(-Math.min(76, scrollTop));
            setOpenProfile(false);
        } else {
            // Scrolling Up
            setTranslateNavbar(0);
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

        const vh = window.innerHeight;
        if (scrollTop > vh / 5) {
            setTransparantNavbar(false);
        } else {
            setTransparantNavbar(true);
        }
    }
	
	function handleLogout(e) {
		e.preventDefault()
		setAuthToken();
		navigate(location.pathname);
	}

    window.addEventListener("scroll", updateNavbar);

    useEffect(() => {
        document.onclick = e => {
            const hamburgerMenu = document.getElementById("hamburger-menu");
            const hamburgerBtn = document.getElementById("navbar__hamburger");
			const hamburgetNavigation = document.getElementById("hamburger__navigation");	
			
            if ((!hamburgerMenu?.contains(e.target) && !hamburgerBtn?.contains(e.target)) || hamburgetNavigation?.contains(e.target))
                setOpenMenu(false);

            if (authToken) {
                const profileMenu = document.getElementById("profile-menu");
                const profileBtn = document.getElementById("navbar__profile")

                if (!profileMenu.contains(e.target) && !profileBtn.contains(e.target))
                    setOpenProfile(false);
            }
        }
    }, [user, authToken])

    return (
        <>
            <div id="navbar" className={`fixed top-0 w-full flex justify-between items-center px-8 lg:px-12 py-4 transition-all ease-in ${transparantNavbar ? "" : "bg-white dark:text-gray-200 dark:bg-[#1A202C] shadow-sm"} z-30`} style={{ transform: `translateY(${translateNavbar}px)` }}>
                <div id="navbar__left" className="mr-auto lg:mr-36 flex gap-4 items-center text-2xl text-white">
                    <button id="navbar__hamburger" className="block lg:hidden text-gray-500" onClick={() => setOpenMenu(true)}><AiOutlineMenu /></button>
					<Link className="flex items-center gap-2" to="/">
						<Logo width="44" height="44" fill="white" />
						<h3 className={`hidden lg:block poppins-semibold dark:text-gray-200 ${transparantNavbar ? 'text-gray-200' : 'text-black' }`}>Abiwara</h3>
					</Link>
                </div>
                <div id="navbar__navigation" className={`hidden lg:flex justify-center gap-x-8 flex-grow dark:text-gray-200 ${transparantNavbar ? 'text-gray-200' : 'text-black'}`}>
					<Link to="/catalogue" className="hover:cursor-pointer hover:opacity-75 transition-all">Katalog Buku</Link>
					<Link to="/information" className="hover:cursor-pointer hover:opacity-75 transition-all">Informasi</Link>
                    <Link to="/help" className="hover:cursor-pointer hover:opacity-75 transition-all">Bantuan</Link>
                </div>

                {
                    authToken ? (
                        <div id="navbar__profile" className="w-11 h-11 lg:ml-56  flex justify-center items-center bg-blue-200/[.0] hover:bg-blue-200/[.3] rounded-full hover:cursor-pointer" onClick={() => setOpenProfile(!openProfile)}>
                            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
								<img className="object-cover w-full h-full" src={user?.img.image_url} alt="user-profile"/>
							</div>
                        </div>
                    ) : (
                        <div id="navbar__profile" className="flex gap-x-4 justify-center">
                            <button onClick={() => navigate("/register")}className={`hidden lg:block px-10 py-2.5 rounded-md font-semibold poppins-semibold hover:opacity-75 transition-all dark:text-gray-200 ${transparantNavbar ? 'text-gray-200' : 'text-black'}`}>Daftar</button>
                            <button onClick={() => navigate("/login", { state: { path: location.pathname } })} className="px-10 py-2.5 rounded-md font-semibold text-white bg-[#473BF0] hover:bg-[#392ed3] poppins-semibold transition-all">Masuk</button>
                        </div>
                    )
                }

                <div id="navbar__darkmode" className="text-red-200 ml-6">
                    <ThemeToggle transparantNavbar={transparantNavbar} theme={theme} setTheme={setTheme} />
                </div>
            </div>

            {
                authToken && user && (
                    <div id="profile-menu" className={`${openProfile ? "opacity-1 translate-y-0" : "opacity-0 translate-y-10 h-0 overflow-hidden"} fixed top-16 lg:right-8 overflow-hidden w-screen lg:w-auto p-2.5 transition-all z-10`}>
                        <div id="profile__wrapper" className="flex flex-col rounded-md p-2 text-start shadow-md bg-white border border-gray-200 dark:bg-[#161B26] dark:border-none dark:text-gray-200">
							<div onClick={() => {
								navigate("/me");
								setOpenProfile(false);
							}}className="flex flex-col text-start py-2 px-2 rounded-md hover:bg-blue-100 hover:text-blue-900 hover:underline hover:cursor-pointer">
                                <p className="w-full pr-16">{ user?.name }</p>
                                <p className="text-sm w-full pr-16 text-slate-500">{ user?.role === 1 ? "admin" : user?.role === 2 ? "operator" : "anggota" }</p>
                            </div>
                            <hr className="my-2"></hr>
                            <div id="profile__navigation" className="flex flex-col">
                                <Link to="/dashboard" className="rounded-md py-2.5 pl-2 pr-16 hover:bg-blue-100 hover:text-blue-900 hover:underline hover:cursor-pointer">Dashboard</Link>
								<div onClick={() => {
									navigate("/bookmark");
									setOpenProfile(false);
								}} className="rounded-md py-2.5 pl-2 pr-16 hover:bg-blue-100 hover:text-blue-900 hover:underline hover:cursor-pointer">Bookmark</div>
                            </div>
                            <hr className="my-2"></hr>
                            <button onClick={handleLogout} className="rounded-md py-2.5 text-start pl-2 pr-16 hover:bg-blue-100 hover:text-blue-900 hover:underline hover:cursor-pointer">Keluar</button>
                        </div>
                    </div>
                )
            }

            <span className={`${openMenu ? "fixed" : "hidden"} z-10 top-0 bottom-0 right-0 left-0 bg-black opacity-50`}></span>

            <div id="hamburger-menu" className={`${!openMenu && "-translate-x-full"} z-40 fixed top-0 bottom-0 px-4 py-4 bg-white text-black border-r border-gray-200 transition-all dark:bg-[#1A202C] dark:border-none dark:text-gray-200`}>
                <div className="w-full flex justify-between items-center mb-8" onClick={() => setOpenMenu(false)}>
                    <h1 className="text-2xl font-bold poppins-bold">Abiwara</h1>
                    <button className="p-3 hover:bg-blue-100 rounded-md dark:hover:text-black"><AiOutlineClose /></button>
                </div>
                <div id="hamburger__navigation" className="flex flex-col text-left">
                    <Link to="/catalogue" className="rounded-md py-2.5 pl-2 pr-36 w-full hover:bg-blue-100 hover:text-blue-900 hover:underline hover:cursor-pointer flex gap-4 items-center text-lg"><FaBook />Katalog Buku</Link>
                    <Link to="/information" className="rounded-md py-2.5 pl-2 pr-36 w-full hover:bg-blue-100 hover:text-blue-900 hover:underline hover:cursor-pointer flex gap-4 items-center text-lg"><FaCircleInfo />Informasi</Link>
                    <Link to="/help" className="rounded-md py-2.5 pl-2 pr-36 w-full hover:bg-blue-100 hover:text-blue-900 hover:underline hover:cursor-pointer flex gap-4 items-center text-lg"><FaQuestion />Bantuan</Link>
                </div>
            </div>

        </>
    )
}

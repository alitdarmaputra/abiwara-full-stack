import { useAuth } from "../context/auth"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user";

export default function TopNavbar({ title, path }) {
    const auth = useAuth();
	const { user } = useContext(UserContext);
    const [isActive, setActive] = useState(false);
    const navigate = useNavigate();

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
            <div className="top__navbar_container montserrat-link flex items-center h-20 mb-10">
                <div className="left__navbar_side">
                    <h2 className="path text-sm mb-2 font-semibold"><span className="text-slate-500">Halaman /</span>{path}</h2>
                    <h1 className="title text-xl font-bold">{title}</h1>
                </div>

                <div className="right__navbar_side flex flex-grow items-center justify-end">
                    <div onClick={handleDisplayModal} className="hover:cursor-pointer profile__container flex items-center">
                        <div className="profile__image w-8 h-8 rounded-full md:mr-5 bg-cover" style={{
							backgroundImage: `url("${user.profile_img}")`
                        }}></div>
                        <div className="profile__name_role mr-5">
                            <h3 className="font-bold md:inline hidden text-xs">{user.name}</h3>
                            <p className="md:block hidden text-sm">{user.role === 1 ? "Admin" : user.role === 3 ? "Operator" : "Anggota"}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${isActive ? "opacity-100" : "opacity-0 scale-0"} transition-opacity modal_menu__container absolute right-4 top-28 bg-white shadow-lg w-56 px-5 pt-5 rounded-lg z-50`}>
                <div onClick={() => navigate("/dashboard")} className="hover:text-blue-900 hover:cursor-pointer text-left p-2 hover:bg-blue-100 rounded-md w-full mb-3">
                    Beranda
                </div>
                <hr className="mb-3"></hr>
                <button onClick={handleLogout} className="hover:text-blue-900 text-left p-2 hover:bg-blue-100 rounded-md w-full mb-5">
                    Logout
                </button>
            </div>
        </>
    )
}

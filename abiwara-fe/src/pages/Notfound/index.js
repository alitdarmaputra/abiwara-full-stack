import { useNavigate } from "react-router-dom"
import NightOwl from "../../assets/night-owl.svg"

export const Notfound = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col w-screen h-screen items-center justify-center">
            <img src={NightOwl} alt="night-owl" className="h-52 mb-5"></img>
            <h1 className="text-3xl font-bold mb-5 text-center">Ups! Halaman tidak ditemukan</h1>
            <div className="py-3 px-5 bg-blue-700 rounded-lg shadow-lg text-white mt-5 w-fit font-bold hover:cursor-pointer active:bg-blue-900" onClick={() => navigate("/dashboard")}>Beranda</div>
        </div>
    )
}

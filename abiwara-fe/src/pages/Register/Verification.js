import { useEffect, useState } from "react"
import SuccessSentEmail from "../../assets/success_sent_email.gif"

export default function Verification() {
	const [theme, _] = useState(localStorage.getItem('theme'));

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [theme]);

    return (
        <div className="flex w-full justify-center px-10 bg-white h-screen dark:bg-[#1A202C] dark:text-gray-200">
            <div className="verifikasi_message_container mt-12">
                <img className="w-1/5 m-auto" src={SuccessSentEmail} alt=""></img>
                <h1 className="text-center text-3xl font-semibold">Verifikasi Email</h1>
                <p className="text-center mt-5">Periksa email kamu secara berkala. Kami telah mengirimkan tautan untuk melakukan verifikasi akun.</p>
            </div>
        </div>
    )
}

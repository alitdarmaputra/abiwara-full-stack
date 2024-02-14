import SuccessSentEmail from "../../assets/success_sent_email.gif"

export default function Verification() {
    return (
        <div className="flex w-full justify-center px-10 bg-white h-screen">
            <div className="verifikasi_message_container mt-12">
                <img className="w-1/5 m-auto" src={SuccessSentEmail} alt=""></img>
                <h1 className="text-center text-3xl font-semibold">Verifikasi Email</h1>
                <p className="text-center mt-5">Periksa email kamu secara berkala. Kami telah mengirimkan tautan untuk melakukan verifikasi akun.</p>
            </div>
        </div>
    )
}

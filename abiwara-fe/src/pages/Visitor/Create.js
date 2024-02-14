import httpRequest from "../../config/http-request";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { notifyError } from "../../utils/toast";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config";
import { useAuth } from "../../context/auth";

export default function VisitorCreate() {
	const { setAuthToken } = useAuth();
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmitBook = async e => {
        e.preventDefault()

        const name_input = document.querySelector("#name_input");
        const class_input = document.querySelector("#class_input");
        const pic_input = document.querySelector("#pic_input");
        const description_input = document.querySelector("#description_input");

        const payload = {
            name: name_input.value,
            class: class_input.value,
            pic: pic_input.value,
            description: description_input.value,
        }

        if (payload.name === "" || payload.class === "") {
            notifyError("Pastikan semua field sudah terisi")
            return
        }

        try {
            setLoading(true);
            const res = await axiosInstance.post(`${httpRequest.api.baseUrl}/visitor`, payload);
            setLoading(false);
            if (res.status === 201) {
                navigate("/visitor");
            } else if (res.status === 400) {
                notifyError("Masukkan tidak sesuai");
            } else if (res.status === 401) {
				setAuthToken();
            } else {
                notifyError("Gagal membuat kunjungan");
            }
        } catch (err) {
            notifyError("Pastikan masukan sesuai dan tidak diluar waktu kunjungan");
            setLoading(false);
        }
    }

    return (
        <div className="flex-grow w-full px-3 md:px-6 pt-10 md:mt-0 md:ml-64 pb-5">
            <ToastContainer />

            <div className="book__container bg-white rounded-lg mb-10 shadow-lg p-5">
                <form onSubmit={handleSubmitBook}>
                    <div className="name_form mb-3">
                        <label className="font-bold text-sm" htmlFor="name_input">Nama <span className="text-red-500">*</span></label>
                        <input id="name_input" placeholder="Ketik nama" className="font-sans focus:outline-black border-2 mt-2 w-full h-10 rounded-md p-2" type="text"></input>
                    </div>

                    <div className="class_form mb-3">
                        <label className="font-bold text-sm" htmlFor="class_input">Kelas <span className="text-red-500">*</span></label>
                        <select className='block w-full h-10 font-sans bg-white rounded-md border-2 p-2 mt-2' id="class_input" name="class">
                            <optgroup label='Kelas VII'>
                                <option value="VIIA">VIIA</option>
                                <option value="VIIB">VIIB</option>
                                <option value="VIIC">VIIC</option>
                                <option value="VIID">VIID</option>
                                <option value="VIIE">VIIE</option>
                            </optgroup>
                            <optgroup label='Kelas VIII'>
                                <option value="VIIIA">VIIIA</option>
                                <option value="VIIIB">VIIIB</option>
                                <option value="VIIIC">VIIIC</option>
                                <option value="VIIID">VIIID</option>
                                <option value="VIIIE">VIIIE</option>
                            </optgroup>
                            <optgroup label='Kelas IX'>
                                <option value="IXA">IXA</option>
                                <option value="IXB">IXB</option>
                                <option value="IXC">IXC</option>
                                <option value="IXD">IXD</option>
                                <option value="IXE">IXE</option>
                            </optgroup>
                        </select>
                    </div>

                    <div className="pic_form mb-3">
                        <label className="font-bold text-sm" htmlFor="pic_input">Nama Penanggung Jawab</label>
                        <input id="pic_input" placeholder="Ketik nama penanggung jawab" className="font-sans focus:outline-black border-2 mt-2 w-full h-10 rounded-md p-2" type="text"></input>
                    </div>

                    <div className="description_form mb-3">
                        <label className="font-bold text-sm" htmlFor="description_input">Deskripsi</label>
                        <textarea id="description_input" placeholder="Ketik deskripsi" className="font-sans focus:outline-black border-2 mt-2 w-full h-72 rounded-md p-2"></textarea>
                    </div>

                    {isLoading ?
                        <button disabled type="button" className="mt-10 w-full h-10 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-900">
                            <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                            </svg>
                            Memuat...
                        </button>
                        :
                        <button className="mt-10 w-full h-10 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-900" onClick={handleSubmitBook}>Buat</button>
                    }
                </form>
            </div>
        </div>
    )
}

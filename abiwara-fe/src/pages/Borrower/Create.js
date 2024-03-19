import AsyncSelect from 'react-select/async';
import httpRequest from "../../config/http-request";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { notifyError } from "../../utils/toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/auth';
import axiosInstance from '../../config';

export default function BorrowerCreate() {
    const [book, setBook] = useState();
    const [user, setUser] = useState();
	const { setAuthToken } = useAuth();
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmitBorrower = async e => {
        e.preventDefault()

        const due_date_input = document.querySelector("#due_date_input");

        if (!due_date_input.value || !user || !book) {
            notifyError("Pastikan semua field sudah terisi")
            return
        }

        const payload = {
            user_id: user,
            book_id: book,
            due_date: new Date(due_date_input.value).toISOString(),
        }

        try {
            setLoading(true);
            const res = await axiosInstance.post(`${httpRequest.api.baseUrl}/borrower`, payload);
            setLoading(false);

            if (res.status === 201) {
                navigate("/borrow");
            } else if (res.status === 400) {
                notifyError("Masukkan tidak sesuai atau buku tidak tersedia");
            } else if (res.status === 401) {
				setAuthToken();
            } else {
                notifyError("Gagal membuat data pinjaman");
            }
        } catch (err) {
            console.log(err);
            notifyError("Gagal membuat data pinjaman")
        }
    }

    const loadMember = async search => {
        const res = await axiosInstance.get(`${httpRequest.api.baseUrl}/member?search=${search}`)
        const options = res.data?.data?.map(option => {
            return {
                value: option.id,
                label: `${option.name} | ${option.class}`
            }
        })
        return options;
    }

    const loadBook = async search => {
        const res = await axiosInstance.get(`${httpRequest.api.baseUrl}/book?search=${search}&exist=true`)
        const options = res.data?.data?.map(option => {
            return {
                value: option.id,
                label: `${option.title}`
            }
        })
        return options;
    }

    return (
        <div className="flex-grow w-full">
            <ToastContainer />

            <div className="book__container bg-white dark:bg-[#2D3748] dark:text-gray-200 rounded-lg mb-10 p-5">
                <form>
                    <div className="member_form mb-3">
                        <label className="font-bold text-sm" htmlFor="category_input">Nama Peminjam <span className="text-red-500">*</span></label>
                        <AsyncSelect
							unstyled
							classNames={{
								control: () => 'mt-2 rounded-md bg-transparent dark:text-gray-200 border-2 dark:border-gray-500 p-2',
								option: () => 'bg-white dark:bg-[#1A202C] dark:text-gray-200 p-2',
								noOptionsMessage: () => 'bg-white dark:bg-[#1A202C] dark:text-gray-200 p-2',
							}}
                            id="member_input"
                            cacheOptions
                            loadOptions={loadMember}
                            placeholder="Pilih anggota"
                            noOptionsMessage={() => "Anggota tidak ditemukan"}
                            onChange={choice => setUser(choice.value)}
                        >
                        </AsyncSelect>
                    </div>

                    <div className="book_form mb-3">
                        <label className="font-bold text-sm" htmlFor="category_input">Judul Buku <span className="text-red-500">*</span></label>
                        <AsyncSelect
							unstyled
							classNames={{
								control: () => 'mt-2 rounded-md bg-transparent dark:text-gray-200 border-2 dark:border-gray-500 p-2',
								option: () => 'bg-white dark:bg-[#1A202C] dark:text-gray-200 p-2',
								noOptionsMessage: () => 'bg-white dark:bg-[#1A202C] dark:text-gray-200 p-2',
							}}
                            id="member_input"
                            cacheOptions
                            loadOptions={loadBook}
                            placeholder="Pilih buku"
                            noOptionsMessage={() => "Buku tidak ditemukan"}
                            onChange={choice => setBook(choice.value)}
                        >
                        </AsyncSelect>
                    </div>

                    <div className="due_date_form mb-3">
                        <label className="font-bold text-sm" htmlFor="due_date_input">Tanggal Pengembalian <span className="text-red-500">*</span></label>
                        <input id="due_date_input" placeholder="Tanggal pengembalian" className="font-sans focus:outline-black border-2 mt-2 w-full h-10 rounded-md p-2 dark:bg-transparent dark:border-gray-500" type="date"></input>
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
                        <button className="mt-10 w-full h-10 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-900" onClick={handleSubmitBorrower}>Buat</button>
                    }
                </form>
            </div>
        </div>
    )
}

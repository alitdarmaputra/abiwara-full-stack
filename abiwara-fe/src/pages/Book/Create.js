import { numToIDR } from "../../utils/formatter";
import AsyncSelect from 'react-select/async';
import httpRequest from "../../config/http-request";
import { useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import { notifyError } from "../../utils/toast";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../config";
import { useAuth } from "../../context/auth";
import { FaTrash } from "react-icons/fa";

export default function BookCreate() {
    const [category, setCategory] = useState("");
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();
	const { setAuthToken } = useAuth();
	const status = useRef();
	const [coverImg, setCoverImg] = useState({});
	const [isLoadingImg, setLoadingImg] = useState(false);

    const handleSubmitBook = async e => {
        e.preventDefault()

        const title_input = document.querySelector("#title_input");
		const inventory_input = document.querySelector("#inventory_input");
        const price_input = document.querySelector("#price_input");
        const author_input = document.querySelector("#author_input");
        const publisher_input = document.querySelector("#publisher_input");
        const year_input = document.querySelector("#year_input");
        const city_input = document.querySelector("#city_input");
		const page_input = document.querySelector("#page_input");
        const quantity_input = document.querySelector("#quantity_input");
        const entry_date_input = document.querySelector("#entry_date_input");
		const source_input = document.querySelector("#source_input")
        const summary_input = document.querySelector("#summary_input");
		const call_author_input = document.querySelector("#call_author_input");
		const call_title_input = document.querySelector("#call_title_input");

        if (title_input.value === "" || inventory_input.value === "" || quantity_input.value === "" || category === "" || call_title_input.value === "") {
            notifyError("Pastikan semua field sudah terisi")
            return
        }

        if (year_input.value !== "" && isNaN(year_input.value)) {
            notifyError("Format tahun terbit tidak sesuai");
            return
        }

        if (page_input.value !== "" && isNaN(page_input.value)) {
            notifyError("Format jumlah halaman tidak sesuai");
            return
        }

        if (quantity_input.value !== "" && isNaN(quantity_input.value)) {
            notifyError("Format jumlah buku tidak sesuai");
            return
        }

        const payload = {
			cover_img: coverImg.id,
			inventory_number: inventory_input.value,
			title: title_input.value,
			call_number_title: call_title_input.value,
            price: parseInt(price_input.value.replace("Rp. ", "").replace(/\./, "")),
            author: author_input.value,
			call_number_author: call_author_input.value,
            publisher: publisher_input.value,
			year: parseInt(year_input.value),
			city: city_input.value,
			quantity: parseInt(quantity_input.value),
			total_page: parseInt(page_input.value),
            entry_date: entry_date_input.value ? new Date(entry_date_input.value).toISOString() : null,
			source: source_input.value,
			status: status.current.value,
            summary: summary_input.value,
            category_id: category,
        }

        try {
            setLoading(true);
            const res = await axiosInstance.post(`${httpRequest.api.baseUrl}/book`, payload);

            if (res.status === 201) {
                navigate("/book");
            }
			setLoading(false);
		} catch (err) {
			if (err.response.data.code === 400 ) {
				notifyError("Masukkan tidak sesuai");
			} else if (err.response.data.code === 401 ) {
				setAuthToken();
			} else {
				notifyError("Server error");
				console.log(err);
			}
			setLoading(false);
        }
    }

    const formatValue = e => {
        e.target.value = numToIDR(e.target.value);
    }

    const loadCategory = async search => {
        const res = await axiosInstance.get(`${httpRequest.api.baseUrl}/category?search=${search}`)
        const options = res.data?.data?.map(option => {
            return {
                value: option.id,
                label: `${option.id} | ${option.name}`
            }
        })
        return options;
    }

	const handleSubmitImg = async e => {
		e.preventDefault();
		const form = document.getElementById("cover-image__form");
		const formData = new FormData(form);
		try {
			setLoadingImg(true);
			let res = await axiosInstance.post(`${httpRequest.api.baseUrl}/image-upload`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			setLoadingImg(false);
			setCoverImg(res.data?.data);
		} catch(err) {
			if (err.response.data.code === 413) {
				notifyError("Ukuran file terlalu besar");
			} else if (err.response.data.code === 400 ) {
				notifyError("Format file tidak didukung");
			} else {
				notifyError("Server error");
				console.log(err);
			}
			setLoadingImg(false);
		}
	}
	
	const handleDeleteImg = () => {
		setLoadingImg(true);
		axiosInstance.delete(`${httpRequest.api.baseUrl}/image-upload/${coverImg.id}`)
		.then(() => {
			setLoadingImg(false);
			setCoverImg({});
		})
		.catch((err) => {
			console.log(err)
		})
	}

    return (
        <div className="flex-grow w-full">
            <ToastContainer />

            <div className="book__container bg-white rounded-lg mb-10 p-5 dark:bg-[#2D3748] dark:text-gray-200">
				<div className="flex justify-end">
					<Link className="h-10 px-4 bg-blue-700 font-bold text-white shadow-md rounded-md flex justify-center items-center" to="/book/bulk-create">
						+ <span className="hidden md:block pl-2">Bulk Create</span>
					</Link>
				</div>
                <form onSubmit={handleSubmitBook}>
                    <div className="title_form mb-3">
                        <label className="font-bold text-sm" htmlFor="title_input">Judul <span className="text-red-500">*</span></label>
                        <input id="title_input" placeholder="Ketik judul" className="font-sans focus:outline-black border-2 mt-2 w-full h-10 rounded-md p-2 dark:bg-transparent dark:border-gray-500" type="text"></input>
                    </div>

                    <div className="inventory_form mb-3">
                        <label className="font-bold text-sm" htmlFor="inventory_input">No Inventaris <span className="text-red-500">*</span></label>
                        <input id="inventory_input" placeholder="Ketik no inventaris" className="font-sans focus:outline-black border-2 mt-2 w-full h-10 rounded-md p-2 dark:bg-transparent dark:border-gray-500" type="text"></input>
                    </div>

                    <div className="price_form mb-3">
                        <label className="font-bold text-sm" htmlFor="price_input">Harga</label>
                        <input onChange={formatValue} id="price_input" placeholder="Ketik harga" className="font-sans focus:outline-black border-2 mt-2 w-full h-10 rounded-md p-2 dark:bg-transparent dark:border-gray-500" type="text"></input>
                    </div>

                    <div className="author_form mb-3">
                        <label className="font-bold text-sm" htmlFor="author_input">Penulis</label>
                        <input id="author_input" placeholder="Ketik penulis" className="font-sans focus:outline-black border-2 mt-2 w-full h-10 rounded-md p-2 dark:bg-transparent dark:border-gray-500" type="text"></input>
                    </div>

                    <div className="publisher_form mb-3">
                        <label className="font-bold text-sm" htmlFor="publisher_input">Penerbit</label>
                        <input id="publisher_input" placeholder="Ketik penerbit" className="font-sans focus:outline-black border-2 mt-2 w-full h-10 rounded-md p-2 dark:bg-transparent dark:border-gray-500" type="text"></input>
                    </div>

                    <div className="year_form mb-3">
                        <label className="font-bold text-sm" htmlFor="year_input">Tahun Terbit</label>
                        <input id="year_input" placeholder="Ketik tahun terbit" className="font-sans focus:outline-black border-2 mt-2 w-full h-10 rounded-md p-2 dark:bg-transparent dark:border-gray-500" type="text"></input>
                    </div>

                    <div className="city_form mb-3">
                        <label className="font-bold text-sm" htmlFor="city_input">Kota Terbit</label>
                        <input id="city_input" placeholder="Ketik kota terbit" className="font-sans focus:outline-black border-2 mt-2 w-full h-10 rounded-md p-2 dark:bg-transparent dark:border-gray-500" type="text"></input>
                    </div>

                    <div className="page_form mb-3">
                        <label className="font-bold text-sm" htmlFor="page_input">Jumlah Halaman</label>
                        <input id="page_input" placeholder="Ketik jumlah halaman" className="font-sans focus:outline-black border-2 mt-2 w-full h-10 rounded-md p-2 dark:bg-transparent dark:border-gray-500" type="text"></input>
                    </div>

                    <div className="quantity_form mb-3">
                        <label className="font-bold text-sm" htmlFor="quantity_input">Jumlah Buku <span className="text-red-500">*</span></label>
                        <input id="quantity_input" placeholder="Ketik jumlah buku" className="font-sans focus:outline-black border-2 mt-2 w-full h-10 rounded-md p-2 dark:bg-transparent dark:border-gray-500" type="text"></input>
                    </div>

                    <div className="status_form mb-3">
                        <label className="font-bold text-sm" htmlFor="status_input">Status</label>
						<select ref={status} className='block w-full h-10 font-sans bg-white rounded-md p-2 dark:bg-[#2D3748] mt-2 border-2 dark:border-gray-500' id="class_input" name="class">
							<option value="BAIK">Baik</option>
							<option value="TIDAK BAIK">Tidak baik</option>
						</select>
                    </div>

                    <div className="entry_date_form mb-3">
                        <label className="font-bold text-sm" htmlFor="entry_date_input">Tanggal Masuk</label>
                        <input id="entry_date_input" placeholder="Tanggal pembelian" className="font-sans focus:outline-black border-2 mt-2 w-full h-10 rounded-md p-2 dark:bg-transparent dark:border-gray-500" type="date"></input>
                    </div>

                    <div className="source_form mb-3">
                        <label className="font-bold text-sm" htmlFor="page_input">Asal</label>
                        <input id="source_input" placeholder="Ketik asal dana" className="font-sans focus:outline-black border-2 mt-2 w-full h-10 rounded-md p-2 dark:bg-transparent dark:border-gray-500" type="text"></input>
                    </div>

                    <div className="call_author_form mb-3">
                        <label className="font-bold text-sm" htmlFor="call_author_input">Nomor Panggil Penulis</label>
                        <input id="call_author_input" placeholder="Ketik nomor panggil pengarang" className="font-sans focus:outline-black border-2 mt-2 w-full h-10 rounded-md p-2 dark:bg-transparent dark:border-gray-500" type="text"></input>
                    </div>

                    <div className="call_title_form mb-3">
                        <label className="font-bold text-sm" htmlFor="call_title_input">Nomor Panggil Judul Buku <span className="text-red-500">*</span></label>
                        <input id="call_title_input" placeholder="Ketik nomor panggil judul buku" className="font-sans focus:outline-black border-2 mt-2 w-full h-10 rounded-md p-2 dark:bg-transparent dark:border-gray-500" type="text"></input>
                    </div>

                    <div className="summary_form mb-3">
                        <label className="font-bold text-sm" htmlFor="summary_input">Ringkasan</label>
                        <textarea id="summary_input" placeholder="Ketik ringkasan" className="font-sans focus:outline-black border-2 mt-2 w-full h-72 rounded-md p-2 dark:bg-transparent dark:border-gray-500"></textarea>
                    </div>

                    <div className="category_form mb-3">
                        <label className="font-bold text-sm" htmlFor="category_input">Kategori <span className="text-red-500">*</span></label>
						<AsyncSelect
							unstyled
							classNames={{
								control: () => 'mt-2 rounded-md bg-transparent dark:text-gray-200 border-2 dark:border-gray-500 p-2',
								option: () => 'bg-white dark:bg-[#1A202C] dark:text-gray-200 p-2',
								noOptionsMessage: () => 'bg-white dark:bg-[#1A202C] dark:text-gray-200 p-2',
							}}
							id="category_input"
							cacheOptions
							loadOptions={loadCategory}
							placeholder="Pilih kategori"
							noOptionsMessage={() => "Kategori tidak ditemukan"}
							onChange={choice => setCategory(choice.value)}
						>
						</AsyncSelect>
                    </div>
                </form>

				<form id="cover-image__form" onChange={handleSubmitImg}>
					<p className="font-bold text-sm mb-3">Gambar Sampul</p>
					<p className="text-xs mb-3 text-gray-500">Tipe file .png / .jpeg. Ukuran maksimum 4 mb </p>
                    <div className="flex w-full justify-between mb-10">
						<input id="cover-image_input" type="file" accept="image/png, image/jpeg" name="image" />
						<div className="flex items-center gap-4">
							{
								isLoadingImg && (
									<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
										<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
									</svg>
								)
							}
							{
								coverImg.image_url && !isLoadingImg && (
									<button className="dark:text-white" onClick={() => handleDeleteImg()}><FaTrash /></button>
								)
							}
						</div>
					</div>
					<div id="uploaded-image">
						{ coverImg.image_url && (
							<div className="w-[154px] h-[246px]">
								<img className="object-cover w-full h-full" alt="book cover" src={coverImg.image_url} />
							</div>
						)}
					</div>
				</form>

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
            </div>
        </div>
    )
}

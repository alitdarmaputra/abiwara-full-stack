import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BsCloudDownloadFill, BsFillTrashFill } from "react-icons/bs";
import httpRequest from "../../config/http-request";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AiFillEye } from "react-icons/ai";
import { useAuth } from "../../context/auth";
import Modal from "../../components/Modal";
import axiosInstance from "../../config";
import { UserContext } from "../../context/user";
import Pagination from "../../components/Pagination";
import { notifyError } from "../../utils/toast";
import { FaSortAmountDown } from "react-icons/fa";

export default function Book() {
    const [books, setBooks] = useState({});
	const [showSort, setShowSort] = useState(false);
    const [bookDetail, setBookDetail] = useState();
    const [isLoading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [meta, setMeta] = useState({});
    const [active, setActive] = useState(false);
    const [action, setAction] = useState();
    const { setAuthToken } = useAuth();
	const sortRef = useRef();
	const orderRef = useRef();
	const { user } = useContext(UserContext);
	const navigate = useNavigate();

	const handleSort = () => {
		let sort = sortRef.current.value;
		const url = new URL(window.location.href)
		url.searchParams.delete("page");
		
		url.searchParams.set("sort", sort);	

		navigate(`${url.pathname}?${url.searchParams.toString()}`);
	}

	const checkSort = () => {
		const url = new URL(window.location.href);
		const sort = url.searchParams.get("sort");
		return sort;
	}

	const handleOrder = () => {
		let order = orderRef.current.value;
		const url = new URL(window.location.href)
		url.searchParams.delete("page");
		
		url.searchParams.set("order", order);	

		navigate(`${url.pathname}?${url.searchParams.toString()}`);
	}

	const checkOrder = () => {
		const url = new URL(window.location.href);
		const order = url.searchParams.get("order");
		return order;
	}

    useEffect(() => {
        async function getBooks() {
			try {
				const url = new URL(window.location.href);

				const res = await axiosInstance.get(`${httpRequest.api.baseUrl}/book?${url.searchParams.toString()}`);
                setBooks(res.data.data)
                setMeta(res.data.meta)
                setLoading(false)
			} catch(err) {
				if (err.response.data.code === 401) {
					notifyError("Sesi telah selesai");
					setAuthToken();
				} else {
					notifyError("Server error");
					console.log(err);
				}
			}
        }
        getBooks()
    }, [searchParams, active, setAuthToken])

    const handleSearch = async e => {
        e.preventDefault()
		try {
			let page = searchParams.get("page") ? searchParams.get("page") : 1;

			const res = await axiosInstance.get(`${httpRequest.api.baseUrl}/book?page=${page}&&search=${e.target.value}`);
            setBooks(res.data.data)
            setMeta(res.data.meta)
		} catch(err) {
			if (err.response.data.code === 401) {
				notifyError("Sesi telah selesai");
				setAuthToken();
			} else {
				notifyError("Server error");
				console.log(err);
			}
		}
    }

    const deleteBook = id => {
        return async () => {
			try{
				await axiosInstance.delete(`${httpRequest.api.baseUrl}/book/${id}`);
				setActive(false);
			} catch(err) {
				if (err.response.data.code === 401) {
					notifyError("Sesi telah selesai");
					setAuthToken();
				} else {
					notifyError("Server error");
					console.log(err);
				}
			}
        }
    }

    const handleDownload = () => {
        async function getBook() {
            let res = await axiosInstance.get(`${httpRequest.api.baseUrl}/book-file`, {
                headers: {
                    "Content-Type": "text/csv"
                },
                responseType: "blob"
            });
            const url = window.URL.createObjectURL(res.data)
            const link = document.createElement("a");
            link.href = url
            link.setAttribute(
                "download",
                "daftar buku - " + new Date().toLocaleString() + ".csv"
            )

            document.body.appendChild(link)
            link.click()
            link.parentNode.removeChild(link)
        }

        getBook()
    }
	
    if (isLoading) {
        return (
            <div className="w-full h-screen flex justify-center items-center dark:bg-[#1A202C]">
                <svg aria-hidden="true" role="status" className="inline w-8 h-8 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                </svg>
            </div>
        )
    }

    return (
        <>
            <Modal active={active} setActive={setActive} title="Hapus Buku" children={bookDetail} action={action}></Modal>

            <div className="book__container bg-white dark:bg-[#2D3748] rounded-lg mb-10 dark:text-gray-200">
                <div className="table_head__container flex justify-between p-5 box-border items-center">
                    <div className="flex h-full">
                        <input id="keyword__input" placeholder="Ketik judul atau pengarang" onInput={handleSearch} className="font-sans focus:outline-none border-l-2 border-y-2 w-full h-5 rounded-l-full p-5 dark:bg-transparent dark:border-gray-500" type="text"></input>
                        <div className='bg-white border-y-2 border-r-2 rounded-r-full pr-3 flex items-center text-slate-300 dark:bg-gray-700 dark:border-gray-500'>
                            <AiOutlineSearch size="20px" />
                        </div>
						<button onClick={() => setShowSort(!showSort)} className="ml-2 px-4 font-bold text-gray-400 rounded-md flex justify-center items-center">
							<FaSortAmountDown></FaSortAmountDown>
						</button>
                    </div>

                    {(user.role === 1 || user.role === 2) && (
                        <div className="action_btn__container flex gap-2 ml-10 md:ml-0">
                            <Link className="h-10 px-4 bg-gray-700 text-white font-bold shadow-md rounded-md flex justify-center items-center download-csv" onClick={handleDownload}>
                                <BsCloudDownloadFill></BsCloudDownloadFill> <span className="hidden md:block pl-2">Unduh</span>
                            </Link>
                            <Link className="h-10 px-4 bg-blue-700 font-bold text-white shadow-md rounded-md flex justify-center items-center" to="/book/create">
                                + <span className="hidden md:block pl-2">Tambah buku</span>
                            </Link>
                        </div>
                    )}
                </div>

				<div className={`${showSort ? "" : "h-0"} w-full px-5 overflow-hidden rounded-none transition-all`}>
					<p className="roboto-bold mb-3 text-gray-400">Urutkan Berdasarkan</p>
					<div className="flex gap-2">
						<select defaultValue={checkSort()} onChange={handleSort} ref={sortRef} id="sort" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
							<option value="updated_at">Tanggal</option>
							<option value="title">Judul Buku</option>
							<option value="id">No</option>
							<option value="author">Penulis</option>
						</select>
						<select defaultValue={checkOrder()} onChange={handleOrder} ref={orderRef} id="order" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
							<option value="desc">Z-A</option>
							<option value="asc">A-Z</option>
						</select>
					</div>
				</div>

                <div className="table__container relative shadow-sm w-full overflow-x-auto sm:rounded-md mb-9 text-sm">
                    <table id="table" className="w-full text-sm">
                        <thead className="text-slate-500 font-bold">
                            <tr className="border-b dark:border-b dark:border-b-gray-500">
								<th className="p-5 box-border">NO</th>
								<th className="p-5">JUDUL BUKU</th>
                                <th className="min-w-20 p-5 box-border">PENULIS</th>
                                <th className="min-w-20 p-5 box-border">TAHUN</th>
                                <th className="min-w-20 p-5 box-border">KATEGORI</th>
                                <th className="min-w-10 p-5 box-border">SISA</th>
                                <th className="min-w-30 p-5 box-border">AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                books.length < 1 ?
                                    <tr><td colSpan="7" className="text-center py-6">Tidak ada buku yang ditemukan</td></tr>
                                    : books.map(book => {
                                        return (
                                            <tr key={book.id} className="border-b text-left hover:bg-slate-50 dark:hover:bg-gray-700 dark:border-gray-500">
                                                <td className="box-border p-5 text-center">{book.id}</td>
                                                <td className="box-border p-5 text-wrap">{book.title}</td>
												<td className="box-border p-5">{book.author}</td>
												<td className="box-border text-center p-5">{book.year}</td>
												<td className="box-border p-5">{book.category.name}</td>
												<td className="box-border text-center p-5">{book.remain}</td>
                                                <td className="box-border p-5">
													<div className="flex justify-center items-center gap-5">

														<Link to={`/book/${book.id}`} className="flex justify-center items-center h-full">
															<AiFillEye></AiFillEye>
														</Link >

														{
															( user.role === 1 || user.role === 2) && book.remain === book.quantity && (
																<BsFillTrashFill className="hover:cursor-pointer" onClick={() => {
																	setActive(true);
																	setBookDetail(() => {
																		return (
																			<>
																				<p className="font-md mt-3">Apakah anda yakin ingin menghapus buku berikut:</p>

																				<table className="font-sans mt-3">
																					<tr>
																						<td>Judul</td>
																						<td className="w-10 text-center"> : </td>
																						<td>{book.title}</td>
																					</tr>
																					<tr>
																						<td>Tahun Terbit</td>
																						<td className="w-10 text-center"> : </td>
																						<td>{book.year}</td>
																					</tr>
																					<tr>
																						<td>Penulis</td>
																						<td className="w-10 text-center"> : </td>
																						<td>{book.author}</td>
																					</tr>
																				</table>
																			</>
																		)
																	})
																	setAction(() => deleteBook(book.id))
																}}></BsFillTrashFill>
															)
														}
													</div>
                                                </td>
                                            </tr>
                                        )
                                    })
                            }
                        </tbody>
                    </table>
					<p className="px-5 py-2 mb-4 md:mb-auto">{`Menampilkan ${books.length} buku dari total ${meta.total} buku`}</p>
                </div>

                <div className="pagination__container flex w-full justify-center text-slate-800 pb-5 dark:text-gray-200">
					<Pagination stringUrl={window.location.href} currPage={meta.page} totalPage={meta.total_page} n={3} />
				</div>
            </div>
        </>
    )
}

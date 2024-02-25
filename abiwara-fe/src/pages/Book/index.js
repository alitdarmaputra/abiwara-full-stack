import React, { useContext, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BsChevronDoubleLeft, BsChevronDoubleRight, BsChevronLeft, BsChevronRight, BsCloudDownloadFill, BsFillTrashFill } from "react-icons/bs";
import httpRequest from "../../config/http-request";
import { Link, ScrollRestoration, useSearchParams } from "react-router-dom";
import { AiFillEye } from "react-icons/ai";
import { useAuth } from "../../context/auth";
import Modal from "../../components/Modal";
import axiosInstance from "../../config";
import { UserContext } from "../../context/user";

export default function Book() {
    const [books, setBooks] = useState({});
    const [bookDetail, setBookDetail] = useState();
    const [isLoading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [meta, setMeta] = useState({});
    const [active, setActive] = useState(false);
    const [action, setAction] = useState();
    const { setAuthToken } = useAuth();
	const { user } = useContext(UserContext);

    useEffect(() => {
        async function getBooks() {
            let page = searchParams.get("page") ? searchParams.get("page") : 1;
            const res = await axiosInstance.get(`${httpRequest.api.baseUrl}/book?page=${page}`);
            if (res.status === 200) {
                setBooks(res.data.data)
                setMeta(res.data.meta)
                setLoading(false)
            } else if (res.status === 401) {
				setAuthToken();
            }
        }
        getBooks()
    }, [searchParams, active, setAuthToken])

    const handleSearch = async e => {
        e.preventDefault()

        let page = searchParams.get("page") ? searchParams.get("page") : 1;

        const res = await axiosInstance.get(`${httpRequest.api.baseUrl}/book?page=${page}&&search=${e.target.value}`);

        if (res.status === 200) {
            setBooks(res.data.data)
            setMeta(res.data.meta)
        } else if (res.status === 401) {
			setAuthToken();
        }
    }

    const deleteBook = id => {
        return async () => {
            const res = await axiosInstance.delete(`${httpRequest.api.baseUrl}/book/${id}`);
            if (res.status === 200) {
                return true;
            } else if (res.status === 401) {
				setAuthToken();
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
            <div className="w-full h-screen flex justify-center items-center md:ml-64">
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
                    <div className="flex w-72 h-full">
                        <input id="keyword__input" placeholder="Ketik judul atau pengarang" onInput={handleSearch} className="font-sans focus:outline-none border-l-2 border-y-2 w-full h-5 rounded-l-full p-5 dark:bg-transparent dark:border-gray-500" type="text"></input>
                        <div className='bg-white border-y-2 border-r-2 rounded-r-full pr-3 flex items-center text-slate-300 dark:bg-gray-700 dark:border-gray-500'>
                            <AiOutlineSearch size="20px" />
                        </div>
                    </div>

                    {user.role === 1 && (
                        <div className="action_btn__container flex gap-2">
                            <Link className="h-10 px-4 bg-gray-700 text-white font-bold shadow-md rounded-md flex justify-center items-center download-csv" onClick={handleDownload}>
                                <BsCloudDownloadFill></BsCloudDownloadFill> <span className="hidden md:block pl-2">Unduh</span>
                            </Link>
                            <Link className="h-10 px-4 bg-blue-700 font-bold text-white shadow-md rounded-md flex justify-center items-center" to="/book/create">
                                + <span className="hidden md:block pl-2">Tambah buku</span>
                            </Link>
                        </div>
                    )}
                </div>

                <div className="table__container shadow-sm w-full overflow-x-auto sm:rounded-md mb-9 text-sm">
                    <table id="table" className="w-full text-sm">
                        <thead className="text-slate-500 font-bold">
                            <tr className="border-b dark:border-b dark:border-b-gray-500">
								<th className="p-5 box-border">JUDUL BUKU</th>
                                <th className="min-w-20 p-5 box-border">PENYUSUN</th>
                                <th className="min-w-20 p-5 box-border">TAHUN</th>
                                <th className="min-w-20 p-5 box-border">KATEGORI</th>
                                <th className="min-w-10 p-5 box-border">SISA</th>
                                <th className="min-w-30 p-5 box-border">AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                books.length < 1 ?
                                    <tr><td colSpan="5" className="text-center py-6">Tidak ada buku yang ditemukan</td></tr>
                                    : books.map(book => {
                                        return (
                                            <tr key={book.id} className="border-b text-left hover:bg-slate-50 dark:hover:bg-gray-700 dark:border-gray-500">
                                                <td className="box-border p-5 text-wrap">{book.title}</td>
												<td className="box-border p-5">{book.author}</td>
												<td className="box-border text-center p-5">{book.year}</td>
												<td className="box-border p-5">{book.category}</td>
												<td className="box-border text-center p-5">{book.remain}</td>
                                                <td className="box-border p-5">
													<div className="flex justify-center items-center gap-5">

														<Link to={`/book/${book.id}`} className="flex justify-center items-center h-full">
															<AiFillEye></AiFillEye>
														</Link >

														{
															user.role === 1 && book.remain === book.quantity && (
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
																						<td>{book.published}</td>
																					</tr>
																					<tr>
																						<td>Pengarang</td>
																						<td className="w-10 text-center"> : </td>
																						<td>{book.authors}</td>
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
                </div>

                <div className="pagination__container flex w-full justify-center text-slate-800 pb-5 dark:text-gray-200">
                    <div className="pagination flex w-60 justify-evenly items-center">
                        <Link to={`/book?page=1`}><BsChevronDoubleLeft /></Link>

                        {
                            meta.page !== 1 && (
                                <Link to={`/book?page=${meta.page - 1}`}><BsChevronLeft /></Link>
                            )
                        }

                        {
                            !isLoading && (
                                function() {
                                    const pageNums = []
                                    for (let i = 1; i <= meta.total_page; i++) {
                                        if (i === meta.page) {
                                            pageNums.push(<Link key={i} className="page h-8 w-8 rounded-md shadow-md text-white bg-blue-700 flex items-center justify-center" to={`/book?page=${i}`}>{i}</Link>)
                                        } else {
                                            pageNums.push(<Link key={i} className="page" to={`/book?page=${i}`}>{i}</Link>)
                                        }
                                    }
                                    return <>{pageNums}</>
                                }()
                            )
                        }

                        {
                            meta.page !== meta.total_page && (
                                <Link to={`/book?page=${meta.page + 1}`}><BsChevronRight /></Link>
                            )
                        }

                        <Link to={`/book?page=${meta.total_page}`}><BsChevronDoubleRight /></Link>
                    </div>
                </div>
            </div>
			<ScrollRestoration />
        </>
    )
}

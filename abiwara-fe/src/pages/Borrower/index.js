import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import httpRequest from "../../config/http-request";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { formatDate } from "../../utils/formatter";
import Modal from "../../components/Modal";
import axiosInstance from "../../config";
import { UserContext } from "../../context/user";
import Pagination from "../../components/Pagination";
import { notifyError } from "../../utils/toast";
import { FaFilter } from "react-icons/fa";

export default function Borrower() {
    const [borrowers, setBorrowers] = useState({});
	const [showFilter, setShowFilter] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [meta, setMeta] = useState({});
    const [active, setActive] = useState(false);
    const [finishDetail, setFinishDetail] = useState();
    const [action, setAction] = useState();
    const { setAuthToken } = useAuth();
	const { user } = useContext(UserContext);
    const [isUpdate, setUpdate] = useState();
	const filterRef = useRef();
	const navigate = useNavigate();

    const updateRating = async (borrower_id, book_id, rating) => {
        try {
            await axiosInstance.post(`${httpRequest.api.baseUrl}/rating`, {
                borrower_id: borrower_id,
                book_id: book_id,
                rating: rating
            });
            setUpdate(!isUpdate);
        } catch (err) {
            console.log(err);
        }
    }
	
	const checkFilter = () => {
		const url = new URL(window.location.href);
		const filter = url.searchParams.get("status");
		return filter;
	}

    const handleFilter = () => {
		let status = filterRef.current.value;
		const url = new URL(window.location.href)

		if (filterRef.value === "")
			url.searchParams.delete("status")
		else
			url.searchParams.set("status", status)

		navigate(`${url.pathname}?${url.searchParams.toString()}`);
    };

    useEffect(() => {
        async function getBorrowers() {
			try {
				const url = new URL(window.location.href);
				const res = await axiosInstance.get(`${httpRequest.api.baseUrl}/borrower?${url.searchParams.toString()}`);
                setBorrowers(res.data.data)
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
        getBorrowers()
    }, [searchParams, active, isUpdate, setAuthToken])

    const handleSearch = async e => {
        e.preventDefault()

        let page = searchParams.get("page") ? searchParams.get("page") : 1;
		try {
			const res = await axiosInstance.get(`${httpRequest.api.baseUrl}/borrower?page=${page}&&search=${e.target.value}`);
            setBorrowers(res.data.data)
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

    const createUpdateBorrower = id => {
        return async () => {
            const res = await axiosInstance.put(`${httpRequest.api.baseUrl}/borrower/${id}`);
            if (res.status === 200) {
                return true;
            } else if (res.status === 401) {
				setAuthToken();
            }
        }
    }

    if (isLoading) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <svg aria-hidden="true" role="status" className="inline w-8 h-8 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                </svg>
            </div>
        )
    }

    return (
        <div className="flex-grow w-full">
            <Modal active={active} setActive={setActive} title="Selesaikan Pinjaman" children={finishDetail} action={action}></Modal>

            <div className="borrower__container bg-white dark:bg-[#2D3748] dark:text-gray-200 rounded-lg mb-10">
                <div className="table_head__container flex justify-between p-5 box-border items-center">
                    <div className="flex h-full">
                        <input id="keyword__input" placeholder="Ketik nama atau judul buku" onInput={handleSearch} className="font-sans focus:outline-none border-l-2 border-y-2 w-full h-5 rounded-l-full p-5 dark:bg-transparent dark:border-gray-500" type="text"></input>
                        <div className='bg-white border-y-2 border-r-2 rounded-r-full pr-3 flex items-center text-slate-300 dark:bg-gray-700 dark:border-gray-500'>
                            <AiOutlineSearch size="20px" />
                        </div>
						<button onClick={() => setShowFilter(!showFilter)} className="ml-2 px-4 font-bold text-gray-400 rounded-md flex justify-center items-center">
                            <FaFilter />
						</button>
                    </div>

                    {(user.role === 1 || user.role === 2) && (
                        <Link className="h-10 px-4 bg-blue-700 font-bold text-white shadow-md rounded-md flex justify-center items-center" to="/borrow/create">
                            + <span className="hidden md:block pl-2">Buat pinjaman</span>
                        </Link>
                    )}
                </div>

				<div className={`${showFilter? "" : "h-0 overflow-hidden"} w-full px-5 rounded-none transition-all`}>
					<p className="roboto-bold text-sm mb-3 text-gray-400">Filter Status</p>
					<select defaultValue={checkFilter()} onChange={handleFilter} ref={filterRef} id="filter" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
						<option value="">Semua</option>
						<option value="0">Pinjaman</option>
						<option value="1">Selesai</option>
					</select>
				</div>

                <div className="table__container shadow-sm w-full overflow-x-scroll sm:rounded-md mb-9 text-sm">
                    <table className="w-full">
                        <thead className="text-slate-500 font-bold">
                            <tr className="border-b text-left dark:border-gray-500">
                                <th className="pl-5 py-5 text-center">NO</th>
                                <th className="min-w-52 text-center">NAMA</th>
                                <th className="text-center">KELAS</th>
                                <th className="px-10 min-w-52 md:px-2 text-center">JUDUL</th>
                                <th className="text-center">PENGEMBALIAN</th>
                                <th className="min-w-30 text-center">STATUS</th>
                                {
                                    (user.role === 1 || user.role === 2) && (
                                        <th className="px-10 min-w-30 text-center">AKSI</th>
                                    )
                                }

                                {
                                    user.role === 3 && (
                                        <th className="px-10 min-w-30 text-center">RATING</th>
                                    )
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                borrowers.length < 1 ?
                                    <tr><td colSpan="7" className="text-center py-6">Tidak ada pinjaman yang ditemukan</td></tr>
                                    : borrowers.map(borrower => {
                                        return (
                                            <tr key={borrower.id} className="border-b text-left hover:bg-slate-50 dark:hover:bg-gray-700 dark:border-gray-500">
                                                <td className="pl-5 py-5 text-center box-border">{borrower.id}</td>
                                                <td>{borrower.name}</td>
                                                <td className="text-center">{borrower.class}</td>
                                                <td>{borrower.title}</td>
												{
													borrower.status ? (
														<td className="text-center">{formatDate(borrower.return_date)}</td>
													) : (
														<td className="text-center">{formatDate(borrower.due_date)}</td>
													)
												}
                                                {
                                                    borrower.status ? (
                                                        <td className="text-center"><span className="bg-green-400 px-3 py-1 font-bold text-white rounded-md">SELESAI</span></td>
                                                    ) : new Date().setHours(0, 0, 0, 0) <= new Date(borrower.due_date).setHours(0, 0, 0, 0) ? (
                                                        <td className="text-center"><span className="bg-yellow-400 px-3 py-1 font-bold text-white rounded-md">PINJAMAN</span></td>
                                                    ) : (
                                                        <td className="text-center"><span className="bg-red-400 px-3 py-1 font-bold text-white rounded-md">LEWAT</span></td>
                                                    )
                                                }

                                                {
                                                    (user.role === 1 || user.role === 2) && !borrower.status && (
                                                        <td className="text-center hover:text-blue-700 hover:underline hover:cursor-pointer" onClick={() => {
                                                            setActive(true)
                                                            setFinishDetail(() => {
                                                                return (
                                                                    <>
                                                                        <p className="font-md mt-3">Apakah anda yakin ingin menyelesaikan peminjaman berikut:</p>
                                                                        <table className="font-sans mt-3">
                                                                            <tr>
                                                                                <td>Nomor</td>
                                                                                <td className="w-10 text-center"> : </td>
                                                                                <td>{borrower.id}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Nama</td>
                                                                                <td className="w-10 text-center"> : </td>
                                                                                <td>{borrower.name}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Kelas</td>
                                                                                <td className="w-10 text-center"> : </td>
                                                                                <td>{borrower.class}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Judul</td>
                                                                                <td className="w-10 text-center"> : </td>
                                                                                <td>{borrower.title}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Tanggal Peminjaman</td>
                                                                                <td className="w-10 text-center"> : </td>
                                                                                <td>{formatDate(borrower.created_at)}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Tanggal Pengembalian</td>
                                                                                <td className="w-10 text-center"> : </td>
                                                                                <td>{formatDate(borrower.due_date)}</td>
                                                                            </tr>
                                                                        </table>
                                                                    </>
                                                                )
                                                            })
                                                            setAction(() => createUpdateBorrower(borrower.id));
                                                        }}>
                                                            Selesaikan
                                                        </td>
                                                    )
												}
                                                {
                                                    user.role === 3 && (
                                                        <td className="flex items-center justify-center py-6">
                                                            {
                                                                function() {
                                                                    let ratingsStar = [];
                                                                    for (let i = 1; i <= 5; i++) {
                                                                        if (i <= borrower.rating) {
                                                                            ratingsStar.push(
                                                                                <svg key={i} aria-hidden="true" className="w-8 h-8 text-yellow-400 hover:cursor-pointer" onClick={() => updateRating(borrower.id, borrower.book_id, i)} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Rating star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                                                            )
                                                                        } else {
                                                                            ratingsStar.push(
                                                                                <svg key={i} aria-hidden="true" className="w-8 h-8 text-gray-200 hover:cursor-pointer" onClick={() => updateRating(borrower.id, borrower.book_id, i)} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Rating star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                                                            )
                                                                        }
                                                                    }
                                                                    return ratingsStar;
                                                                }()
                                                            }
                                                        </td>
                                                    )
                                                }
                                            </tr>
                                        )
                                    })
                            }
                        </tbody>
                    </table>
					<p className="px-5 py-2 mb-4 md:mb-auto">{`Menampilkan ${borrowers.length} pinjaman dari total ${meta.total} pinjaman`}</p>
                </div>

                <div className="pagination__container flex w-full justify-center text-slate-800 pb-5 dark:text-gray-200">
					<Pagination stringUrl={window.location.href} currPage={meta.page} totalPage={meta.total_page} n={3} />
				</div>
            </div>
        </div>
    )
}

import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import httpRequest from "../../config/http-request";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../config";
import { useAuth } from "../../context/auth";
import { notifyError } from "../../utils/toast";
import Pagination from "../../components/Pagination";
import { UserContext } from "../../context/user";
import Modal from "../../components/Modal";
import { BsFillTrashFill } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";

export default function Member() {
    const [members, setMembers] = useState({});
    const [active, setActive] = useState(false);
    const [action, setAction] = useState();
    const [userDetail, setUserDetail] = useState();
    const [isLoading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [meta, setMeta] = useState({});
	const { setAuthToken } = useAuth();
	const { user } = useContext(UserContext);
	const filterRef = useRef();
	const navigate = useNavigate();

    const deleteUser = id => {
        return async () => {
			try{
				await axiosInstance.delete(`${httpRequest.api.baseUrl}/member/${id}`);
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
        async function getMembers() {
			try {
				const url = new URL(window.location.href);
				const res = await axiosInstance.get(`${httpRequest.api.baseUrl}/member?${url.searchParams.toString()}`);
                setMembers(res.data.data)
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
        getMembers()
    }, [searchParams, setAuthToken, active])

    const handleSearch = async e => {
        e.preventDefault()

        let page = searchParams.get("page") ? searchParams.get("page") : 1;
		try {
			const res = await axiosInstance.get(`${httpRequest.api.baseUrl}/member?page=${page}&&search=${e.target.value}`);
            setMembers(res.data.data)
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
        <div className="flex-grow w-full">
            <Modal active={active} setActive={setActive} title="Nonaktif Anggota" children={userDetail} action={action}></Modal>

            <div className="member__container bg-white dark:bg-[#2D3748] dark:text-gray-200 rounded-lg">
                <div className="table_head__container flex justify-between p-5 box-border items-center">
                    <div className="flex h-full w-full justify-between">
						<div className="flex">
							<input id="keyword__input" placeholder="Ketik nama" onInput={handleSearch} className="font-sans focus:outline-none border-l-2 border-y-2 w-full h-5 rounded-l-full p-5 dark:bg-transparent dark:border-gray-500" type="text"></input>
							<div className='bg-white border-y-2 border-r-2 rounded-r-full pr-3 flex items-center text-slate-300 dark:bg-gray-700 dark:border-gray-500'>
								<AiOutlineSearch size="20px" />
							</div>
						</div>
						<div className={`px-5 flex items-center gap-2 rounded-none transition-all`}>
							<FaFilter />
							<select defaultValue={checkFilter()} onChange={handleFilter} ref={filterRef} id="filter" className="h-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
								<option value="">Semua</option>
								<option value="1">Aktif</option>
								<option value="0">Belum Aktif</option>
								<option value="2">Tidak Aktif</option>
							</select>
						</div>
                    </div>
                </div>


                <div className="table__container shadow-sm w-full overflow-x-scroll sm:rounded-md mb-9 text-sm">
                    <table className="w-full">
                        <thead className="text-slate-500 font-bold">
                            <tr className="border-b dark:border-b dark:border-b-gray-500">
                                <th className="min-w-52">NAMA</th>
                                <th className="py-5 min-w-36">KELAS</th>
                                <th className="py-5 min-w-52">STATUS</th>
								{
									user.role === 1 && (
										<th className="min-w-30 p-5 box-border">AKSI</th>
									)
								}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                members && members?.length < 1 ?
                                    <tr><td colSpan="4" className="text-center py-6">Tidak ada anggota yang ditemukan</td></tr>
                                    : members.map(member => {
                                        return (
                                            <tr key={member.id} className="border-b text-left hover:bg-slate-50 dark:hover:bg-gray-700 dark:border-gray-500">
                                                <td className="py-5 pl-5 w-96">{member.name}</td>
                                                <td className="text-center">{member.class}</td>
												{
													member.is_verified && !member.deleted_at && (
														<td className="text-center"><span className="bg-green-400 px-3 py-1 font-bold text-white rounded-md">AKTIF</span></td>
													)
												}

												{
													!member.is_verified && !member.deleted_at && (
														<td className="text-center"><span className="bg-yellow-500 px-3 py-1 font-bold text-white rounded-md">BELUM AKTIF</span></td>
													)
												}

												{
													member.deleted_at && (
														<td className="text-center"><span className="bg-red-400 px-3 py-1 font-bold text-white rounded-md">TIDAK AKTIF</span></td>
													)
												}
                                                <td className="box-border p-5 flex justify-center">
													{
														(user.role === 1 && !member.deleted_at && member.is_verified) && (
															<BsFillTrashFill className="hover:cursor-pointer" onClick={() => {
																setActive(true);
																setUserDetail(() => {
																	return (
																		<>
																			<p className="font-md mt-3">Apakah anda yakin ingin menonaktifkan anggota berikut:</p>

																			<table className="font-sans mt-3">
																				<tr>
																					<td>Nama</td>
																					<td className="w-10 text-center"> : </td>
																					<td>{member.name}</td>
																				</tr>
																				<tr>
																					<td>Kelas</td>
																					<td className="w-10 text-center"> : </td>
																					<td>{member.class}</td>
																				</tr>
																			</table>
																		</>
																	)
																})
																setAction(() => deleteUser(member.id))
															}}></BsFillTrashFill>
														)
													}
												</td>
                                            </tr>
                                        )
                                    })
                            }
                        </tbody>
                    </table>
					<p className="px-5 py-2 mb-4 md:mb-auto">{`Menampilkan ${members.length} anggota dari total ${meta.total} anggota`}</p>
                </div>

                <div className="pagination__container flex w-full justify-center text-slate-800 pb-5 dark:text-gray-200">
					<Pagination stringUrl={window.location.href} currPage={meta.page} totalPage={meta.total_page} n={3} />
				</div>
            </div>
        </div>
    )
}

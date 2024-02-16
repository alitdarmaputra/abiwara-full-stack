import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BsChevronDoubleLeft, BsChevronDoubleRight, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import httpRequest from "../../config/http-request";
import { Link, useSearchParams } from "react-router-dom";
import axiosInstance from "../../config";
import { useAuth } from "../../context/auth";

export default function Member() {
    const [members, setMembers] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [meta, setMeta] = useState({});
	const { setAuthToken } = useAuth();

    useEffect(() => {
        async function getMembers() {
            let page = searchParams.get("page") ? searchParams.get("page") : 1;
            const res = await axiosInstance.get(`${httpRequest.api.baseUrl}/member?page=${page}`);
            if (res.status === 200) {
                setMembers(res.data.data)
                setMeta(res.data.meta)
                setLoading(false)
            } else if (res.status === 401) {
				setAuthToken();
            }
        }
        getMembers()
    }, [searchParams, setAuthToken])

    const handleSearch = async e => {
        e.preventDefault()

        let page = searchParams.get("page") ? searchParams.get("page") : 1;

        const res = await axiosInstance.get(`${httpRequest.api.baseUrl}/member?page=${page}&&search=${e.target.value}`);

        if (res.status === 200) {
            setMembers(res.data.data)
            setMeta(res.data.meta)
        } else if (res.status === 401) {
			setAuthToken();
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
            <div className="member__container bg-white dark:bg-[#2D3748] dark:text-gray-200 rounded-lg">
                <div className="table_head__container flex justify-between p-5 box-border items-center">
                    <div className="flex w-72 h-full">
                        <input id="keyword__input" placeholder="Ketik nama" onInput={handleSearch} className="font-sans focus:outline-none border-l-2 border-y-2 w-full h-5 rounded-l-full p-5 dark:bg-transparent dark:border-gray-500" type="text"></input>
                        <div className='bg-white border-y-2 border-r-2 rounded-r-full pr-3 flex items-center text-slate-300 dark:bg-gray-700 dark:border-gray-500'>
                            <AiOutlineSearch size="20px" />
                        </div>
                    </div>
                </div>

                <div className="table__container shadow-sm w-full overflow-x-scroll sm:rounded-md mb-9 text-sm">
                    <table className="w-full">
                        <thead className="text-slate-500 font-bold">
                            <tr className="border-b dark:border-b dark:border-b-gray-500">
                                <th>NAMA</th>
                                <th className="py-5">KELAS</th>
                                <th className="py-5">STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                members && members?.length < 1 ?
                                    <tr><td colSpan="5" className="text-center py-6">Tidak ada anggota yang ditemukan</td></tr>
                                    : members.map(member => {
                                        return (
                                            <tr className="border-b text-left hover:bg-slate-50 dark:hover:bg-gray-700 dark:border-gray-500">
                                                <td className="py-5 pl-5 w-96">{member.name}</td>
                                                <td className="text-center">{member.class}</td>
                                                <td className="text-center"><span className="bg-green-400 px-3 py-1 font-bold text-white rounded-md">AKTIF</span></td>
                                            </tr>
                                        )
                                    })
                            }
                        </tbody>
                    </table>
                </div>

                <div className="pagination__container flex w-full justify-center text-slate-800 pb-5 mb-10">
                    <div className="pagination flex w-60 justify-evenly items-center">
                        <Link to={`/member?page=1`}><BsChevronDoubleLeft /></Link>

                        {
                            meta.page !== 1 && (
                                <Link to={`/member?page=${meta.page - 1}`}><BsChevronLeft /></Link>
                            )
                        }

                        {
                            !isLoading && (
                                function() {
                                    const pageNums = []
                                    for (let i = 1; i <= meta.total_page; i++) {
                                        if (i === meta.page) {
                                            pageNums.push(<Link key={i} className="page h-8 w-8 rounded-md shadow-md text-white bg-blue-700 flex items-center justify-center" to={`/member?page=${i}`}>{i}</Link>)
                                        } else {
                                            pageNums.push(<Link key={i} className="page" to={`/member?page=${i}`}>{i}</Link>)
                                        }
                                    }
                                    return <>{pageNums}</>
                                }()
                            )
                        }

                        {
                            meta.page !== meta.total_page && (
                                <Link to={`/member?page=${meta.page + 1}`}><BsChevronRight /></Link>
                            )
                        }

                        <Link to={`/member?page=${meta.total_page}`}><BsChevronDoubleRight /></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

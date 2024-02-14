import { useContext, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Link, Navigate, useNavigate } from "react-router-dom"
import httpRequest from "../../config/http-request";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { getMonday, getSaturday } from "../../utils/date";
import moment from "moment-timezone";
import { BiShoppingBag } from "react-icons/bi";
import { BsPerson } from "react-icons/bs";
import ParrotCaptain from '../../assets/parrot-captain.svg';
import axiosInstance from "../../config";
import { UserContext } from "../../context/user";

export default function Dashboard() {
    const [isLoading, setLoading] = useState(true);
    const [visitorData, setVisitorData] = useState({});
	const { user } = useContext(UserContext);
    const [totalMember, setTotalMember] = useState();
    const [totalBorrower, setTotalBorrower] = useState();
    const [books, setBooks] = useState();
	const navigate = useNavigate();

    const labels = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );

    useEffect(() => {
        const getData = async () => {
            try {
                if (user.role === 1 || user.role === 3) {
                    let today = moment();
                    let saturday = getSaturday(today).format("YYYY-MM-DD");
                    let monday = getMonday(today).format("YYYY-MM-DD");

                    const visitorRes = await axiosInstance.get(`${httpRequest.api.baseUrl}/total-visitor?start_date=${monday}&&end_date=${saturday}`);
                    var visitors = visitorRes?.data?.data;

                    const data = {
                        labels,
                        datasets: [
                            {
                                label: 'Jumlah Kunjungan',
                                data: labels.map(label => {
                                    for (let i = 0; i < visitors.length; i++) {
                                        const dateMoment = moment.tz(visitors[i].visit_date, "Asia/Makassar");
                                        if (dateMoment.format("dddd") === label) {
                                            return visitors[i].total;
                                        }
                                    }
                                    return 0;
                                }),
                                backgroundColor: 'rgba(29, 78, 216, 0.5)',
                            }
                        ]
                    }
                    setVisitorData(data);

                    const memberRes = await axiosInstance.get(`${httpRequest.api.baseUrl}/total-member`);
                    var totalMember = memberRes?.data?.data?.total;
                    setTotalMember(totalMember);

                    const borrowerRes = await axiosInstance.get(`${httpRequest.api.baseUrl}/total-borrower`);
                    var totalBorrower = borrowerRes?.data?.data?.total;
                    setTotalBorrower(totalBorrower)
                }

                const bookRes = await axiosInstance.get(`${httpRequest.api.baseUrl}/rating`);
                setBooks(bookRes.data?.data)
                setLoading(false);
            } catch (err) {
            }
        }
		
		getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    }

    if (isLoading) {
        return (
            <div className="w-full h-screen flex justify-center items-center md:ml-72">
                <svg aria-hidden="true" role="status" className="inline w-8 h-8 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                </svg>
            </div>
        )
    }


    return (
        <div className="flex-grow w-full px-3 md:px-6 pt-10 md:mt-0 md:ml-64 pb-5">
            <div className="dashboard__container flex mb-10 flex-col md:flex-row">
                {
                    user.role === 1 || user.role === 3 ? (
                        <>
                            <div className="chart__container md:w-2/3 bg-white p-5 rounded-lg shadow-lg font-montserrat mb-5 md:mb-0 w-full">
                                <h1 className="font-bold w-full text-center mb-10 text-xl">Daftar Kunjungan</h1>
                                <Bar options={options} data={visitorData}></Bar>
                            </div>
                            <div className="right__container grow md:ml-5">

                                <div className="total_borrower__container p-5 shadow-lg rounded-lg w-full bg-blue-700 text-white mb-5 hover:scale-110 transition-all ease-out">
                                    <h1 className="font-bold w-full mb-8 text-md text-xl">Total Peminjaman</h1>
                                    <div className="total_borrower flex">
                                        <span className="bg-blue-50 p-2 text-blue-500 rounded-lg shadow-lg flex items-center justify-center">
                                            <BiShoppingBag className="text-7xl"></BiShoppingBag>
                                        </span>
                                        <span className="ml-5">
                                            <h1 className="text-6xl font-bold">{totalBorrower}</h1>
                                            <p className="text-center text-xl w-full flex items-center">Peminjaman</p>
                                        </span>
                                    </div>
                                </div>

                                <div className="total_visitor__container p-5 shadow-lg rounded-lg w-full bg-slate-200 hover:scale-110 transition-all ease-out">
                                    <h1 className="font-bold w-full mb-8 text-md text-xl">Total Anggota</h1>

                                    <div className="total_visitor flex">
                                        <span className="bg-white p-2 text-blue-500 rounded-lg shadow-lg flex items-center justify-center">
                                            <BsPerson className="text-7xl"></BsPerson>
                                        </span>
                                        <span className="ml-5">
                                            <h1 className="text-6xl font-bold">{totalMember}</h1>
                                            <p className="text-center text-xl w-full flex items-center">Anggota</p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <img className="md:mb-0 mb-5 w-80" src={ParrotCaptain} alt="Parrot Captain"></img>
                            <div className="text__container w-full md:w-7/12 grow p-8 rounded-lg h-fit">
                                <h3 className="text-5xl font-bold mb-5">Hai <span className="text-blue-700">Crew</span>!</h3>
                                <p className="text-xl text-gray-800">Siap memulai petualangan tak terlupakan dalam dunia buku yang penuh keajaiban? Ayayy, kita jelajahi lautan halaman bersama-sama!</p>
                                <div className="py-3 px-5 bg-blue-700 rounded-lg shadow-lg text-white mt-5 w-fit font-bold hover:cursor-pointer active:bg-blue-900" onClick={() => navigate("/book")}>Jelajahi Buku</div>
                            </div>
                        </>)
                }
            </div>
            <div className="recommendation-container">
                <h1 className="text-2xl font-bold mb-5">Buku Terbaik</h1>
                {
                    books.length < 1 ?
                        <p>Tidak ada data buku</p> :
                        books.map((book, i) => {

                            if (i % 2 === 0) {
                                return (
                                    <Link key={i} to={`/book/${book.id}`} className="w-full font-bold py-3 bg-blue-800 text-white rounded-lg mb-4 px-3 flex justify-between shadow-md hover:cursor-pointer hover:bg-blue-700 items-center">
                                        <div className="left-container flex gap-5 items-center h-full">
                                            <h3 className="w-10 h-10 bg-white shadow-lg rounded-lg text-blue-900 flex justify-center items-center text-xl">{i + 1}</h3>
                                            <div>
                                                <p>{book.book_title}</p>
                                                <p className="text-sm mt-1 font-normal">{book.book_authors}</p>
                                            </div>
                                        </div>
                                        <div className="star-container flex h-full items-center">
                                            <svg aria-hidden="true" className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Rating star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                            <p className="ml-2 text-sm font-bold text-white">{book.rating}</p>
                                            <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
                                            <div className="text-sm font-medium underline text-white">{book.total} reviews</div>
                                        </div>
                                    </Link>
                                )
                            } else {

                                return (
                                    <Link key={i} to={`/book/${book.id}`} className="w-full font-bold py-3 bg-slate-50 rounded-lg mb-4 px-3 flex justify-between shadow-md hover:cursor-pointer hover:bg-slate-300 items-center">
                                        <div className="left-container flex gap-5 items-center h-full">
                                            <h3 className="w-10 h-10 bg-white shadow-lg rounded-lg text-blue-900 flex justify-center items-center text-xl">{i + 1}</h3>
                                            <div>
                                                <p>{book.book_title}</p>
                                                <p className="text-sm mt-1 font-normal">{book.book_authors}</p>
                                            </div>
                                        </div>
                                        <div className="star-container flex h-full items-center">
                                            <svg aria-hidden="true" className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Rating star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                            <p className="ml-2 text-sm font-bold">{book.rating}</p>
                                            <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
                                            <div className="text-sm font-medium underline">{book.total} reviews</div>
                                        </div>
                                    </Link>
                                )
                            }
                        })
                }
            </div>
        </div>
    )
}

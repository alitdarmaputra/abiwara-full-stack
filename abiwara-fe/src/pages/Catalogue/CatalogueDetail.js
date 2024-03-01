import SearchBox from "../../components/SearchBox";
import { FaBookmark, FaRegBookmark  } from "react-icons/fa";
import { stringToColor } from "../../utils/color";
import { ScrollRestoration, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import axiosInstance from "../../config";
import httpRequest from "../../config/http-request";
import { formatDate } from "../../utils/formatter";
import BookList from "../../components/BookList";
import { useAuth } from "../../context/auth";
import { notifySuccess } from "../../utils/toast";
import { ToastContainer } from "react-toastify";
import Stars from "../../components/Star";

export default function CatalogueDetail() {
	const [isLoading, setLoading] = useState(true);
	const [bookDetail, setBookDetail] = useState({});
	const [recommendations, setRecommendations] = useState([]);
	const { id } = useParams();
	const { authToken } = useAuth();
	const [markId, setMarkId] = useState();

	const handleBookmark = async () => {
		try {
			// Delete bookmark if marked
			if (markId) {
				await axiosInstance.delete(`${httpRequest.api.baseUrl}/bookmark/${markId}`);
				setMarkId();
			} else {
				const payload = {
					book_id: parseInt(id)
				}
				const res = await axiosInstance.post(`${httpRequest.api.baseUrl}/bookmark`, payload);
				setMarkId(res.data.data.id);
				notifySuccess("Buku telah ditambahkan ke bookmark")
			}
		} catch(err) {
			console.log(err);
		}
	}

	useEffect(() => {
		async function getBookDetail() {
			try {
				const res = await axiosInstance.get(`${httpRequest.api.baseUrl}/book/${id}`);
                setBookDetail(res.data.data);

				const recommendationRes = await axiosInstance.get(`${httpRequest.api.baseUrl}/book-recommendation/${id}`);
				setRecommendations(recommendationRes.data.data);
				
				if (authToken) {
					axiosInstance.get(`${httpRequest.api.baseUrl}/bookmark/${id}`).then((res) => setMarkId(res.data.data.id)).catch(() => setMarkId());
				}
				setLoading(false);
			} catch(err) {
				console.log(err);
			}
		}

		getBookDetail();
	}, [id, markId])

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
        <div id="catalogue-detail">
			<ToastContainer />
			<Helmet>
				<title>{bookDetail.title}</title>
			</Helmet>
            <SearchBox />

            <section id="book" className="flex justify-center bg-white py-16 md:pt-20 px-4 md:px-0 dark:bg-[#161B26]">
                <div id="book__wrapper" className="w-full max-w-6xl flex flex-col md:flex-row md:items-start gap-4 justify-between">
                    <div id="book-card" className="w-full mb-6 md:pr-4 flex flex-col md:flex-row rounded-md border-2 border-[#F4F7FA] dark:border-[#2D3748]">
                        <div id="book-card__img" className="flex justify-center items-center bg-[#F4F7FA] p-10 rounded-t-md md:rounded-l-md dark:bg-[#2D3748]">
                            <div className="w-[194px] h-[286px] shadow-lg relative">
                                <img className="object-cover w-full h-full" alt="book cover" src={bookDetail.img.image_url} />
                            </div>
                        </div>

                        <div id="book-card__meta" className="flex flex-grow px-10 py-10  items-center dark:text-gray-200">
                            <div className="max-w-xl">
                                <p className="rounded-md px-4 py-2 inline-block mb-6" style={{ backgroundColor: `${stringToColor(bookDetail.category.name)}` }}>
                                    {bookDetail.category.name}
                                </p>
                                <h3 className="mb-2 text-4xl roboto-bold">{bookDetail.title}</h3>
                                <p className="mb-4 text-sm opacity-70">{`Oleh ${bookDetail.author || "-"}`}</p>

                                <div id="book-card__rating" className="flex items-center">
                                    <div className="flex gap-0.5 text-yellow-500 mr-2">
                                        <Stars rating={bookDetail.rating} />
                                    </div>
                                    <p>{bookDetail.rating}</p>
                                </div>

                                <p className="mb-10">
									{bookDetail.summary}
                                </p>

                                <h3 className="font-bold roboto-bold mb-2">Informasi Detail</h3>
                                <table className="opacity-70 mb-4">
									<tbody>
										<tr>
											<td>No Inventaris</td>
											<td className="w-10 text-center"> : </td>
											<td>{bookDetail.inventory_number}</td>
										</tr>
										<tr>
											<td>Call Number Klasifikasi</td>
											<td className="w-10 text-center"> : </td>
											<td>{bookDetail.category.id}</td>
										</tr>
										<tr>
											<td>Tanggal Masuk</td>
											<td className="w-10 text-center"> : </td>
											<td>{bookDetail.entry_date && formatDate(bookDetail.entry_date)}</td>
										</tr>
										<tr>
											<td>Penyusun</td>
											<td className="w-10 text-center"> : </td>
											<td>{bookDetail.author}</td>
										</tr>
										<tr>
											<td>Penerbit</td>
											<td className="w-10 text-center"> : </td>
											<td>{bookDetail.publisher}</td>
										</tr>
										<tr>
											<td>Kota Terbit</td>
											<td className="w-10 text-center"> : </td>
											<td>{bookDetail.city}</td>
										</tr>
										<tr>
											<td>Tahun Terbit</td>
											<td className="w-10 text-center"> : </td>
											<td>{bookDetail.year}</td>
										</tr>
										<tr>
											<td>Sisa</td>
											<td className="w-10 text-center"> : </td>
											<td>{bookDetail.remain}</td>
										</tr>
										<tr>
											<td>Status</td>
											<td className="w-10 text-center"> : </td>
											<td>{bookDetail.status}</td>
										</tr>
									</tbody>
                                </table>

                                <div className="px-5 py-1 mb-5 text-center rounded-md inline-block bg-green-200 dark:bg-green-900">
                                    Tersedia
                                </div>

                            </div>
                        </div>
						
						{ 
							authToken && (
								<div id="book-card__action" className="flex items-end dark:text-gray-200">
									<button onClick={handleBookmark} className="p-2 rounded-lg dark:hover:text-black hover:bg-gray-100 transition-all">
										{
											markId ? (
												<FaBookmark />
											) : (
												<FaRegBookmark />
											)
										}
									</button>
								</div>
							)
						}
                    </div >
                </div>
            </section >
			<ScrollRestoration />
			<section id="book-recommendation" className="flex items-center flex-col bg-white pb-10 px-4 md:px-0 dark:bg-[#1A202C] transition-all">
				{
					(recommendations.length > 0) && (
						<div className="max-w-6xl mb-10 w-full">
							{/* Recommended Books */}
							<h2 className="mb-2 text-xl roboto-bold dark:text-gray-200">Rekomendasi untuk anda</h2>
							<div className="mb-10 flex flex-col md:flex-row justify-between">
								<p className="text-sm text-gray-400">Berdasarkan pengguna lainnya, berikut merupakan buku yang serupa</p>
							</div>
							<BookList books={recommendations} />
						</div>
					)
				}
			</section>
        </div>
    )
}

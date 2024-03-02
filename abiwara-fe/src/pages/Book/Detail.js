import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import httpRequest from "../../config/http-request";
import { BsFillPencilFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { UserContext } from "../../context/user";
import axiosInstance from "../../config";
import { Helmet } from "react-helmet-async";
import { formatDate } from "../../utils/formatter";
import { notifyError } from "../../utils/toast";

export default function BookDetail() {
    const [isLoading, setLoading] = useState(false);
    const [bookDetail, setBookDetail] = useState({});
    const { id } = useParams();
	const { user } = useContext(UserContext);
    const { setAuthToken } = useAuth();
	const [coverImg, setCoverImg] = useState({});

    useEffect(() => {
        async function getBookDetail() {
			try {
				const res = await axiosInstance.get(`${httpRequest.api.baseUrl}/book/${id}`);
                setBookDetail(res.data.data);
				setCoverImg(res.data.data?.img);
                setLoading(false);
			} catch(err) {
				if (err.response.data.code === 401 ) {
					notifyError("Sesi telah berakhir");
					setAuthToken();
				} else {
					notifyError("Server error");
					console.log(err);
				}
			}
        }

        getBookDetail()
    }, [id, setAuthToken])

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
			<Helmet>
				<title>{bookDetail.title}</title>
			</Helmet>
            <div className="book__container bg-white rounded-lg p-5 mb-10 dark:bg-[#2D3748] dark:text-gray-200">
                <div className="detail_head__container flex justify-between p-5 box-border items-center">
                    <p className="text-slate-500 mt-2 font-semibold">{bookDetail.category && bookDetail.category.name}</p>

                    {user.role === 1 && (
                        <div className="flex justify-end">
                            <Link to={`/book/${id}/edit`} className="p-2 shadow-lg rounded-lg bg-blue-700 text-white">
                                <BsFillPencilFill size="20px" />
                            </Link>
                        </div>
                    )}
                </div>

                <div className="title__container px-5 mb-5">
                    <h1 className="font-bold text-3xl">{bookDetail.title}</h1>
                </div>

                <div className="book_detail__container px-5 h-full">
					<div id="uploaded-image">
						<div className="w-[154px] h-[246px]">
							<img className="object-cover w-full h-full" alt="book cover" src={coverImg.image_url} />
						</div>
					</div>
                    <table className="mt-10">
						<tbody>
							<tr>
								<td>No Inventaris</td>
								<td className="w-10 text-center"> : </td>
								<td>{bookDetail.inventory_number}</td>
							</tr>
							<tr>
								<td>Tanggal Masuk</td>
								<td className="w-10 text-center"> : </td>
								<td>{bookDetail.entry_date && formatDate(bookDetail.entry_date)}</td>
							</tr>
							<tr>
								<td>Penulis</td>
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
								<td>Klasifikasi</td>
								<td className="w-10 text-center"> : </td>
								<td>{bookDetail.category?.id}</td>
							</tr>
							<tr>
								<td>Nomor Panggil Penulis</td>
								<td className="w-10 text-center"> : </td>
								<td>{bookDetail.call_number_author}</td>
							</tr>
							<tr>
								<td>Nomor Panggil Judul Buku</td>
								<td className="w-10 text-center"> : </td>
								<td>{bookDetail.call_number_title}</td>
							</tr>
							<tr>
								<td>Asal</td>
								<td className="w-10 text-center"> : </td>
								<td>{bookDetail.source}</td>
							</tr>
							<tr>
								<td>Status</td>
								<td className="w-10 text-center"> : </td>
								<td>{bookDetail.status}</td>
							</tr>
							<tr>
								<td>Ringkasan</td>
								<td className="w-10 text-center"> : </td>
							</tr>
						</tbody>
                    </table>

                    <p className="mt-3">{bookDetail.summary}</p>
                </div>
            </div>
        </div>
    )
}

import { useEffect, useState } from "react";
import { ScrollRestoration } from "react-router-dom";
import BookmarkCardList from "../../components/BookmarkCardList";
import Pagination from "../../components/Pagination";
import axiosInstance from "../../config";
import httpRequest from "../../config/http-request";
import { useAuth } from "../../context/auth";
import { notifyError } from "../../utils/toast";

export default function Bookmark() {
	const [isLoading, setLoading] = useState(true);
	const [bookmarks, setBookmarks] = useState([]);
	const [meta, setMeta] = useState();
    const { setAuthToken } = useAuth();

	useEffect(() => {
		const getUserData = async() => {
			try {
				const res = await axiosInstance.get(`${httpRequest.api.baseUrl}/bookmark`);
				setBookmarks(res.data.data);
				setMeta(res.data.meta);
				setLoading(false);
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
		getUserData();
	}, [])

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
		<div id="bookmark">
			<div className="w-screen h-40 bg-[#110978]"></div>
            <section id="bookmark-list" className="flex justify-center bg-white py-16 md:py-20 px-4 md:px-0 dark:bg-[#1A202C] transition-all">
                <div id="bookmark-list__wrapper" className="w-full max-w-6xl flex flex-col md:items-start gap-4 mb-10 justify-between">
					<h1 className="text-3xl font-bold roboto-bold mb-4 dark:text-gray-200">Bookmark</h1>
                    <div id="bookmark-list__content" className="w-full">
						{
							bookmarks.length > 0 ? (
								<>
									<Pagination className="mb-10" stringUrl={window.location.href} currPage={meta.page} totalPage={meta.total_page} n={3} />
										<div id="content__bookmarks">
											<BookmarkCardList bookmarks={bookmarks} />
										</div>
									<Pagination stringUrl={window.location.href} currPage={meta.page} totalPage={meta.total_page} n={3} />
								</>
							) : (
								<h2 className="dark:text-gray-500">Tidak ada bookmark yang ditemukan</h2>
							)
						}
                    </div>
                </div>
            </section >
			<ScrollRestoration />
		</div>
	)

}

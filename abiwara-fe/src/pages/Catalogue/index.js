import { useEffect, useRef, useState } from "react";
import { FaAngleDown, FaFilter, FaStar } from "react-icons/fa";
import { ScrollRestoration, useNavigate, useSearchParams } from "react-router-dom";
import BookCardList from "../../components/BookCardList";
import Pagination from "../../components/Pagination";
import SearchBox from "../../components/SearchBox";
import axiosInstance from "../../config";
import httpRequest from "../../config/http-request";

export default function Catalogue() {
    const [openFilter, setOpenFilter] = useState(false);
    const [searchParams] = useSearchParams();
    const [meta, setMeta] = useState({});
	const [books, setBooks] = useState([]);
	const [isLoading, setLoading] = useState(true);
	const navigate = useNavigate();
	const sortRef = useRef();
	const ratingRef = useRef();
	const existRef = useRef();

    const categories = [{
        label: "Karya Umum",
        value: 0,
    }, {
        label: "Filsafat dan psikologi",
        value: 1,
    }, {
        label: "Agama",
        value: 2,
    }, {
        label: "Ilmu-ilmu sosial",
        value: 3,
    }, {
        label: "Bahasa",
        value: 4,
    }, {
        label: "Ilmu-ilmu murni",
        value: 5,
    }, {
        label: "Ilmu-ilmu terapan",
        value: 6,
    }, {
        label: "Kesenian, hiburan, olahraga",
        value: 7,
    }, {
        label: "Kesusasteraan",
        value: 8,
    }, {
        label: "Geografi dan sejarah umum",
        value: 9,
    }];
	
	const handleSort = () => {
		let sort = sortRef.current.value;
		const url = new URL(window.location.href)
		url.searchParams.delete("page");
		
		if (sort !== "title")
			url.searchParams.set("sort", sort);	
		else
			url.searchParams.delete("sort");

		navigate(`${url.pathname}?${url.searchParams.toString()}`);
	}
	
	const handleExist = () => {
		const url = new URL(window.location.href)
		url.searchParams.delete("page");
		if (existRef.current.checked) {
			url.searchParams.set("exist", "true");
		} else {
			url.searchParams.delete("exist");
		}
		navigate(`${url.pathname}?${url.searchParams.toString()}`);
	}
	
	const checkFilter = (target) => {
		const url = new URL(window.location.href);
		const categories = url.searchParams.get("categories")
		if (!categories) {
			return false;
		}

		let decoded = decodeURIComponent(categories);
		
		let arr = JSON.parse(decoded);
		
		return arr.includes(target);
	}
	
	const checkSort = () => {
		const url = new URL(window.location.href);
		const sort = url.searchParams.get("sort");
		return sort;
	}

	const handleRating = () => {
		const url = new URL(window.location.href)
		url.searchParams.delete("page");
		if (ratingRef.current.checked) {
			url.searchParams.set("best", "true");
		} else {
			url.searchParams.delete("best");
		}
		navigate(`${url.pathname}?${url.searchParams.toString()}`);
	}
	
	const handleCategories = () => {
		let form = document.getElementById('book-list__filter');
		let checkboxes = form.querySelectorAll('#category');
		let checkedValues = [];

		checkboxes.forEach(function(checkbox) {
			if (checkbox.checked) {
				checkedValues.push(parseInt(checkbox.value));
			}
		});
		
		let checkboxUri = encodeURIComponent(JSON.stringify(checkedValues))

		const url = new URL(window.location.href)
		url.searchParams.delete("page");

		if (checkedValues.length > 0)
			url.searchParams.set("categories", checkboxUri);
		else
			url.searchParams.delete("categories");

		navigate(`${url.pathname}?${url.searchParams.toString()}`);
	}

	useEffect(() => {
		async function getBook() {
			try {
				const url = new URL(window.location.href);

				const res = await axiosInstance.get(`${httpRequest.api.baseUrl}/book?${url.searchParams.toString()}`);
                setBooks(res.data.data);
                setMeta(res.data.meta);
				setLoading(false);
			} catch(err) {
				console.log(err);
			}
		}

		getBook();
	}, [searchParams])

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
        <div id="catalogue">
            <SearchBox />
            <section id="book-list" className="flex justify-center bg-white py-16 md:py-20 px-4 md:px-0 dark:bg-[#1A202C] transition-all">
                <div id="book-list__wrapper" className="w-full max-w-6xl flex flex-col md:flex-row md:items-start gap-4 mb-10 justify-between">
                    <div className="md:hidden">
                        <button className="flex gap-2 mb-2 px-2 py-1 items-center w-auto bg-gray-100 rounded-md dark:bg-[#2D3748] dark:text-gray-200" onClick={() => setOpenFilter(!openFilter)}>
                            <FaFilter />
                            Filter
                        </button>
                        <hr />
                    </div>

                    <form id="book-list__filter" onChange={handleCategories} className={`w-full md:w-full md:max-w-72 p-5 rounded-md border border-[#D8D8D8] bg-white ${!openFilter && "hidden"} md:block dark:bg-[#2D3748] dark:border-none dark:text-gray-400`}>
                        <h3 className="text-xl font-bold roboto-bold dark:text-gray-200">Filter</h3>

                        <p className="mt-4 mb-2">Kategori</p>
                        {categories.map((category, index) => {
                            return (
                                <div key={index} className="mb-2 flex items-center">
                                    <input defaultChecked={checkFilter(category.value)} type="checkbox" value={category.value} id={`category`} className="h-[20px] w-[20px] accent-black hover:cursor-pointer"/>
                                    <label htmlFor={`category${index}`} className="ml-2">{category.label}</label>
                                </div>
                            )
                        })}

                        <p className="mt-4 mb-2">Rating</p>
                        <div className="mb-2 flex items-center">
                            <input onChange={handleRating} ref={ratingRef} type="checkbox" id="rating" name="rating" className="h-[21px] w-[21px] accent-black caret-black" />
                            <label htmlFor="rating" className="ml-2 flex items-center gap-1"><FaStar className="text-yellow-500" /> 4 ke atas</label>
                        </div>

                        <p className="mt-4 mb-2">Ketersediaan</p>
                        <div className="mb-2 flex items-center">
                            <input onChange={e => handleExist(e)} ref={existRef} type="checkbox" id="exist" name="exist" className="h-[21px] w-[21px] accent-black caret-black" />
                            <label htmlFor="exist" className="ml-2 flex items-center gap-1">ada</label>
                        </div>
                    </form>

                    <div id="book-list__content" className="w-full">
                        <div id="content__meta" className="flex-col md:flex-row flex mb-4 justify-between items-start md:items-center dark:text-gray-200">
                            <p className="mb-4 md:mb-auto">{`Menampilkan ${books.length} buku dari total ${meta.total} buku`}</p>
                            <form className="flex md:ml-2 items-center">
                                <label htmlFor="sort" className="font-bold roboto-bold mr-2">Urutkan :</label>
                                <div className="flex border p-2 items-center">
                                    <select defaultValue={checkSort()} onChange={handleSort} ref={sortRef} name="sort" id="sort" className="ml-2 appearance-none bg-transparent rounded-md bg-none hover:cursor-pointer">
                                        <option value="title">Paling Sesuai</option>
                                        <option value="updated_at">Terbaru</option>
                                        <option value="rating">Rating Tertinggi</option>
                                    </select>
                                    <FaAngleDown />
                                </div>
                            </form>
                        </div>
							{
								books.length > 0 ? (
									<>
										<Pagination className="mb-10" stringUrl={window.location.href} currPage={meta.page} totalPage={meta.total_page} n={3} />
											<div id="content__books">
												<BookCardList books={books} />
											</div>
										<Pagination stringUrl={window.location.href} currPage={meta.page} totalPage={meta.total_page} n={3} />
									</>
								) : (
									<h2 className="dark:text-gray-500 text-xl">Tidak ada buku yang ditemukan</h2>
								)
							}
                    </div>
                </div>
            </section >
			<ScrollRestoration />
        </div >
    )
}

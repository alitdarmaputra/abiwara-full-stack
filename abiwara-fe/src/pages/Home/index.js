import { AiOutlineAppstore, AiOutlineCamera, AiOutlineClose, AiOutlineRead, AiOutlineSearch, AiOutlineSetting, AiOutlineZhihu } from "react-icons/ai";
import { RiFilePaper2Line } from "react-icons/ri";
import { MdOutlineScience, MdOutlineTempleHindu, MdPeopleOutline } from "react-icons/md";
import { PiBrain } from "react-icons/pi";
import { IoIosArrowDropdown } from "react-icons/io";
import BookList, { BookListScroll } from "../../components/BookList";
import Carousel from "../../components/Carousel";
import { useEffect, useRef, useState } from "react";
import { IoEarthOutline } from "react-icons/io5";
import axiosInstance from "../../config";
import httpRequest from "../../config/http-request";
import { Link, ScrollRestoration, useNavigate, useSearchParams } from "react-router-dom";

export default function Home() {
    const [openCategories, setOpenCategories] = useState(false);
	const [latestBooks, setLatestBooks] = useState([]);
	const [topBooks, setTopBooks] = useState([]);
    const [isLoading, setLoading] = useState(true);
	const books = [];
	const searchRef = useRef();
	const navigate = useNavigate();	

	const generateCategoryLink = categories => {
		let checkboxUri = encodeURIComponent(JSON.stringify(categories))
		return `/catalogue?categories=${checkboxUri}`
	}

	const handleSearch = (e) => {
		e.preventDefault();
		let searchValue = searchRef.current.value;
		if (searchValue != "")
			navigate(`/catalogue?search=${searchValue}`);
	}

	useEffect(() => {
		async function getBooks() {
			try {
				const latestBookRes = await axiosInstance.get(`${httpRequest.api.baseUrl}/book?sort=updated_at&&order=desc`)
				setLatestBooks(latestBookRes.data.data);

				const topBookRes = await axiosInstance.get(`${httpRequest.api.baseUrl}/book?sort=rating&&order=desc`)
				setTopBooks(topBookRes.data.data);
				setLoading(false);
			} catch(err) {
				console.log(err);
			}
		}

		getBooks();
	}, []);

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
            <div id="home">
                <section id="hero" className="flex flex-col items-center text-center mb-20 h-screen">
                    <h2 className="mt-44 roboto-bold text-base tracking-widest text-[#68D585]">Sistem Perpustakaan Online</h2>
                    <h1 className="mt-14 roboto-bold text-3xl lg:text-5xl text-white">
                        Jelajahi berbagai ilmu baru
                        <br />
                        menemukan dunia tak terbatas
                    </h1>

                    <form onSubmit={handleSearch} className="mx-2 flex items-center pl-4 pr-2 md:px-4 py-2 md:py-3 mt-24 bg-white rounded-full md:rounded-md dark:bg-[#2D3748] transition-all">
                        <AiOutlineSearch className="hidden lg:inline w-10 h-10 text-gray-400" />
                        <input required ref={searchRef} type="search" className="flex-grow w-[20rem] md:w-[33rem] text-sm md:text-xl px-4 focus:outline-none bg-transparent dark:text-gray-200" placeHolder="Ketik judul, nama pengarang, atau penerbit" />
                        <button className="p-2 md:px-10 md:py-2.5 rounded-full md:rounded-sm font-semibold text-white bg-[#473BF0] hover:bg-[#392ed3] poppins-semibold transition-all">
                            <AiOutlineSearch className="md:hidden w-6 h-6 text-white" />
                            <span className="hidden md:inline">Cari buku</span>
                        </button>
                    </form>

                    <button className="w-full mt-16 flex justify-center animate-bounce" onClick={() => {
                        const content = document.getElementById("content");
                        content.scrollIntoView({ behavior: "smooth" });
                    }}>
                        <IoIosArrowDropdown className="text-white h-10 w-10" />
                    </button>

                    <div id="hero__carousel" className="fixed left-0 top-0 right-0 h-screen -z-10 overflow-hidden">
                        <Carousel />
                    </div>
                </section>

                <section id="content" className="flex items-center flex-col bg-white py-20 px-4 md:px-0 dark:bg-[#1A202C] transition-all">
                    <div id="content__wrapper" className="max-w-6xl mb-10 w-full">
                        {/* Recommended Books */}
                        <h2 className="mb-2 text-xl roboto-bold dark:text-gray-200">Rekomendasi untuk anda</h2>
                        <div className="mb-10 flex flex-col md:flex-row justify-between">
                            <p className="text-sm text-gray-400">Berdasarkan buku yang anda lihat terakhir, pengguna lain juga menyukai</p>
                            <a className="md:px-5 py-2 mt-2 md:mt-0 rounded-md font-semibold md:text-white text-left text-sm md:bg-[#473BF0] text-[#473BF0] md:hover:bg-[#392ed3] poppins-semibold transition-all">Lihat Semua</a>
                        </div>
                        <BookList books={books} />

                        {/* Latest Books */}
                        <h2 className="mt-20 mb-2 text-xl roboto-bold dark:text-gray-200">Koleksi baru dan diperbarui</h2>
                        <div className="mb-10 flex flex-col md:flex-row justify-between">
                            <p className="text-sm text-gray-400">Merupakan daftar koleksi-koleksi terbaru kami. Tidak semuanya baru, adapula koleksi yang data-datanya sudah diperbaiki. Selamat menikmati</p>
                            <a className="md:px-5 py-2 mt-2 md:mt-0 rounded-md font-semibold md:text-white text-left text-sm md:bg-[#473BF0] text-[#473BF0] md:hover:bg-[#392ed3] poppins-semibold transition-all">Lihat Semua</a>
                        </div>
                        <BookListScroll books={latestBooks} />

                        {/* Popular Books */}
                        <h2 className="mt-20 mb-2 text-xl roboto-bold dark:text-gray-200">Yang populer di antara koleksi kami</h2>
                        <div className="mb-10 flex flex-col md:flex-row justify-between">
                            <p className="text-sm text-gray-400">Koleksi-koleksi kami yang dibaca oleh banyak pengunjung perpustakaan. Kami harap Anda menyukainya</p>
                            <a className="md:px-5 py-2 mt-2 md:mt-0 rounded-md font-semibold md:text-white text-left text-sm md:bg-[#473BF0] text-[#473BF0] md:hover:bg-[#392ed3] poppins-semibold transition-all">Lihat Semua</a>
                        </div>
                        <BookListScroll books={topBooks} />
                    </div>
                </section>
				<ScrollRestoration />	
                <section id="categories" className="flex items-center flex-col py-20 px-4 md:px-0 bg-[#F7FAFC] dark:bg-[#161b26] dark:text-gray-200">
                    <h2 className="text-xl roboto-black">Pilih kategori yang menarik bagi anda</h2>
                    <div id="categories__wrapper" className="mt-14 max-w-[570px] flex flex-col md:flex-row flex-wrap justify-between gap-y-8">
                        <Link to={generateCategoryLink([0])} className="shadow-sm border border-gray-200 md:w-44 p-8 text-center rounded-md bg-white text-wrap dark:bg-[#2D3748] dark:border-none">
                            <AiOutlineRead className="w-auto h-[114px] mx-auto" />
                            <h3 className="roboto-bold">Karya Umum</h3>
                        </Link>
                        <Link to={generateCategoryLink([1])} className="shadow-sm border border-gray-200 md:w-44 p-8 text-center rounded-md bg-white text-wrap dark:bg-[#2D3748] dark:border-none">
                            <PiBrain className="w-auto h-[114px] mx-auto" />
                            <h3 className="roboto-bold">Filsafat dan psikologi</h3>
                        </Link>
                        <Link to={generateCategoryLink([6])} className="shadow-sm border border-gray-200 md:w-44 p-8 text-center rounded-md bg-white text-wrap dark:bg-[#2D3748] dark:border-none">
                            <AiOutlineSetting className="w-auto h-[114px] mx-auto" />
                            <h3 className="roboto-bold">Ilmu-Ilmu Terapan</h3>
                        </Link>
                        <Link to={generateCategoryLink([7])} className="shadow-sm border border-gray-200 md:w-44 p-8 text-center rounded-md bg-white text-wrap dark:bg-[#2D3748] dark:border-none">
                            <AiOutlineCamera className="w-auto h-[114px] mx-auto" />
                            <h3 className="roboto-bold">Kesenian, Hiburan, dan Olahraga</h3>
                        </Link>
                        <Link to={generateCategoryLink([4])} className="shadow-sm border border-gray-200 md:w-44 p-8 text-center rounded-md bg-white text-wrap dark:bg-[#2D3748] dark:border-none">
                            <AiOutlineZhihu className="w-auto h-[114px] mx-auto" />
                            <h3 className="roboto-bold">Bahasa</h3>
                        </Link>
                        <button className="shadow-sm border border-gray-200 md:w-44 p-8 flex flex-col text-center rounded-md bg-white text-wrap dark:bg-[#2D3748] dark:border-none" onClick={() => {
                            setOpenCategories(true);
                        }}>
                            <AiOutlineAppstore className="w-auto h-[114px] mx-auto" />
                            <h3 className="roboto-bold">Lihat Lainnya...</h3>
                        </button>
                    </div>
                </section>
            </div>

            <span className={`${openCategories ? "fixed" : "hidden"} z-10 top-0 bottom-0 right-0 left-0 bg-black opacity-80`}></span>

            <div id="categories-menu" className={`fixed top-0 right-0 left-0 ${openCategories ? "h-screen opacity-1 translate-y-0" : "h-0 opacity-0 -translate-y-10"} z-20 flex justify-center overflow-y-hidden transition-all`}>
                <div id="categories-menu__wrapper" className="mt-32 mb-10 px-4 overflow-hidden">
                    <div className="w-full flex justify-between text-white mb-5">
                        <h1 className="text-3xl roboto-bold">Kategori Buku</h1>
                        <button className="p-3 rounded-md" onClick={() => {
                            setOpenCategories(false);
                        }}><AiOutlineClose /></button>
                    </div>
                    <div id="categories-menu__items" className="overflow-y-scroll h-full pb-20">
                        <div className="mt-10 md:max-w-[1000px] flex flex-col md:flex-row flex-wrap justify-between gap-y-6 dark:text-gray-200">
                            <Link to={generateCategoryLink([0])} className="md:w-44 p-8 text-center rounded-md bg-white text-wrap dark:bg-[#2D3748]">
                                <AiOutlineRead className="w-auto h-[114px] mx-auto" />
                                <h3 className="roboto-bold">Karya Umum</h3>
                            </Link>
                            <Link to={generateCategoryLink([1])} className="md:w-44 p-8 text-center rounded-md bg-white text-wrap dark:bg-[#2D3748]">
                                <PiBrain className="w-auto h-[114px] mx-auto" />
                                <h3 className="roboto-bold">Filsafat dan Psikologi</h3>
                            </Link>
                            <Link to={generateCategoryLink([2])} className="md:w-44 p-8 text-center rounded-md bg-white text-wrap dark:bg-[#2D3748]">
                                <MdOutlineTempleHindu className="w-auto h-[114px] mx-auto" />
                                <h3 className="roboto-bold">Agama</h3>
                            </Link>
                            <Link to={generateCategoryLink([3])} className="md:w-44 p-8 text-center rounded-md bg-white text-wrap dark:bg-[#2D3748]">
                                <MdPeopleOutline className="w-auto h-[114px] mx-auto" />
                                <h3 className="roboto-bold">Ilmu-Ilmu Sosial</h3>
                            </Link>
                            <Link to={generateCategoryLink([4])} className="md:w-44 p-8 text-center rounded-md bg-white text-wrap dark:bg-[#2D3748]">
                                <AiOutlineZhihu className="w-auto h-[114px] mx-auto" />
                                <h3 className="roboto-bold">Bahasa</h3>
                            </Link>
                            <Link to={generateCategoryLink([5])} className="md:w-44 p-8 text-center rounded-md bg-white text-wrap dark:bg-[#2D3748]">
                                <MdOutlineScience className="w-auto h-[114px] mx-auto" />
                                <h3 className="roboto-bold">Ilmu-Ilmu Murni</h3>
                            </Link>
                            <Link to={generateCategoryLink([6])} className="md:w-44 p-8 text-center rounded-md bg-white text-wrap dark:bg-[#2D3748]">
                                <AiOutlineSetting className="w-auto h-[114px] mx-auto" />
                                <h3 className="roboto-bold">Ilmu-Ilmu Terapan</h3>
                            </Link>
                            <Link to={generateCategoryLink([7])} className="md:w-44 p-8 text-center rounded-md bg-white text-wrap dark:bg-[#2D3748]">
                                <AiOutlineCamera className="w-auto h-[114px] mx-auto" />
                                <h3 className="roboto-bold">Kesenian, Hiburan, Olahraga</h3>
                            </Link>
                            <Link to={generateCategoryLink([8])} className="md:w-44 p-8 text-center rounded-md bg-white text-wrap dark:bg-[#2D3748]">
                                <RiFilePaper2Line className="w-auto h-[114px] mx-auto" />
                                <h3 className="roboto-bold">Kesusastraan</h3>
                            </Link>
                            <Link to={generateCategoryLink([9])} className="md:w-44 p-8 text-center rounded-md bg-white text-wrap dark:bg-[#2D3748]">
                                <IoEarthOutline className="w-auto h-[114px] mx-auto" />
                                <h3 className="roboto-bold">Geografi dan Sejarah Umum</h3>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

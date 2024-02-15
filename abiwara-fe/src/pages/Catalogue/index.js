import { useState } from "react";
import { FaAngleDown, FaFilter, FaStar } from "react-icons/fa";
import { ScrollRestoration } from "react-router-dom";
import BookCardList from "../../components/BookCardList";
import Pagination from "../../components/Pagination";
import SearchBox from "../../components/SearchBox";

export default function Catalogue() {
    const [openFilter, setOpenFilter] = useState(false);

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

    var books = [
        {
            img: "/img/book-cover.png",
            title: "Cerita Rakyat: Maling Kundang si Anak Durhaka",
            author: "Nama Pengarang",
            rating: 4,
            category: "Ilmu-Ilmu Terapan",
        },
        {
            img: "/img/book-cover.png",
            title: "Cerita Rakyat: Maling Kundang si Anak Durhaka",
            author: "Nama Pengarang",
            rating: 3.5,
            category: "Ilmu-Ilmu Terapan",
        },
        {
            img: "/img/book-cover.png",
            title: "Cerita Rakyat: Maling Kundang si Anak Durhaka",
            author: "Nama Pengarang",
            rating: 3,
            category: "Ilmu-Ilmu Terapan",
        },
        {
            img: "/img/book-cover.png",
            title: "Cerita Rakyat: Maling Kundang si Anak Durhaka",
            author: "Nama Pengarang",
            rating: 5,
            category: "Ilmu-Ilmu Terapan",
        },
        {
            img: "/img/book-cover.png",
            title: "Cerita Rakyat: Maling Kundang si Anak Durhaka",
            author: "Nama Pengarang",
            rating: 4.5,
            category: "Ilmu-Ilmu Terapan",
        },
        {
            img: "/img/book-cover.png",
            title: "Cerita Rakyat: Maling Kundang si Anak Durhaka",
            author: "Nama Pengarang",
            rating: 4.5,
            category: "Ilmu-Ilmu Terapan",
        },
        {
            img: "/img/book-cover.png",
            title: "Cerita Rakyat: Maling Kundang si Anak Durhaka",
            author: "Nama Pengarang",
            rating: 4.5,
            category: "Ilmu-Ilmu Terapan",
        },
        {
            img: "/img/book-cover.png",
            title: "Cerita Rakyat: Maling Kundang si Anak Durhaka",
            author: "Nama Pengarang",
            rating: 4.5,
            category: "Ilmu-Ilmu Terapan",
        },
        {
            img: "/img/book-cover.png",
            title: "Cerita Rakyat: Maling Kundang si Anak Durhaka",
            author: "Nama Pengarang",
            rating: 4.5,
            category: "Ilmu-Ilmu Terapan",
        }
    ];

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

                    <form id="book-list__filter" className={`w-full md:w-full md:max-w-72 p-5 rounded-md border border-[#D8D8D8] bg-white ${!openFilter && "hidden"} md:block dark:bg-[#2D3748] dark:border-none dark:text-gray-400`}>
                        <h3 className="text-xl font-bold roboto-bold dark:text-gray-200">Filter</h3>

                        <p className="mt-4 mb-2">Kategori</p>
                        {categories.map((category, index) => {
                            return (
                                <div key={index} className="mb-2 flex items-center">
                                    <input type="checkbox" id={`category${index}`} className="h-[20px] w-[20px] accent-black hover:cursor-pointer"/>
                                    <label for={`category${index}`} className="ml-2">{category.label}</label>
                                </div>
                            )
                        })}

                        <p className="mt-4 mb-2">Rating</p>
                        <div className="mb-2 flex items-center">
                            <input type="checkbox" id="rating" className="h-[21px] w-[21px] accent-black caret-black" />
                            <label for="rating" className="ml-2 flex items-center gap-1"><FaStar className="text-yellow-500" /> 4 ke atas</label>
                        </div>

                        <p className="mt-4 mb-2">Ketersediaan</p>
                        <div className="mb-2 flex items-center">
                            <input type="checkbox" id="exist" className="h-[21px] w-[21px] accent-black caret-black" />
                            <label for="exist" className="ml-2 flex items-center gap-1">ada</label>
                        </div>
                    </form>

                    <div id="book-list__content" className="w-full">
                        <div id="content__meta" className="flex-col md:flex-row flex mb-4 justify-between items-start md:items-center dark:text-gray-200">
                            <p className="mb-4 md:mb-auto">Menampilkan 1 - 10 buku dari total 30 buku</p>
                            <form className="flex md:ml-2 items-center">
                                <label for="sort" className="font-bold roboto-bold mr-2">Urutkan :</label>
                                <div className="flex border p-2 items-center">
                                    <select name="sort" id="sort" className="ml-2 appearance-none bg-transparent rounded-md bg-none hover:cursor-pointer">
                                        <option value="title">Paling Sesuai</option>
                                        <option value="updated_at">Terbaru</option>
                                        <option value="rating">Rating Tertinggi</option>
                                    </select>
                                    <FaAngleDown />
                                </div>
                            </form>
                        </div>
                        <Pagination className="mb-10" stringUrl={window.location.href} currPage={16} totalPage={20} n={5} />
                        <div id="content__books">
                            <BookCardList books={books} />
                        </div>
                    </div>
                </div>

            </section >
			<ScrollRestoration />
        </div >
    )
}

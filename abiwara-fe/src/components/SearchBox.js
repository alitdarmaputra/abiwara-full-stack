import { useRef } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export default function SearchBox() {
	const searchRef = useRef();
	const navigate = useNavigate();	

	const url = new URL(window.location.href);
	const search = url.searchParams.get("search");

	const handleSearch = (e) => {
		e.preventDefault();
		let searchValue = searchRef.current.value;
		if (searchValue != "")
			navigate(`/catalogue?search=${searchValue}`);
	}

    return (
        <div id="search-box" className="flex flex-col items-center text-center">
            <form onSubmit={handleSearch} className="mx-2 flex items-center pl-4 pr-2 md:px-4 py-2 md:py-3 mt-36 translate-y-8 bg-white rounded-full md:rounded-md shadow-md dark:bg-[#2D3748] transition-all dark:text-gray-200">
                <AiOutlineSearch className="hidden lg:inline w-10 h-10 text-gray-400" />
                <input defaultValue={search || ''} required ref={searchRef} type="search" className="flex-grow w-[20rem] md:w-[33rem] text-sm md:text-xl px-4 focus:outline-none bg-transparent" placeHolder="Ketik judul, nama pengarang, atau penerbit" />
                <button type="submit" className="p-2 md:px-10 md:py-2.5 rounded-full md:rounded-sm font-semibold text-white bg-[#473BF0] hover:bg-[#392ed3] poppins-semibold transition-all">
                    <AiOutlineSearch className="md:hidden w-6 h-6 text-white" />
                    <span className="hidden md:inline">Cari buku</span>
                </button>
            </form>
            <div className="fixed h-[215px] left-0 top-0 right-0 -z-10 overflow-hidden">
                <img className="object-cover w-screen h-[215px]" src="/img/hero-2.png" />
            </div>
        </div>
    )
}

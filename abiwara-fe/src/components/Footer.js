import { AiOutlineInstagram, AiOutlineSearch, AiFillYoutube, AiFillFacebook } from "react-icons/ai";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";

export default function Footer() {
	const searchRef = useRef();
	const navigate = useNavigate();

	const handleSearch = (e) => {
		e.preventDefault();
		let searchValue = searchRef.current.value;

		if (searchValue != "")
			navigate(`/catalogue?search=${searchValue}`);
		else
			navigate(`/catalogue`);
	}

    return (
        <div id="footer" className="flex items-center flex-col bg-white pt-24 pb-10 px-5 md:px-0 dark:bg-[#1A202C]">
            <div id="footer__wrapper" className="max-w-6xl mb-10 text-sm w-full flex flex-col lg:flex-row justify-between">
                <div id="footer__about" className="mb-10 md:mb-0 md:max-w-64">
                    <div className="flex justify-center md:justify-start gap-2 items-center text-2xl text-black mb-10 md:mb-4">
                        <Logo width="44" height="44" fill="black" />
                        <h3 className="poppins-semibold dark:text-gray-200">Abiwara</h3>
                    </div>
                    <p className="mb-10 text-gray-700 dark:text-gray-400">Aplikasi abiwara merupakan aplikasi perpustakaan SMP N 3 Kediri yang menyediakan berbagai referensi untuk proses pembelajaran siswa.</p>
                    <div className="flex gap-2 text-black dark:text-gray-400">
                        <a href="https://www.youtube.com/@smp3kediri794" lassName="hover:cursor-pointer"><AiFillYoutube className="h-8 w-8" /></a>
                        <a href="https://www.facebook.com/humassempatik.humassempatik" className="hover:cursor-pointer"><AiFillFacebook className="h-8 w-8" /></a>
                        <a href="https://www.instagram.com/humassempatik946_smpn3_kediri" className="hover:cursor-pointer"><AiOutlineInstagram className="h-8 w-8" /></a>
                    </div>
                </div>

                <div id="footer__location" className="mb-10 md:mb-0 md:max-w-64">
                    <h3 className="mb-4 roboto-bold text-gray-700 dark:text-gray-200">Alamat Perpustakaan</h3>
                    <div className="flex mb-10 items-center gap-2 text-black dark:text-gray-400">
                        <p>Jl.Baypass No.27X Desa Beraban Kediri Tabanan</p>
                    </div>
                    <iframe title="library-position" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4691.31578968449!2d115.1044839761631!3d-8.604657173060371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd239eb0b88096d%3A0x379b3404aa8592db!2sSMPN%203%20Kediri!5e0!3m2!1sid!2sid!4v1706974809492!5m2!1sid!2sid" width="230" height="230" style={{ border: 0 }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>

                <div id="footer__navigation" className="mb-10 md:mb-0">
                    <h3 className="mb-4 roboto-bold text-gray-700 dark:text-gray-200">Navigasi</h3>
                    <div className="flex flex-col gap-3 dark:text-gray-400">
						<Link to="/">Beranda</Link>
						<Link to="/catalogue">Lihat Buku</Link>
						<Link to="/help">Bantuan</Link>
                    </div>
                </div>

                <div id="footer__others" className="flex flex-col">
                    <h3 className="mb-4 roboto-bold text-gray-700 dark:text-gray-200">Pencarian Buku</h3>
                    <form onSubmit={handleSearch} className="flex items-center pl-4 pr-2 py-1 mb-10 rounded-full border border-gray-500">
                        <input ref={searchRef} type="search" className="flex-grow md:w-72 text-sm px-2 focus:outline-none dark:bg-transparent dark:text-gray-200" placeHolder="Ketik judul, nama pengarang, atau penerbit" />
                        <button type="submit" className="p-2 rounded-full font-semibold text-white bg-[#473BF0] hover:bg-[#392ed3] poppins-semibold transition-all">
                            <AiOutlineSearch className="w-6 h-6 text-white" />
                        </button>
                    </form>
                    <a href="https://smpn3kediri.sch.id/" className="px-5 py-2.5 md:w-[60%] mb-4 rounded-md text-black border-2 border-black hover:bg-black hover:text-white poppins-regular transition-all dark:text-gray-200 dark:border-gray-200 dark:hover:bg-white dark:hover:text-black">Website SMP N 3 Kediri</a>
					<Link to="/help/borrow-step" className="px-5 py-2.5 md:w-[60%] mb-4 rounded-md text-white bg-[#473BF0] hover:bg-[#392ed3] poppins-regular transition-all">Alur Peminjaman Buku</Link>
                </div>
            </div>
        </div>
    )
}

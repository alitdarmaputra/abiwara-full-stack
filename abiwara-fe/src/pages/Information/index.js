import SearchBox from "../../components/SearchBox";
import { ScrollRestoration } from "react-router-dom";

export default function Information() {
	return (
		<div id="information">
			<SearchBox />
			<section className="flex justify-center bg-white py-16 md:pt-20 px-4 md:px-0 dark:bg-[#161B26]">
				<div className="w-full max-w-6xl">
					<h1 className="text-3xl font-bold roboto-bold mb-4 dark:text-gray-200">Informasi Perpustakaan</h1>

					<p className="mb-2 text-gray-700 dark:text-gray-400">Perpustakaan SMP N 3 Kediri adalah fasilitas pendidikan yang bertujuan untuk menyediakan akses terhadap berbagai jenis sumber belajar dan informasi kepada siswa serta staf pengajar di SMP N 3 Kediri. Perpustakaan berperan sebagai pusat sumber daya pendidikan yang mendukung proses pembelajaran, penelitian, dan pengembangan diri.</p>
					<div className="mt-4 mb-4 flex flex-col md:flex-row justify-center gap-2 flex-wrap">
						<img alt="foto perpustakaan 1" className="md:w-1/3" src="/img/information-1.jpeg"/>
						<img alt="foto perpustakaan 2" className="md:w-1/3" src="/img/information-2.jpeg"/>
						<img alt="foto perpustakaan 3" className="md:w-1/3" src="/img/information-3.jpeg"/>
					</div>
					<p className="mb-2 text-gray-700 dark:text-gray-400">Perpustakaan menyediakan ruang yang nyaman dan teratur, dilengkapi dengan rak buku yang terorganisir dengan baik, area duduk yang nyaman, dan sarana teknologi seperti komputer atau akses internet. Terdapat beragam jenis koleksi, mulai dari buku teks, fiksi, non-fiksi, majalah, hingga media pembelajaran lainnya seperti CD, maupun DVD.</p>

					<h2 className="mt-4 mb-4 text-xl font-bold roboto-bold dark:text-gray-200">Informasi</h2>
					<h3 className="mb-2 roboto-bold text-gray-700 dark:text-gray-200">Alamat</h3>
					<p className="mb-2 text-gray-700 dark:text-gray-400">Jl.Baypass No.27X Desa Beraban Kediri Tabanan</p>

					<h2 className="mt-4 mb-4 text-xl font-bold roboto-bold dark:text-gray-200">Jam Buka</h2>
					<h3 className="mb-2 font-bold roboto-bol text-gray-700 dark:text-gray-200">Senin-Sabtu</h3>
					<p className="mb-2 text-gray-700 dark:text-gray-400">Buka : 08.00 WITA</p>
					<p className="mb-2 text-gray-700 dark:text-gray-400">Buka : 13.30 WITA</p>
				</div>
			</section>
			<ScrollRestoration />
		</div>
	)
}

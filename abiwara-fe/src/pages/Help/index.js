import { Link } from "react-router-dom";
import Collapse from "../../components/Collapse";
import SearchBox from "../../components/SearchBox";

export default function Information() {
	const items = [{
		label: "Siapa yang dapat melakukan peminjaman buku?",
		children: (<p>Peminjaman buku dapat dilakukan oleh anggota perpustakaan yang terdiri dari siswa, guru, dan pegawai di SMP N 3 Kediri serta telah memiliki akun pada aplikasi Abiwara.</p>)
	}, 
	{
		label: "Berapa lama buku di perpustakaan dapat dipinjam?",
		children: (<p>Buku di perpustakaan dapat dipinjam paling lama dua hari setelah peminjaman</p>)
	},
	{
		label: "Bagaimana alur peminjaman buku di perpustakaan?",
		children: (<p>Secara lengkap alur peminjaman buku dapat dilihat melalui link <Link to='/help/borrow-step' className="text-teal-600">berikut</Link></p>)
	}];	

	return (
		<div id="help">
			<SearchBox />
			<section className="flex justify-center bg-white py-16 md:pt-20 px-4 md:px-0 dark:bg-[#161B26]">
				<div className="w-full max-w-6xl">
					<h1 className="text-3xl font-bold roboto-bold mb-10 dark:text-gray-200">Pertanyaan Umum</h1>
					{
						items.map(item => {
							return (
								<Collapse key={new Date().getTime()} className="mb-6" label={item.label} children={item.children} />
							)
						})
					}
				</div>
			</section>
		</div>
	)
}

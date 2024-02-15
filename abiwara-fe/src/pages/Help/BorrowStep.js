import { ScrollRestoration } from "react-router-dom";
import SearchBox from "../../components/SearchBox";

export default function BorrowStep() {
	return (
		<div id="borrow-step">
			<SearchBox />
			<section className="flex justify-center bg-white py-16 md:pt-20 px-4 md:px-0 dark:bg-[#161B26]">
				<div className="w-full max-w-6xl">
					<h1 className="text-3xl font-bold roboto-bold mb-10 dark:text-gray-200">Alur Peminjaman</h1>
					<div className="flex justify-center mb-4">
						<img alt="alur peminjaman buku" className="shadow-lg" src="/img/borrow-step.png" />
					</div>
				</div>
			</section>
			<ScrollRestoration />
		</div>
	)
}

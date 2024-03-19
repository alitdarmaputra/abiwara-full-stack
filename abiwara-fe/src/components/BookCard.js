import { Link } from "react-router-dom";
import { stringToColor } from "../utils/color";
import Stars from "./Star";

export default function BookCard({ book }) {
	let strRating = '0';
	if (book.rating > 0)
		strRating = book.rating?.toFixed(1);

    return (
        <div id="book-card" key={book.id} className="mb-6 md:pr-4 flex flex-col md:flex-row rounded-md border-2 border-[#F4F7FA] dark:border-[#2D3748] dark:text-gray-200">
            <div id="book-card__img" className="flex justify-center items-center bg-[#F4F7FA] p-4 rounded-t-md md:rounded-l-md dark:bg-[#2D3748]">
                <div className="w-[154px] h-[246px]">
                    <img className="object-cover w-full h-full" alt="book cover" src={book.img.image_url} />
                </div>
            </div>

            <div id="book-card__meta" className="flex flex-grow p-4 items-center">
                <div className="max-w-xl">
                    <p className="rounded-md px-4 py-2 text-xs inline-block mb-6" style={{ backgroundColor: `${stringToColor(book.category.name)}` }}>
                        {book.category.name}
                    </p>
                    <h3 className="mb-2 line-clamp-2 text-ellipsis text-3xl roboto-bold">{book.title}</h3>
                    <p className="mb-4 text-sm opacity-70">{`Oleh ${book.author}`}</p>

                    <table className="opacity-70 mb-4">
						<tbody>
							<tr>
								<td>No Inventaris</td>
								<td className="w-10 text-center"> : </td>
								<td>{book.inventory_number ? book.inventory_number : "-"}</td>
							</tr>
							<tr>
								<td>Penerbit</td>
								<td className="w-10 text-center"> : </td>
								<td>{book.publisher ? book.publisher : "-"}</td>
							</tr>
							<tr>
								<td>Tahun Terbit</td>
								<td className="w-10 text-center"> : </td>
								<td>{book.year ? book.year : "-"}</td>
							</tr>
							<tr className="md:hidden">
								<td>Ketersediaan</td>
								<td className="w-10 text-center"> : </td>
								<td>{book.remain ? book.remain : "0"}</td>
							</tr>
						</tbody>
                    </table>

                    <div id="book-card__rating" className="flex items-center">
                        <div className="flex gap-0.5 text-yellow-500 mr-2">
                            <Stars rating={book.rating} />
                        </div>
                        <p>{strRating}</p>
                    </div>
                </div>
            </div>

            <div id="book-card__status" className="ml-4 md:ml-10 flex flex-col justify-center items-start md:items-center">
                <p className="hidden md:block mb-6">Ketersediaan</p>
                <h1 className="hidden md:block mb-6 text-5xl font-bold roboto-bold">{book.remain}</h1>
                <Link to={`/catalogue/${book.id}`} className="px-2 py-2.5 md:w-[94px] mb-4 text-xs text-center rounded-md text-black border-2 border-black hover:bg-black hover:text-white poppins-regular dark:text-gray-200 dark:border-[#2D3748] dark:hover:bg-white dark:hover:text-black transition-all">Tampilkan Detail</Link>
            </div>
        </div >
    )
}

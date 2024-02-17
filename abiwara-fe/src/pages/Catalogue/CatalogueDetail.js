import SearchBox from "../../components/SearchBox";
import { FaBookmark, FaRegBookmark, FaStar, FaStarHalf } from "react-icons/fa";
import { stringToColor } from "../../utils/color";
import { ScrollRestoration } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function CatalogueDetail({ book = {} }) {
    book.category = "";

    const Stars = ({ rating }) => {
        let ratingElements = [];
        while (ratingElements.length < 5) {
            if (rating >= 1)
                ratingElements.push(<FaStar className="text-yellow-500 w-[20px] h-[20px]" />);
            else if (rating > 0)
                ratingElements.push(<FaStarHalf className="text-yellow-500 w-[20px] h-[20px]" />);
            else
                ratingElements.push(<FaStar className="text-gray-100 w-[20px] h-[20px] dark:text-gray-500" />);

            rating--;
        }
        return ratingElements;
    }

    return (
        <div id="catalogue-detail">
			<Helmet>
				<title>{book.title}</title>
			</Helmet>
            <SearchBox />

            <section id="book" className="flex justify-center bg-white py-16 md:pt-20 px-4 md:px-0 dark:bg-[#161B26]">
                <div id="book__wrapper" className="w-full max-w-6xl flex flex-col md:flex-row md:items-start gap-4 justify-between">
                    <div id="book-card" className="w-full mb-6 md:pr-4 flex flex-col md:flex-row rounded-md border-2 border-[#F4F7FA] dark:border-[#2D3748]">
                        <div id="book-card__img" className="flex justify-center items-center bg-[#F4F7FA] p-4 rounded-t-md md:rounded-l-md dark:bg-[#2D3748]">
                            <div className="w-[194px] h-[286px] shadow-lg relative">
                                <img className="object-cover w-full h-full" alt="book cover" src="/img/book-cover.png" />
                            </div>
                        </div>

                        <div id="book-card__meta" className="flex flex-grow p-4 items-center dark:text-gray-200">
                            <div className="max-w-xl">
                                <p className="rounded-md px-4 py-2 text-xs inline-block mb-6" style={{ backgroundColor: `${stringToColor(book.category)}` }}>
                                    {book.category}
                                </p>
                                <h3 className="mb-2 line-clamp-2 text-ellipsis text-xl roboto-bold">{book.title}</h3>
                                <p className="mb-4 text-sm opacity-70">{`Oleh ${book.author}`}</p>

                                <p className="mb-2">
                                    Lorem ipsum dolo sit amet adjksfl sdfjkj asjkkjdf k dkfjkaj aksdjfc
                                </p>

                                <h3 className="font-bold roboto-bold mb-2">Informasi Detail</h3>
                                <table className="opacity-70 mb-4">
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
                                    <tr>
                                        <td>Nomor Seri</td>
                                        <td className="w-10 text-center"> : </td>
                                        <td>{book.serialNumber ? book.serialNumber : "-"}</td>
                                    </tr>
                                </table>

                                <div className="px-5 py-1 mb-5 text-center rounded-md inline-block bg-green-200 dark:bg-green-900">
                                    Tersedia
                                </div>

                                <div id="book-card__rating" className="flex items-center">
                                    <div className="flex gap-0.5 text-yellow-500 mr-2">
                                        <Stars rating={book.rating} />
                                    </div>
                                    <p>{book.rating}</p>
                                </div>
                            </div>
                        </div>

                        <div id="book-card__action" className="flex items-end dark:text-gray-200 dark:hover:text-black">
                            <button className="hover:bg-gray-100 p-2 rounded-lg transition-all">
                                {
                                    false ? (
                                        <FaBookmark />
                                    ) : (
                                        <FaRegBookmark />
                                    )
                                }
                            </button>
                        </div>
                    </div >
                </div>
            </section >
			<ScrollRestoration />
        </div>
    )
}

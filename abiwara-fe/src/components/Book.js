import { Link } from "react-router-dom";
import Stars from "./Star";

export default function Book({ book }) {
	let strRating = '0';
	if (book.rating > 0)
		strRating = book.rating?.toFixed(1);

    return (
        <Link to={`/catalogue/${book.id}`} id="book" key={book.id} className="md:hover:shadow-lg transition-all hover:cursor-pointer w-48 md:w-52">
            <div id="book__img" className="flex justify-center pt-4 bg-[#F4F7FA] rounded-t-lg dark:bg-[#2D3748]">
                <div className="w-[140px] h-[224px] md:w-[170px] md:h-[272px]">
                    <img className="object-cover w-full h-full" alt="book cover" src={book.img.image_url} />
                </div>
            </div>
            <div id="book_attribute" className="p-4 border-2 rounded-b-lg border-[#F4F7FA] dark:border-[#2C313D] dark:text-gray-200">
				<div className="h-20">
					<h3 className="mb-2 line-clamp-2 text-ellipsis text-sm roboto-bold">{book.title}</h3>
					<p className="mb-4 text-xs">{`Oleh ${book.author}`}</p>
				</div>
                <div id="book__rating" className="flex items-center">
                    <div className="flex gap-0.5 text-yellow-500 mr-2">
                        <Stars id={book.id} rating={book.rating} />
                    </div>
                    <p className="text-sm">{strRating}</p>
                </div>
            </div>
        </Link>
    )
}

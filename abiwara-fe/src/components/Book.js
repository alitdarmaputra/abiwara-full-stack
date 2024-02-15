import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Book({ book }) {

    const Stars = ({ rating }) => {
        let ratingElements = [];
        while (ratingElements.length < 5) {
            if (rating >= 1)
                ratingElements.push(<FaStar className="text-yellow-500" />);
            else if (rating > 0)
                ratingElements.push(<FaStarHalfAlt className="text-yellow-500" />);
            else
                ratingElements.push(<FaStar className="text-gray-100 dark:text-gray-500" />);

            rating--;
        }
        return ratingElements;
    }

    return (
        <Link to="/catalogue/1" id="book" key={book.id} className="max-w-44 md:max-w-52 hover:shadow-lg transition-all hover:cursor-pointer">
            <div id="book__img" className="flex justify-center pt-4 bg-[#F4F7FA] rounded-t-lg dark:bg-[#2D3748]">
                <div className="w-[140px] h-[224px] md:w-[170px] md:h-[272px]">
                    <img className="object-cover w-full h-full" alt="book cover" src={book.img} />
                </div>
            </div>
            <div id="book_attribute" className="p-4 border-2 rounded-b-lg border-[#F4F7FA] dark:border-[#2C313D] dark:text-gray-200">
                <h3 className="mb-2 line-clamp-2 text-ellipsis text-sm roboto-bold">{book.title}</h3>
                <p className="mb-4 text-xs">{`Oleh ${book.author}`}</p>
                <div id="book__rating" className="flex items-center">
                    <div className="flex gap-0.5 text-yellow-500 mr-2">
                        <Stars rating={book.rating} />
                    </div>
                    <p className="text-xs">{book.rating}</p>
                </div>
            </div>
        </Link>
    )
}

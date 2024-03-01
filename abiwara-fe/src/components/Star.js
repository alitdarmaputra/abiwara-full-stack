import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const Stars = ({ rating }) => {
	let ratingElements = [];
	while (ratingElements.length < 5) {
		if (rating >= 1)
			ratingElements.push(<FaStar key={crypto.randomUUID()} className="text-yellow-500" />);
		else if (rating > 0)
			ratingElements.push(<FaStarHalfAlt key={crypto.randomUUID()} className="text-yellow-500" />);
		else
			ratingElements.push(<FaStar key={crypto.randomUUID()} className="text-gray-100 dark:text-gray-500" />);

		rating--;
	}
	return ratingElements;
}

export default Stars;

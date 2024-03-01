import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const Star = ({ filled, half }) => {
	if (filled) {
		return <FaStar className="text-yellow-500" />;
	} else if (half) {
		return <FaStarHalfAlt className="text-yellow-500" />;
	} else {
		return <FaStar className="text-gray-100 dark:text-gray-500" />;
	}
};

const Stars = ({ rating }) => {
	let ratingElements = [];
	let remainingRating = rating;

	while (ratingElements.length < 5) {
		if (remainingRating >= 1) {
			ratingElements.push(<Star key={ratingElements.length} filled />);
		} else if (remainingRating > 0) {
			ratingElements.push(<Star key={ratingElements.length} half />);
		} else {
			ratingElements.push(<Star key={ratingElements.length} />);
		}
		remainingRating--;
	}
	return ratingElements;
};

export default Stars;

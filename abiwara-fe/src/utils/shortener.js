export default function getFirstCharacters(sentence) {
	if (sentence.length < 1)
		return "";

	const words = sentence.split(' ');
	let result = '';

	for (let i = 0; i < words.length; i++) {
		result += words[i][0];
	}

	return result.toUpperCase(); 
}

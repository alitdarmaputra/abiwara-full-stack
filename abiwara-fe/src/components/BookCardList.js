import BookCard from "./BookCard";

export default function BookCardList({ books }) {
    return (
        <>
            {
                books && books.map(book => {
                    return (
                        <BookCard key={book.id} book={book} />
                    )
                })
            }
        </>
    )
}

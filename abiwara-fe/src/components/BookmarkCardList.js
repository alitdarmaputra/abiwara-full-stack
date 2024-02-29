import BookCard from "./BookCard";

export default function BookmarkCardList({ bookmarks }) {
    return (
        <>
            {
                bookmarks && bookmarks.map(bookmarks => {
                    return (
                        <BookCard book={bookmarks.book} />
                    )
                })
            }
        </>
    )
}

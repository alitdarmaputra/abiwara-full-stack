import BookCard from "./BookCard";

export default function BookmarkCardList({ bookmarks }) {
    return (
        <>
            {
                bookmarks && bookmarks.map(bookmark => {
                    return (
                        <BookCard key={bookmark.id} book={bookmark.book} />
                    )
                })
            }
        </>
    )
}

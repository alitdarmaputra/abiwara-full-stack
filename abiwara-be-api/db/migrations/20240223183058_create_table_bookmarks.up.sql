CREATE TABLE bookmarks (
	id INT PRIMARY KEY AUTO_INCREMENT,
	user_id VARCHAR(50),
	book_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT FK_bookmarks_users FOREIGN KEY(user_id)
	REFERENCES users(id),
	CONSTRAINT FK_bookmarks_book FOREIGN KEY(book_id)
	REFERENCES books(id)
)

ALTER TABLE books 
ADD COLUMN cover_img VARCHAR(50), 
ADD CONSTRAINT FK_book_file FOREIGN KEY (cover_img) REFERENCES file_uploads(id);

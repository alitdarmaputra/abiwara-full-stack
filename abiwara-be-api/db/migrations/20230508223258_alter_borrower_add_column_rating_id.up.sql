ALTER TABLE borrowers 
ADD COLUMN rating_id INT,
ADD CONSTRAINT FK_rating FOREIGN KEY (rating_id) REFERENCES ratings(id);

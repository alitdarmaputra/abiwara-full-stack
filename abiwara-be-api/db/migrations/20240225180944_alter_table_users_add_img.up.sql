ALTER TABLE users 
ADD COLUMN profile_img VARCHAR(50), 
ADD CONSTRAINT FK_user_file FOREIGN KEY (profile_img) REFERENCES file_uploads(id);

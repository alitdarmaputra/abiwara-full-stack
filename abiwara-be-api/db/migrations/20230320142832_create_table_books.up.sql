CREATE TABLE books (    
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    cover_img VARCHAR(255),
    price INT,
    title VARCHAR(255) NOT NULL,
    authors VARCHAR(255),
    publisher VARCHAR(255),
    published INT,
    quantity INT NOT NULL,
    remain INT NOT NULL,
    page INT,
    buy_date DATETIME,
    summary TEXT,
    category_id VARCHAR(20),
    CONSTRAINT FK_category FOREIGN KEY(category_id)
    REFERENCES categories(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    deleted_at DATETIME
)ENGINE=InnoDB; 

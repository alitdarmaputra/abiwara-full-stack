CREATE TABLE role_permissions (
    id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    role_id int NOT NULL,
    permission_id int NOT NULL,
    CONSTRAINT FK_Role FOREIGN KEY (role_id)
    REFERENCES roles(id),
    CONSTRAINT FK_Permission FOREIGN KEY (permission_id)
    REFERENCES permissions(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    deleted_at DATETIME
)ENGINE=InnoDB;

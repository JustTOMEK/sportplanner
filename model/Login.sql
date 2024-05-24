CREATE TABLE User (
id INT AUTO_INCREMENT PRIMARY KEY ,
username varchar(20) NOT NULL,
email varchar(50),
password_hash varchar(512) NOT NULL,
salt varchar(30) NOT NULL
)
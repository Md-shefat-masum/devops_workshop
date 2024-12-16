CREATE DATABASE IF NOT EXISTS workshop_devops;

USE workshop_devops;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

INSERT INTO users (name) VALUES
('Shefat'),
('Masum'),
('Abdullah'),
('Mubassir'),
('Sakin');

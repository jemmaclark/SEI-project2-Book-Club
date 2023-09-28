CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email TEXT,
    password_digest TEXT
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    genre TEXT,
    published_year INT,
    image_url TEXT,
    user_id INT
);
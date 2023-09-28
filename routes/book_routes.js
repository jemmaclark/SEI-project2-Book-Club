const express = require('express')
const router = express.Router()
const db = require ('../db')
const ensureLoggedIn = require('../middlewares/ensure_logged_in')

router.get('/add', ensureLoggedIn, (req, res) => {
    res.render('add_book')
})

router.post('/', ensureLoggedIn, (req, res) => {
    console.log('hi')
    const user_id = req.session.userId

    const sql = `INSERT INTO books (title, author, genre, published_year, image_url, user_id) VALUES ($1, $2, $3, $4, $5, $6);`

    db.query(sql, [req.body.title, req.body.author, req.body.genre, req.body.published_year, req.body.image_url, user_id], (err, dbRes) => {
        if (err) {
            console.log(err)
        }
        return res.redirect('/')
    })
})


router.get('/:id', (req, res) => {
    const booksId = req.params.id;
    console.log('requested book id:', booksId)
    const sql = `SELECT * FROM books WHERE id = $1;`
    
    db.query(sql, [booksId], (err, dbRes) => { 
        if (err) {
            console.log(err)
        }
        let books = dbRes.rows[0]
        console.log('book details:', books)

        const userId = req.session.userId
        console.log(req.session.user)
        res.render('book_details', { books, userId: userId })
    })
})

router.delete('/:id', (req, res) => {
    const bookId = req.params.id
    const sql = `DELETE FROM books WHERE id = $1;`

    db.query(sql, [bookId], (err, dbRes) => {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/')
        }
    })
})

router.get('/:id/edit', (req, res) => {
    const booksId = req.params.id;
    db.query(`SELECT * FROM books WHERE id = $1;`, [booksId], (err, dbRes) => {
        if (err) {
        console.log(err)
        } else {
            const book = dbRes.rows[0];
            res.render('edit_form', { book })
        }
    })
})

router.post('/:id', (req, res) => {
    const booksId = req.params.id;
    const { title, author, genre, published_year, image_url } = req.body
    const sql = `UPDATE books SET title = $1, author = $2, genre = $3, published_year = $4, image_url = $5 WHERE id = $6;`
    const values = [title, author, genre, published_year, image_url, booksId]

    db.query(sql, values, (err, dbRes) => {
        if (err) {
            console.log(err)
        } else {
            res.redirect(`/books/${booksId}`)
        }
    })
})

router.get('/:id/to-read', ensureLoggedIn, (req, res) => {
    const bookId = req.params.id
    res.render('to_read_list', { bookId })
})

router.post('/:id/to-read', ensureLoggedIn, (req, res) => {
    const bookId = req.params.id
    const userId = req.session.userId

    const sql = `INSERT INTO want_to_read (user_id, book_id) VALUES ($1, $2);`

    db.query(sql, [userId, bookId], (err, dbRes) => {
        if (err) {
            console.log(err)
        } else {
            res.render('to_read_list', { bookId })
        }
    })
})

router.get('/books/to-read', ensureLoggedIn, (req, res) => {
    const userId = req.session.userId
    const sql = `SELECT books.title, books.author, books.image_url, want_to_read.id AS want_to_read_id 
    FROM books
    JOIN want_to_read ON books.id = want_to_read.book_id
    WHERE want_to_read.user_id = $1;`

    db.query(sql, [userId], (err, dbRes) => {
        if (err) {
            console.log(err)
        } else {
            const yourReadBooks = dbRes.rows
            res.render('to_read_list', { yourReadBooks })
        }
    })
})

router.post('/:id/to-read', ensureLoggedIn, (req, res) => {
    const bookId = req.params.id
    const userId = req.session.userId
    const sql = `INSERT INTO want_to_read (user_id, book_id) VALUES ($1, $2);`

    db.query(sql, [userId, bookId], (err, dbRes) => {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/books/to_read_list')
        }
    })
})

module.exports = router
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
        res.render('book_details', { books, user: req.user })
    })
})

module.exports = router
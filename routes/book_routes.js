const express = require('express')
const router = express.Router()
const db = require ('../db')
const ensureLoggedIn = require('../middlewares/ensure_logged_in')

router.get('/', ensureLoggedIn, (req, res) => {
    res.send('hi')
    res.render('add_books')
})

router.post('/add', ensureLoggedIn, (req, res) => {
    const { title, author, genre, published_year, image_url } = req.body
    const user_id = req.session.userId

    const sql = `INSERT INTO books (title, author, genre, published_year, image_url, user_id) VALUES ($1, $2, $3, $4, $5, $6);`

    db.query(sql, [title, author, genre, published_year, image_url, user_id], (err, dbRes) => {
        if (err) {
            console.log(err)
        }
        return res.redirect('/')
    })
})

module.exports = router
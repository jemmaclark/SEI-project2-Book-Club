const express = require('express')
const router = express.Router()
const db = require('../db')
const bcrypt = require('bcrypt')

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', (req, res) => {
    console.log("login route accessed")
    sql = `SELECT * FROM users WHERE email = $1`
    values = [req.body.email]
    console.log(req.body.email)

    db.query(sql, values, (err, dbRes) => {
        if (err) {
            console.log(err)
            return res.render('login')
        }
        console.log("db response:", dbRes.rows)
        if (dbRes.rows.length === 0) {
            console.log("user not found")
            return res.render('login')
        }
        console.log(dbRes.rows)

        const userInputPassword = req.body.password
        const hashedPasswordFromDb = dbRes.rows[0].password_digest

        bcrypt.compare(userInputPassword, hashedPasswordFromDb, (err, result) => {
            if (result) {
                req.session.userId = dbRes.rows[0].user_id
                console.log("user logged in")
                return res.redirect('/')
            } else {
                console.log("invalid password")
                return res.render('login')
            }
        })
    })
})
router.delete('/logout', (req, res) => {
    req.session.userId = null
    res.redirect('/login')
})

module.exports = router
    

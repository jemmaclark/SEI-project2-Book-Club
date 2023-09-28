const db = require('../db/index.js')

function setCurrentUser(req, res, next) {
    res.locals.userId = req.session.userId
    console.log("hello", req.session.userId)

    if (!req.session.userId) {
        res.locals.user = null
        return next()
    }
    const sql = `SELECT * FROM users WHERE user_id =$1;`

    db.query(sql, [req.session.userId], (err, dbRes) => {
        if (err) {
            console.log(err)
            process.exit(1)
        } else {
            const user = dbRes.rows[0]
            console.log('User:', user)
            res.locals.user = user
        }
        next()
    })
}
module.exports = setCurrentUser
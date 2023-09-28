const pg = require('pg')

const db = new pg.Pool({
    database: 'book_club'
})

module.exports = db
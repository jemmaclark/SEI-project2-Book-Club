const express = require('express')
const app = express()
const port = 8080
const requestLogger = require('./middlewares/request_logger')
const expressLayouts = require('express-ejs-layouts')
const pg = require('pg')
const reqBodyMethodOverride = require('./middlewares/req_body_method_override')
const bcrypt = require('bcrypt')
const session = require('express-session')
const db = require('./db/index.js')

const setCurrentUser = require('./middlewares/set_current_user');
const userRoutes = require('./routes/user_routes')
const sessionRoutes = require('./routes/session_routes')

app.set('view engine', 'ejs');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use(setCurrentUser)
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(reqBodyMethodOverride);
app.use(requestLogger);
app.use(expressLayouts);


app.use('/users', userRoutes)
app.use('/', sessionRoutes)
app.get('/', (req, res) => {
    res.render('home')
})

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
});
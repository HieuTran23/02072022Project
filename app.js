// App.js
/**
 * Required External Modules
 */
const express = require("express")
const mongoose = require('mongoose')
var bodyParser = require('body-parser');
const accountRouter = require('./routes/admin/account')
const authRouter = require('./routes/auth')

/**
 * App Variables
 */
const app = express();


/**
 *  App Configuration
 */
// Database config
mongoose.connect('mongodb+srv://admin:admin@cluster.ur4xo.mongodb.net/Database?retryWrites=true&w=majority', (err) => {
    if (err) console.log(error);
    console.log('Connect database success')
})

//--Json
app.use(express.json());

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


//--View engine
app.set('view engine', 'ejs')

//--Static file 
app.use(express.static('public'))

/**
 * Routes Definitions
 */
//--Admin
//Account
app.use('/api/account', accountRouter)

//Auth
app.use('/', authRouter)

/**
 * Server Activation
 */
const port = 5000
app.listen(port, () => {
    console.log('Server running on port ' + port);
})

 
 
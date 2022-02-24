// App.js
/**
 * Required External Modules
 */
const express = require("express")
const mongoose = require('mongoose')
var bodyParser = require('body-parser');
const cookieParser = require("cookie-parser")
const path = require('path')
//--Router
const authRouter = require('./routes/auth')
const adminRouter = require('./routes/admin')
const userRouter = require('./routes/admin/user');
const roleRouter = require('./routes/admin/role')
const academicYearRouter = require('./routes/admin/academicYear')

//--






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
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())


//--View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

//--Static file 
app.use(express.static('public'))

/**
 * Routes Definitions
 */

//--Admin start
//Dashboard
app.use('/admin', adminRouter)

//Role
app.use('/admin/role', roleRouter)


//--Admin

//academic year
app.use('/api/academicyear',academicYearRouter)

//User
app.use('/admin/user', userRouter)
//--Admin end

//--Auth start
app.use('/', authRouter)
//--Auth end 

//--User start

//--User end
/**
 * Server Activation
 */
const port = 5000
app.listen(port, () => {
    console.log('Server running on port ' + port);
})

 
 
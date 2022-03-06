// App.js
/**
 * Required External Modules
 */
const express = require("express")
const mongoose = require('mongoose')
var bodyParser = require('body-parser');
const cookieParser = require("cookie-parser")
const path = require('path')
const Role = require('./models/role')

const department = require('./models/department')
//--Router
//--|--Admin
const authRouter = require('./routes/auth')
const adminRouter = require('./routes/admin')
const userAdminRouter = require('./routes/admin/user');
const roleAdminRouter = require('./routes/admin/role')
const submissionAdminRouter = require('./routes/admin/submission')
const departmentAdminRouter = require('./routes/admin/department')
//--|--User
const profileRouter = require('./routes/user/profile')
const submissionRouter = require('./routes/user/submission')
//--
/**
 * App Variables
 */
const app = express();


/**
 *  App Configuration
 */
// Database config
mongoose.connect('mongodb+srv://admin:admin@cluster.ur4xo.mongodb.net/Database?retryWrites=true&w=majority', (err, db) => {
    if (err) console.log(err);
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
//--|--Dashboard
app.use('/admin', adminRouter)

//--|--Role
app.use('/admin/role', roleAdminRouter)

//--|--department
app.use('/admin/department',departmentAdminRouter)

//--|--submission
app.use('/admin/submission',submissionAdminRouter)

//--|--User
app.use('/admin/user', userAdminRouter)
//--Admin end

//--Auth start
app.use('/', authRouter)
//--Auth end 

//--User start
//--|--profile
app.use('/profile', profileRouter)

//--|--Submission
app.use('submission', submissionRouter)

//--User end
/**
 * Server Activation
 */
const port = 5000
app.listen(port, () => {
    console.log('Server running on port ' + port);
})

 
 
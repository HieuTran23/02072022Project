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
//--|--Auth
const authRouter = require('./routes/auth')

//--|--Upload
const uploadRouter = require('./routes/upload')

//--|--Admin
const adminRouter = require('./routes/admin')
const userAdminRouter = require('./routes/admin/user');
const roleAdminRouter = require('./routes/admin/role')
const submissionAdminRouter = require('./routes/admin/submission')
const departmentAdminRouter = require('./routes/admin/department')
const categoryAdminRouter = require('./routes/admin/category')

//--|--User
const profileRouter = require('./routes/user/profile')
const submissionRouter = require('./routes/user/submission')
const settingRouter = require('./routes/user/setting')
const clientRouter = require('./routes/user')
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

//Admin start
//--Admin
//--|--Dashboard
app.use('/admin', adminRouter)

//--|--Role
app.use('/admin/role', roleAdminRouter)

//--|--Department
app.use('/admin/department', departmentAdminRouter)

//--|--Submission
app.use('/admin/submission',submissionAdminRouter)
//--|--Category
app.use('/admin/category',categoryAdminRouter)
//--|--User
app.use('/admin/user', userAdminRouter)

//User Start
//--User
//--|--Client
app.use('/', clientRouter)

//--|--Profile
app.use('/profile',profileRouter)

//--|--Setting
app.use('/setting',settingRouter)

//--|--Submission
app.use('/submission' ,submissionRouter)

//User end

//Auth start
app.use('/', authRouter)
//Auth end 

//Upload start
app.use('/', uploadRouter)
//Upload end 

/**
 * Server Activation
 */
const port = 5000
app.listen(port, () => {
    console.log('Server running on port ' + port);
})

 
 
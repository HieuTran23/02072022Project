// App.js
/**
 * Required External Modules
 */
const express = require("express")
const mongoose = require('mongoose')
var bodyParser = require('body-parser');
const cookieParser = require("cookie-parser")
const path = require('path')
<<<<<<< HEAD
<<<<<<< HEAD

=======
const Role = require('./models/role')
>>>>>>> parent of 14e5ad2 (Revert "Merge branch 'category'")
=======
const Role = require('./models/role')
>>>>>>> parent of aef08d0 (Merge branch 'main' of https://github.com/HieuTran23/02072022Project)
//--Router
const authRouter = require('./routes/auth')
const adminRouter = require('./routes/admin')
const userRouter = require('./routes/admin/user');
const roleRouter = require('./routes/admin/role')
const submissionRouter = require('./routes/admin/submission')
<<<<<<< HEAD
const categoryRouter = require('./routes/admin/category')
=======
>>>>>>> parent of aef08d0 (Merge branch 'main' of https://github.com/HieuTran23/02072022Project)

const profileUser = require('./routes/user/index')
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
//Dashboard
app.use('/admin', adminRouter)

//Role
app.use('/admin/role', roleRouter)
<<<<<<< HEAD

//-----User
app.use('/user/profile',profileUser)

//--Admin

//submission
app.use('/admin/submission',submissionRouter)
 //category
app.use('/admin/category',categoryRouter)
=======

//-----User
app.use('/user/profile',profileUser)

//--Admin

//submission
app.use('/admin/submission',submissionRouter)

>>>>>>> parent of aef08d0 (Merge branch 'main' of https://github.com/HieuTran23/02072022Project)
//academic year
//Account
//app.use('/api/account', accountRouter)


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

 
 
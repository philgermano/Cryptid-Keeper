const express = require('express');
const app = express();
const Cryptid = require('./models/cryptids.js');
const User = require('./models/users.js')
require("dotenv").config();
const methodOverride = require('method-override');
const { render } = require('ejs');
const session = require('express-session');



const PORT = process.env.PORT||4000;
//set the view engine to ejs
app.set("view engine", "ejs");

const SESSION_SECRET = process.env.SESSION_SECRET
console.log('Here is the session secret')
console.log(SESSION_SECRET)
// now we can set up our session with our secret
app.use(session({
	secret: SESSION_SECRET,
	resave: false, // https://www.npmjs.com/package/express-session#resave
	saveUninitialized: false // https://www.npmjs.com/package/express-session#resave
}))

const mongoose = require('mongoose');
const mongoURI = process.env.MONGODB_URI
//     						ip addy:port/db name
mongoose.connect(mongoURI);
mongoose.connection.once('open', () => {
	console.log('connected to mongo');
});

// Connect to Mongo
mongoose.connect(mongoURI, () => {
  console.log('the connection with mongod is established')
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

const cryptidController = require('./controllers/cryptidController.js')
app.use('/cryptids', cryptidController)

const userController = require('./controllers/userController.js')
app.use('/users', userController)

//for css file later
app.use(express.static('public')) 

const authRequired = (req, res, next) => {
	if(req.session.currentUser.admin === true){
		next()
	} else {
		res.send('Restricted Access. Insufficent User Status.')
	}
}

//HOME
app.get("/", (req, res) => {
	res.render("home");
});

//INDEX
app.get('/cryptids', (req, res) => {
	user: req.session.currentUser;
    Cryptid.find({approved:true}, (error,cryptids)=>{
        res.render('index.ejs', { cryptids: cryptids });
        //res.send(cryptids)    
    })
});


//INDEXADMIN
app.get('/cryptidsadmin', (req, res) => {
	if(req.session.currentUser.admin === true){
		Cryptid.find({approved:false}, (error,cryptids)=>{
			res.render('index.ejs', { cryptids: cryptids });
			//res.send(cryptids)  
			//console.log(error);
		})
	} else {
		res.send('Restricted Access. Insufficent User Status.')
	}

});

app.listen(PORT, function () {
	console.log(`App is live at http://localhost:${PORT}/`);
});
const express = require('express');
const app = express();
const Cryptid = require('./models/cryptids.js');
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
//for css file later
app.use(express.static('public')) 

//INDEX
app.get('/cryptids', (req, res) => {
    Cryptid.find({}, (error,cryptids)=>{
        res.render('index.ejs', { cryptid: cryptid });
        //res.send(cryptids)    
    })
});

//INDEX ADMIN has stuff like delete and junk
//wold need to put the logon stuff in with restrictions and all that.
// app.get('/productsadmin', (req, res) => {
//     Product.find({}, (error,products)=>{
//         res.render('indexadmin.ejs', { products: products });
//         //res.send(products)    
//     })
// });

app.listen(PORT, function () {
	console.log(`App is live at http://localhost:${PORT}/`);
});
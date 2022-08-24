const express = require('express')
const app = express()

const Cryptid = require('./models/cryptids.js/index.js.js') 

const methodOverride = require('method-override')
const { render } = require('ejs');

const mongoose = require('mongoose');
//const { findByIdAndRemove } = require('./models/products.js');
// Global Configuration
const mongoURI = 'mongodb://localhost:27017/'+ 'products'
const db = mongoose.connection

// Connect to Mongo
mongoose.connect(mongoURI, () => {
  console.log('the connection with mongod is established')
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
const productController = require('./controllers/cryptidController.js')

app.use('/cryptids', cryptidController)
//for css file later
app.use(express.static('public')) 

//INDEX
app.get('/cryptid', (req, res) => {
    Cryptid.find({}, (error,products)=>{
        //res.render('index.ejs', { cryptid: cryptid });
        res.send(cryptid)    
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

app.listen(3000,function(){
    console.log('doing its thing')
})
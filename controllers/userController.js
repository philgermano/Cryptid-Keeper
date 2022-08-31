const express = require('express')
const bcrypt = require('bcrypt')

// we need our User model
const User = require('../models/users.js')

const router = express.Router()

router.get('/register', (req, res) => {
  res.render('users/register.ejs')
})


router.post('/register', (req, res) => {

    const salt = bcrypt.genSaltSync(10)

    req.body.password = bcrypt.hashSync(req.body.password, salt)
  
  

    User.findOne({username: req.body.username}, (err, userExists) => {
      if(userExists) {
        res.send('that username is taken')
      } else {
        User.create(req.body, (err, createdUser) => {
          // console.log(createdUser)
          // res.send('user created')
          req.session.currentUser = createdUser
          res.redirect('/cryptids')
        })
      }
    })
  })
  
  router.get('/signin', (req, res) => {
    res.render('users/signin.ejs')
  })
  
  router.post('/signin', (req, res) => {
    User.findOne({ username: req.body.username }, (err, foundUser) => {
      if (foundUser) {
        const validLogin = bcrypt.compareSync(req.body.password, foundUser.password)
        if (validLogin) {
          console.log("logged in", foundUser);
          req.session.currentUser = foundUser
          res.redirect('/cryptids')
        } else {
          res.send('Invalid username or password')
        }
      } else {
        res.send('Invalid username or password')
      }
    })
  })
  
  // DESTROY session route
  router.get('/signout', (req, res) => {
    // this destroy's the session
    req.session.destroy()
    res.redirect('/cryptids')
  })
  
  
  module.exports = router
  
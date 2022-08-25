const express = require('express');
const router=express.Router();
const Cryptid = require('../models/cryptids.js')

// NEW
router.get('/new', (req, res) => {
	res.render('new.ejs');
});

//SEED
// //#region 
// router.get('/seed', async (req, res) => {
//     const newCryptid =
// 		{name: "big foot", 
// 		description:"A large bipedal ape man reportedly seen throughout North America. Some claim that they are interdimensional beings who only visit our world for short periods of time. They are believed to stand 8 to 10 feet tall and possess immense strength.", 
// 		image:"https://i.imgur.com/TjGCSLV.jpg", 
// 		region:"North America",
// 		firstSightingLocation: "Bluff Creek, California", 
// 		yearFirstSeen: 1967,
// 		sightings: 10000,
// 		tags: ["ape", "bipedal", "north america", "interdimensional"] 
// 	}
  
//     try {
//       const seedItems = await Cryptid.create(newCryptid)
//       res.send(seedItems)
//     } catch (err) {
//       res.send(err.message)
//     }
//   })
//#endregion

//SHOW
router.get('/:id', async (req,res)=>{
    const cryptid = await Cryptid.findById(req.params.id);
    res.render('show.ejs', {
        cryptid: cryptid,
    })
})


// CREATE
router.post('/', (req, res) => {

	let tagSplit =req.body.tags.replace(/ +/g, " ").split(" ");

	const  cryptidToAdd = {
		name: req.body.name,
		description: req.body.description,
        image: req.body.image,
        region: req.body.region,
        yearFirstSeen: req.body.yearFirstSeen,
		region: req.body.region,
		sightings: req.body.sightings,
		tags: tagSplit,
	};

	Cryptid.create(req.body, (error, createdCryptid) =>{
		if (error){
			console.log("error", error);
			res.send(error)
		} else {
			res.redirect('/cryptids')
		}
	})
});

// EDIT
router.get('/:id/edit', (req, res) => {
	Cryptid.findById(req.params.id, (err, foundCryptid) => {
		res.render('edit.ejs', {cryptid: foundCryptid})
	})
})

// BUY
router.put('/:id/buy', (req, res) => {

	Cryptid.findByIdAndUpdate(req.params.id, {$inc: {qty: -1}}, {new:true}, (err, updatedModel) => {
		res.redirect('/cryptids')
	})
})

// UPDATE
router.put('/:id', (req, res) => {

	Cryptid.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedModel) => {
		res.redirect('/cryptids/'+req.params.id)
	})
})

// DESTROY
router.delete('/:id', (req, res) => {
	Cryptid.findByIdAndRemove(req.params.id, (err, data)=> {
		if(err) console.log(err)
		res.redirect('/cryptids')
	})
})

  module.exports = router
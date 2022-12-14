const { application } = require('express');
const express = require('express');
const router=express.Router();
const Cryptid = require('../models/cryptids.js')

const authRequired = (req, res, next) => {
	if(req.session.currentUser){
		if(req.session.currentUser.admin === true){
		next()
	}} else {
		res.redirect('/users/signin')
	}
}

// NEW
router.get('/new', (req, res) => {
	res.render('new.ejs');
});

//SEARCH
router.get('/search', (req,res)=>{
	try {  
		Cryptid.find({$or:[{tags:{$in:req.query.search.toLowerCase()}},{name:req.query.search}], approved:true},(err,foundEntries)=>{ 
		// console.log('in search');
		// res.send(found∏Entries)
		//res.send(foundEntries)
		if(err){  
		console.log(err);  
		}else{  
		res.render('results.ejs',{foundEntries:foundEntries});  
		}  
		})  
		} catch (error) {  
		console.log(error);  
		}  
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
	//res.send(cryptid)
})


// CREATE
router.post('/', (req, res) => {
	// let tagsLower = req.body.tags.toLowerCase();
	// console.log(tagsLower,"tags lower");
	let tagSplit =req.body.tags.replace(/ +/g, " ").split(", ");
	// console.log(tagSplit,"tags split");
	// console.log(typeof req.body.tags)
	// console.log(typeof tagSplit)  
	const  cryptidToAdd = {
		name: req.body.name,
		description: req.body.description,
        image: req.body.image,
        region: req.body.region,
        yearFirstSeen: req.body.yearFirstSeen,
		sightings: req.body.sightings,
		firstSightingLocation:req.body.firstSightingLocation,
		tags: tagSplit,
	};
	//console.log(tagSplit);

	Cryptid.create(cryptidToAdd, (error, createdCryptid) =>{
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


// UPDATE
router.put('/:id', (req, res) => {

	Cryptid.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedModel) => {
		res.redirect('/cryptids/'+req.params.id)
	})
})

// APPROVE
router.put('/:id/approve', (req, res) => {
	Cryptid.findByIdAndUpdate(req.params.id, {$set: {approved: true}}, {new:true}, (err, updatedModel) => {
		res.redirect('/cryptidsadmin')
	})
})

//COMMENT
router.put('/:id/comment', (req, res) => {
let name = null;
	if (req.session.currentUser){
		 name = req.session.currentUser.username
	}else {
		 name = "Anonymous";
	};
	
	Cryptid.findByIdAndUpdate(req.params.id, 
		{$push:{"comment":{username:name, date: new Date, message:req.body.message}}}
		, {new:true}, (err, updatedModel) => {
			res.redirect('/cryptids/'+req.params.id)
	})
})

// DESTROY
router.delete('/:id', authRequired, (req, res) => {
	Cryptid.findByIdAndRemove(req.params.id, (err, data)=> {
		if(err) console.log(err)
		res.redirect('/cryptids')
	})
})



  module.exports = router
const mongoose = require('mongoose')

// CREATE SCHEMA 
const cryptidsSchema = new mongoose.Schema({
	name:  { type: String, required: true },
    description: String,
    image: String,
    region: String,
    firstSightingYear: {type: Number, },
    sightings: {type: Number, min: [1,'Must have at least 1 of the item to stock']},
    firstSightingLocation: String,
    tags: [String]
	
});

// CREATE MODEL  
const Cryptid = mongoose.model('Cryptid', cryptidsSchema);

module.exports = Cryptid;



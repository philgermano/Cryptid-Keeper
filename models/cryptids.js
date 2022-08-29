const mongoose = require('mongoose')

// CREATE SCHEMA 
const cryptidsSchema = new mongoose.Schema({
	name:  { type: String, required: true },
    description: String,
    image: String,
    region: String,
    yearFirstSeen: Number,
    sightings: Number,
    firstSightingLocation: String,
    tags: [String],
    comment: [
        {username:String,
        date:Date,
    message:String}
    ]
});

// CREATE MODEL  
const Cryptid = mongoose.model('Cryptid', cryptidsSchema);

module.exports = Cryptid;



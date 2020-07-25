var mongoose = require('mongoose');
var Schema = mongoose.Schema;

categorySchem = new Schema({
    name: {type:String,trim:true},
    created_at: {type:Date,default:Date.now},
    image:{type:String}
})

category = mongoose.model('categories', categorySchem)
module.exports = category
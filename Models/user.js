var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    mobile: {type:Number,trim:true},
    address: {type:String},
    created_at: {type:Date, default:Date.now}
})

var user = mongoose.model('User',userSchema)
module.exports = user
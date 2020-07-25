var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var productSchema = new Schema({
    name: {type: String,trim:true},
    price: {type:Number,trim:true},
    category: {type:String,trim:true},
    image: {type:String},
    quantity: {type:Number},
    created_at: {type:Date,default:Date.now},
})

var product = mongoose.model('Products',productSchema)

module.exports = product;
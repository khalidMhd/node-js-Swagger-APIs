var mongoose = require('mongoose')
var Schema = mongoose.Schema

var orderSchema = new Schema({
    quantity: [],
    address:{type:String},
    user: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
    product: [{type:mongoose.Schema.Types.ObjectId, ref:'Products'}],
    created_at: {type:Date, default: Date.now}
})

var order = mongoose.model('Order',orderSchema)
module.exports = order
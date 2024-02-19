const mongoose =require('mongoose');

const customerSchema = new mongoose.Schema({
    id:Number,
    fullName:String,
    AccountNum:Number,
    Ballance:Number
})

const Customer=mongoose.model('Customer',customerSchema,'customer');
module.exports=Customer;
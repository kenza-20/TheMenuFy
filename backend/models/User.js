const mongo= require ('mongoose');
const { boolean } = require('yup');
const Schema=mongo.Schema;
const User = new Schema ({
    email: String , 
    password: String , 
    role:String,
    app:Boolean,
    confirmed:Boolean,
    isBlocked:Boolean

})
module.exports=mongo.model('user' , User);
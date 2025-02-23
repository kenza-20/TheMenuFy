const mongo= require ('mongoose');
const { boolean } = require('yup');
const Schema=mongo.Schema;
const User = new Schema ({
    email: String , 
    password: String , 
    role:String,
    validated:Boolean,
    confirmed:Boolean

})
module.exports=mongo.model('user' , User);
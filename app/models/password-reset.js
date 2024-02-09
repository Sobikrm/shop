const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// import uniqueString from 'unique-string';

const passwordReset = mongoose.Schema({
    email : {type : String , require : true},
    token : {type : String , require : true},
    use : {type : Boolean , default : false}
} , { timestamps : { updatedAt : false }});


module.exports = mongoose.model('PasswordReset' , passwordReset);
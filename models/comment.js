var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = new Schema({
    user: String,
    body: String
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('Comment', Comment);
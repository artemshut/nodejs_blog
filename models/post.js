var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var passportLocalMongoose = require('passport-local-mongoose');

var Post = new Schema({
    title: String,
    body: String
});

Post.plugin(passportLocalMongoose);

module.exports = mongoose.model('Post', Post);
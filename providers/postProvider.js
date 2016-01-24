var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

PostProvider = function(host, port) {
  this.db= new Db('node-mongo-blog', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


PostProvider.prototype.getCollection= function(callback) {
  this.db.collection('posts', function(error, post_collection) {
    if( error ) callback(error);
    else callback(null, post_collection);
  });
};

PostProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, post_collection) {
      if( error ) callback(error)
      else {
        post_collection.find().toArray(function(error, results) {
          if( error ) {
            callback(error)
          } else {
            callback(null, results)
          }
        });
      }
    });
};


PostProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, post_collection) {
      if( error ) callback(error)
      else {
        post_collection.findOne({_id: post_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

PostProvider.prototype.save = function(posts, callback) {
    this.getCollection(function(error, post_collection) {
      if( error ) callback(error)
      else {
        if( typeof(posts.length)=="undefined")
          posts = [posts];

        for( var i =0;i< posts.length;i++ ) {
          post = posts[i];
          post.created_at = new Date();
          if( post.comments === undefined ) post.comments = [];
          for(var j =0;j< post.comments.length; j++) {
            post.comments[j].created_at = new Date();
          }
        }

        post_collection.insert(posts, function() {
          callback(null, posts);
        });
      }
    });
};

exports.PostProvider = PostProvider;
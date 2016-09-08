// Read BackpackServer Repo code to understand bluebird promises

var express = require('express');
var Promise = require('bluebird');
var mongoose = require('mongoose');
mongoose.Promise = Promise;
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
Post.Promise = Promise;
Comment.Promise = Promise;
var router = express.Router();
var Promises = require('./HelperPromises');

// Return all posts
router.get('/', function(req, res, next) {
    Post.find(function (err, posts) {
        if(err) return next(err);
        res.status(200).json(posts);
    });
});

// Create an return post with _id
router.post('/', function(req, res, next) {
    var post = new Post(req.body.post);
    post.save(function(err, post) {
        if(err) return next(err);   // handle unknown internal server error
        res.status(201).json(post);
    });
});

// return post with given id + all comments associated with the post
router.get('/:post', function (req, res, next) {
    Promises.FindPostPromise(req.params.post)
        .then(function(post) {
            return Promises.PopulatePostPromise(post);
        })
        .then(function(post) {
            res.status(200).json(post);
        })
        .catch(function(err) {
            console.log(err);
            return next(err);
        });
});

// [Not tested, just an idea] I can also receive post object directly with request from client & call PostVoteHandlerPromise directly
// without retrieving a Post from MongoDB and save us some resources
router.put('/post/upvote', function(req, res, next) {
   Promises.FindPostPromise(req.body.id)
       .then(function(post) {
           return Promises.PostVoteHandlerPromise(post, 'upvote');
       })
       .then(function(post) {
           res.status(200).json(post);
       })
       .catch(function(err) {
           console.log(err);
           return next(err);
       });
});

router.put('/:post/downvote', function(req, res, next) {
   Promises.FindPostPromise(req.params.post)
       .then(function(post) {
           return Promises.PostVoteHandlerPromise(post, 'downvote');
       })
       .then(function(post) {
           res.status(200).json(post);
       })
       .catch(function(err) {
           console.log(err);
           return next(err);
       });
});

router.post('/:post/comments', function(req, res, next) {
    Promises.FindPostPromise(req.params.post)
        .then(function(post) {
            var comment = new Comment(req.body);
            comment.post = post._id;
            return [Promises.CommentSave(comment), post];
        })
        .spread(function(comment, post) {
            post.comments.push(comment._id);
            return [comment, Promises.PostSave(post)];
        })
        .spread(function(comment, post) {
            res.status(201).json(comment);
        })
        .catch(function(err) {
            console.log(err);
            return next(err);
        });
});

router.put('/comment/upvote', function(req, res, next) {
    Promises.FindCommentPromise(req.body.id)
        .then(function(comment) {
            return Promises.CommentVoteHandlerPromise(comment, 'upvote');
        })
        .then(function(comment) {
            res.status(200).json(comment);
        })
        .catch(function(err) {
            console.log(err);
            return next(err);
        });
});

router.put('/comments/:comment/downvote', function(req, res, next) {
    Promises.FindCommentPromise(req.params.comment)
        .then(function(comment) {
            return Promises.CommentVoteHandlerPromise(comment, 'downvote');
        })
        .then(function(comment) {
            res.status(200).json(comment);
        })
        .catch(function(err) {
            console.log(err);
            return next(err);
        });
});

module.exports = router;
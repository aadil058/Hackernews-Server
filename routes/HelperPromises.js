var Promise = require('bluebird');
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');


function error(status, message) {
    const error = new Error();
    error.status = status;
    error.message = message;
    return error;
}

module.exports = {

    FindPostPromise: function (id) {
        return new Promise(function (resolve, reject) {
            Post.findById(id, function (err, post) {
                (post === null) ? reject(error(404, "Post not found or some error occurred, Try again later or try with another post id")) : resolve(post);
            });
        });
    },

    FindCommentPromise: function (id) {
        return new Promise(function (resolve, reject) {
            Comment.findById(id, function (err, comment) {
                (comment === null) ? reject(error(404, "Comment not found, Maybe it is deleted")) : resolve(comment);
            });
        });
    },

    PopulatePostPromise: function (post) {
        return new Promise(function (resolve, reject) {
            post.populate('comments', function (err, post) {
                (post === null) ? reject(err) : resolve(post);
            });
        });
    },

    PostVoteHandlerPromise: function (post, mode) {
        return new Promise(function (resolve, reject) {
            if (mode === 'upvote') {
                post.upvote(function (err, post) {
                    (err === null) ? resolve(post) : reject(err);
                });
            }
            else if (mode === 'downvote') {
                post.downvote(function (err, post) {
                    (err === null) ? resolve(post) : reject(err);
                });
            }
        });
    },

    CommentVoteHandlerPromise: function (comment, mode) {
        return new Promise(function (resolve, reject) {
            if (mode === 'upvote') {
                comment.upvote(function (err, comment) {
                    (err === null) ? resolve(comment) : reject(err);
                });
            }
            else if (mode === 'downvote') {
                comment.downvote(function (err, comment) {
                    (err === null) ? resolve(comment) : reject(err);
                });
            }
        });
    },

    CommentSave: function(comment) {
        return new Promise(function(resolve, reject) {
            comment.save(function(err, comment) {
                if(err || comment === null)
                    reject(err);
                else
                    resolve(comment);
            });
        })
    },

    PostSave: function(post) {
        return new Promise(function(resolve, reject) {
            post.save(function(err, post) {
                if(err || post === null)
                    reject(err);
                else
                    resolve(post);
            });
        })
    }
};
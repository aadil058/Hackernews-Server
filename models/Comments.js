var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    comment: String,
    author: String,
    upvotes: { type: Number, default: 0 },
    post: { type: Schema.Types.ObjectId, ref: 'Post' }
});

CommentSchema.methods.upvote = function(callback) {
    this.upvotes += 1;
    this.save(callback);
};

CommentSchema.methods.downvote = function(callback) {
    this.upvotes -= 1;
    this.save(callback);
};

mongoose.model('Comment', CommentSchema);
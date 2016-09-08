var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    title: String,
    link: String,
    upvotes: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

PostSchema.methods.upvote = function(callback) {
    this.upvotes += 1;
    this.save(callback);
};

PostSchema.methods.downvote = function(callback) {
    this.upvotes -= 1;
    this.save(callback);
};

mongoose.model('Post', PostSchema);
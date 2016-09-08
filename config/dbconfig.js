module.exports = {
    'DB_URL' : 'mongodb://test:test@ds011314.mlab.com:11314/flapper_news',

    dbconnection: function (mongoose) {

        mongoose.connection.on('error', function () {
            console.log('database connection error');
        });

        mongoose.connection.once('open', function () {
            console.log('database connection open');
        });
    }
};
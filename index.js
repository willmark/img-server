var images= require('./lib');
exports.config = images.config;
images.createServer();
images.listen(function() {
    console.log('Server Started');
});

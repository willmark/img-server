var images= require('./lib');
config = images.config;
images.createServer();
images.listen(function() {
    console.log('Server Started');
});

img-server
============

> Stability - 2 Unstable

Services images to web services copying and/or manipulating the original image before caching the
resulting image in the image server respository.  This is useful for websites not wanting to put
all the image resources in the public directory.  In addition, the img-cache and img-canvas-helper
modules allow the source image to be manipulated prior to caching and serving using the following
format:

````
Html file example:
<img src="/images/100x150_resize_myimage.jpg">
````

Where:
   _resize_ indicates the image myimage.jpg should be resized to 
   *100x150* maximum width (100) and maximum height (150). 

See https://github.com/willmark/img-cache for details on image manipulation prior to caching

For expressjs applications, the router should redirect your image requests to this image server like
the following:
````
exports.images = function (req, res) {
    res.writeHead(303, {Location: 'http://<your listening host:port image server>' + req.url});
    res.end();
}
````

Assuming your route requests in your main app are configured to direct all requests for image resources
to the above redirect.  For example:

````
app.get(/images\//, routes.images);
````
The express *app* redirects all /images/ matches to the routes/index.js exports.images function above

You can install the image server via npm:

````
npm install img-server
````

To modify the configuration settings for the image source directory and destination resources for cached file,
modify your application startup for the image server like the following example:

````
img = require('img-server');
path = require('path');
img.config.srcdir=path.resolve(path.join(__dirname,'src'));
img.config.resources=path.resolve(path.join(__dirname,'dst'));
````
Where img.config is exported from the img-server module, and is where you can modify the configuration settings.


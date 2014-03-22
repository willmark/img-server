
/**
 * Default 404 handler
 */
var respond404 = function (req, res) {
    res.writeHead(404, {
        "Content-Type": "text/plain"
    });
    res.write(req.url + " not found");
    res.end();
};

/**
 * Caches image to the destination directory, performing an image transformation 
 * if appropriate first using the img-cache utility (see https://github.com/willmark/img-cache)
 */
var handleImage = function(req, res) {
    var url = require("url"),
        path = require("path"),
        file = url.parse(req.url).pathname,
        basename = path.basename(file),
        config = require.main.config,
        dstdir = path.resolve(config.resources),
        srcdir = config.srcdir;
    var ResourceReader = require("resource-reader").ResourceReader;
    var rr = new ResourceReader(dstdir, file);
    rr.on("noresource", function(err) {
        var imgc = require("img-cache");
        imgc.cacheImage(srcdir, dstdir, file, function(stat, err) {
            if (!stat) {
                console.log("not copied: " + err);
                respond404(req, res);
            } else {
                handleImage(req, res); //try it as a resource again
            }
        });
    });
    rr.on("ctype", function(ctype) {
        res.writeHead(200, {
            "Content-Type": ctype
        });
    });
    rr.on("error", function(err) {
        console.error(err);
    });
    rr.on("data", function(chunk) {
        res.write(chunk);
    });
    rr.on("end", function() {
        res.end();
    });
};

module.exports = function(req, res) {
    handleImage(req, res);
}

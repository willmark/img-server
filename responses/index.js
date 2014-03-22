/**
 * Validate file exists
 * usage:
 *     file - String path of file to check
 */
function isValidFile(file) {
    try {
        return fs.statSync(file).isFile();
    } catch (err) {
        return false;
    }
}

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
 * Handles reading a resource file and piping the results to response stream
 * file - path to the resources
 * req - http request
 * res - http response
 */
var respondImage = function(req, res) {
    var fs = require("fs"),
        url = require("url"),
        path = require("path"),
        config = require.main.config,
        reqpath = url.parse(req.url).pathname,
        file = path.join(config.resources, reqpath),
        imgext = path.extname(reqpath).replace('.',''),
        rs = require("fs").createReadStream(file);
    rs.pipe(res);
    rs.on("error", function(errpipe) {
        console.error(errpipe);
        throw errpipe;
    });
    res.writeHead(200, {
        "Content-Type": "image/" + imgext
    });
    rs.on("end", function() {
        res.end();
    });
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
        dstdir = path.dirname(path.join(config.resources, file)),
        srcdir = config.srcdir, 
        imgc = require("img-cache");
    imgc.cacheImage(srcdir, dstdir, basename, function(stat, err) {
        if (!stat) {
            console.log("not copied: " + err);
            respond404(req, res);
        } else {
            respondImage(req, res);
        }
    });
}

module.exports = function(req, res) {
    handleImage(req, res);
}

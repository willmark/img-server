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
respond404 = function (req, res) {
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
respondImage = function(req, res) {
    fs = require("fs");
    url = require("url");
    reqpath = url.parse(req.url).pathname;
    file = path.join(resources, reqpath);
    rs = require("fs").createReadStream(file);
    rs.pipe(res);
    rs.on("error", function(errpipe) {
        console.error(errpipe);
        throw errpipe;
    });
    res.writeHead(200, {
        "Content-Type": "text/plain"
    });
    rs.on("end", function() {
        res.end();
    });
};

/**
 * Caches image to the destination directory, performing an image transformation 
 * if appropriate first using the img-cache utility (see https://github.com/willmark/img-cache)
 */
handleImage = function(req, res) {
    file = url.parse(req.url).pathname;
    basename = path.basename(file);
    dstdir = path.dirname(path.join(resources, file));
    srcdir = config.srcdir; 
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

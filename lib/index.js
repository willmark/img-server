var util = require("util");

var argv = require("optimist").argv;

var url = require("url");

var fs = require("fs");

var http = require("http");

var path = require("path");

var hostname = argv.hostname || "localhost";

var hostport = argv.url || "http://localhost:0";

hostport = hostport.match(/http/) ? url.parse(hostport) : url.parse("http://" + hostport);

//supports only http
var port = hostport.port;

var host = hostport.hostname;

var defaultRoot = __dirname;

var configFile = path.resolve(path.join(defaultRoot, '..', 'config.json'));

var defaultResources = path.resolve(path.join(defaultRoot, '..', 'resources'));

var defaultResponses = path.resolve(path.join(defaultRoot, '..', 'responses'));

var defaultImageResponses = path.resolve(path.join(defaultRoot, '..', 'responses', 'images'));

var defaultImageResources = path.resolve(path.join(defaultRoot, '..', 'resources', 'images'));

var config = JSON.parse(require('fs').readFileSync(configFile));
require.main.config = config;

if (!config.srcdir) {
    throw new Error('Unable to serve images. No srcdir provided');
}

//fully resolve srcdir path
if (config.srcdir !== path.resolve(config.srcdir)) {
    config.srcdir = path.resolve(path.dirname(require.main.filename), config.srcdir);
}

config.resources = config.resources || defaultResources;
config.responses = config.responses || defaultResponses;

if (config.responses !== defaultResponses) {
    console.warn('Default responses location bypassed.  Be sure to see <img-server location>/responses/index.js file for handling caching and manipulating image files on your own.');
}

var handler = require("http-handler").init({
    responses: path.resolve(config.responses),
    resources: path.resolve(config.resources)
});

/**
 * http request handler (see https://github.com/willmark/http-handler)
 */
function handleRequest(req, res) {
    handler.respond(req, res, function(statusCode, err) {
        switch (statusCode) {
          case 200:
            console.log("Completed request successfully: " + req.url);
            break;
          case 403:
            console.warn("Forbidden: " + req.url);
            break;
          case 404:
            console.warn("URL not found: " + req.url);
            break;
          case 500:
            console.warn("500 error dev: " + err);
            break;
          default:
            console.error("Unknown status: " + statusCode);
            console.error("Unknown error: " + err);
            break;
        }
    });
}

var server;
var createImageServer = function () {
    server = http.createServer(function(req, res) {
console.log('img req ', req.url);
        handleRequest(req, res);
    });
};
var imageListen = function(cb) {
    server.listen(port, host, function() {
        util.puts("> " + server.address().address + " running on port " + server.address().port);
        cb(server.address());
    });
};

module.exports = {
    config: config,
    createServer: function() {
        createImageServer();
    },
    listen: function(cb) {
        imageListen(cb);
    },
    close: function() {
        return server.close();
    }
};

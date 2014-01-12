http = require('http');
fs = require('fs');

var imgserver;

exports.noConfigThrows = function(a) {
    a.expect(1);
    fs.renameSync('./config.json', './config.bk.json');
    a.throws(function() {
       require('./lib');
    });
    a.done();
};

exports.goodConfig = function(a) {
    fs.renameSync('./config.bk.json', './config.json');
    a.expect(1);
    imgserver=require('./lib');
    config = imgserver.config;
    imgserver.createServer();
    a.ok(true);
    a.done();
};

exports.response200 = function(a) {
     imgserver.listen(function(address) {
        a.expect(1);
        address.path = "/images/test.jpg";
        http.get(address, function(res) {
            res.on('data', function (chunk) {
            });
            res.on('end', function (chunk) {
                imgserver.close();
                a.ok(res.statusCode === 200);
                //a.ok(chunk.toString() === '/images/file2 not found');
                a.done();
            });
        }); 
    });
};

exports.response200Resize150x150 = function(a) {
     imgserver.listen(function(address) {
        a.expect(1);
        address.path = "/images/150x150_resize_test.jpg";
        http.get(address, function(res) {
            res.on('data', function (chunk) {
            });
            res.on('end', function (chunk) {
                imgserver.close();
                a.ok(res.statusCode === 200);
                //a.ok(chunk.toString() === '/images/file2 not found');
                a.done();
            });
        }); 
    });
};

exports.response404 = function(a) {
     imgserver.listen(function(address) {
        a.expect(2);
        address.path = "/images/file2";
        http.get(address, function(res) {
            res.on('data', function (chunk) {
                imgserver.close();
                a.ok(res.statusCode === 404);
                a.ok(chunk.toString() === '/images/file2 not found');
                a.done();
            });
        }); 
    });
};

var express = require('express');
var app = express();
var fs = require("fs");

app.get('/listClasses', function (req, res) {
   fs.readFile( __dirname + "/" + "classes.json", 'utf8', function (err, data) {
    res.end( data );
   });
})

// change port number to process.env.PORT when ready to deploy
var server = app.listen(process.env.PORT, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})
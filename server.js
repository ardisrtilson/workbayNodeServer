var express = require('express');
const axios = require('axios');
var app = express();
var fs = require("fs");
const fetch = require("node-fetch");

app.get('/listClasses', function (req, res) {
   fs.readFile( __dirname + "/" + "classes.json", 'utf8', function (err, data) {
    res.end( data );
   });
})

app.get('/uniqueSkills', function (req, res) {
   fs.readFile( __dirname + "/" + "uniqueSkills.json", 'utf8', function (err, data) {
   console.log(res)
    res.end( data );
   });
})

app.use('/', function (req, res, next) {
   try{
   fs.readFile( __dirname + "/" + "classes.json", 'utf8', function (err, data) {
   parsedData = JSON.parse(data)
   let flattenedClasses = [].concat.apply([], parsedData.classes)
   let classesArray = []
   let searchString = req.query.id
   for (let i = 0; i < flattenedClasses.length; i++) {
       for (let j = 0; j < flattenedClasses[i].classificationId.length; j++) {
           if (flattenedClasses[i].classificationType[j] === "SKILL" && flattenedClasses[i].classificationName[j].toUpperCase() === searchString.toUpperCase()){
               classesArray.push(flattenedClasses[i])
           }
   }
}
   res.end( JSON.stringify(classesArray) )
   })} catch{console.log(error)}
})

// change port number to process.env.PORT when ready to deploy
var server = app.listen(process.env.PORT, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})
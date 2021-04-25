var express = require('express');
const axios = require('axios');
var app = express();
var fs = require("fs");
const fetch = require("node-fetch");

app.get('/endpointC', function (req, res) {
   fs.readFile( __dirname + "/" + "classes.json", 'utf8', function (err, data) {
    res.end( data );
   });
})

app.get('/endpointA', function (req, res) {
   fs.readFile( __dirname + "/" + "uniqueSkills.json", 'utf8', function (err, data) {
   console.log(data)
    res.end( data );
   });
})

app.get('/', function (req, res) {
    res.end( 'Hi there, welcome to my demo web service, created using Node, Express, and Javascript. If you would like to see a list of all the unique skills in the LinkedIn database, go to https://pacific-plateau-77351.herokuapp.com/endpointA. If you want to see a list of classes by skill name, go to https://pacific-plateau-77351.herokuapp.com/endpointB?id=<YOUR SKILL QUERY HERE, NO ANGLES>. If you want to a see a list of all 8484 classes available in the Linkedin database, go to https://pacific-plateau-77351.herokuapp.com/endpointC' );
   });

app.use('/endpointB', function (req, res, next) {
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
   res.end( JSON.stringify(classesArray, ['id', 'title', 'type', 'urn', 'availability', 'description', 'shortDescription', 'classificationId', 'classificationName', 'classificationType', 'courseURL', 'AICCURL' ], '   ') )
   })} catch{console.log(error)}
})

// change port number to process.env.PORT when ready to deploy
var server = app.listen(process.env.PORT, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})

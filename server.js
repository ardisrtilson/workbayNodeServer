var express = require('express');
var app = express();
var fs = require("fs");

app.get('/', function (req, res) {
   fs.readFile(__dirname + "/" + "hello.txt", 'utf8', function (err, data) {
      res.end(data);
   })
})

app.get('/endpointA', function (req, res) {
   fs.readFile(__dirname + "/" + "uniqueSkills.json", 'utf8', function (err, data) {
      res.end(data);
   })
})

app.use('/endpointB', function (req, res, next) {
   try {
      fs.readFile(__dirname + "/" + "classes.json", 'utf8', function (err, data) {
         parsedData = JSON.parse(data)
         let flattenedClasses = [].concat.apply([], parsedData.classes)
         let classesArray = []
         let searchString = req.query.id
         for (let i = 0; i < flattenedClasses.length; i++) {
            for (let j = 0; j < flattenedClasses[i].classificationId.length; j++) {
               if (flattenedClasses[i].classificationType[j] === "SKILL" && flattenedClasses[i].classificationName[j].toUpperCase() === searchString.toUpperCase()) {
                  classesArray.push(flattenedClasses[i])
               }
            }
         }

         // A lotta work just to make the endpoint data pretty
         res.end(JSON.stringify(classesArray, ['id', 'title', 'type', 'urn', 'availability', 'description', 'shortDescription', 'classificationId', 'classificationName', 'classificationType', 'courseURL', 'AICCURL'], '   '))
      })
   } catch { console.log(error) }
})

app.get('/endpointC', function (req, res) {
   fs.readFile(__dirname + "/" + "classes.json", 'utf8', function (err, data) {
      res.end(data);
   })
})

app.get('/mockData', function (req, res) {
   fs.readFile(__dirname + "/" + "mockData.json", 'utf8', function (err, data) {
      res.end(data);
   })
})

// Set port to local port for debugging. Set to process.env.PORT when ready to deploy. 
var server = app.listen(process.env.PORT, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Listening @", host, port)
})

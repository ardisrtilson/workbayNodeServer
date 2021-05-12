const { query } = require('express');
var express = require('express');
var app = express();
var fs = require("fs");
const { type } = require('os');
const { Recoverable } = require('repl');

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

app.use('/users', function (req, res, next) {
   try {
      fs.readFile(__dirname + "/" + "mockData.json", 'utf8', function (err, data) {
         parsedData = JSON.parse(data)
         filteredData = parsedData
         if (req.query.sort != undefined) {
            filteredData = filteredData.sort(function (a, b) {
            if (a[`${req.query.sort}`] != undefined && b[`${req.query.sort}`] != undefined) {
               var textA = a[`${req.query.sort}`].toUpperCase();
               var textB = b[`${req.query.sort}`].toUpperCase();
               return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            } else {
               return null
            }
            })
         }

         if (req.query.email != undefined && req.query.email != "") {
            filteredData = filteredData.filter(fd => fd.email === req.query.email)
         }

         let unpagedCount = filteredData.length

         if (req.query.pageSize != undefined) {
            filteredData = []
            if (req.query.pageNumber === undefined) {
               req.query.pageNumber = 0
            }
            for (let i = 0; i < req.query.pageSize; i++) {
               filteredData.push(parsedData[i + req.query.pageSize * (req.query.pageNumber)])
            }
         }

         if (req.query.sortOrder != undefined){
            if (req.query.sortOrder === "desc"){
            if (req.query.sort === undefined || req.query.sort === ""){
               filteredData = filteredData.sort(function(b, a) {
                  if (a.id !== b.id) {
                      return a.id - b.id
                  }
                  if (a.name === b.name) {
                    return 0;
                  }
                  return a.name > b.name ? 1 : -1;
              })
            }
            else{
            filteredData = filteredData.sort(function (b, a) {
               if (a[`${req.query.sort}`] != undefined && b[`${req.query.sort}`] != undefined) {
                  var textA = a[`${req.query.sort}`].toUpperCase();
                  var textB = b[`${req.query.sort}`].toUpperCase();
                  return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
               } else {
                  return null
               }
               })}
         }
      }
         let finalObject = {
            count: unpagedCount,
            value: filteredData
         }
         res.end(JSON.stringify(finalObject, null, '        '))
      })
   } catch { console.log(error) }
})

// Set port to local port for debugging. Set to process.env.PORT when ready to deploy. 
var server = app.listen(process.env.PORT, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Listening @", host, port)
})

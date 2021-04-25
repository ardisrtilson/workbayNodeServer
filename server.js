var express = require('express');
const axios = require('axios');
var app = express();
var fs = require("fs");
const fetch = require("node-fetch");

async function filterClasses(searchString){
   try {
     return getClasses().then(res => {
     let classesArray = []
     let flattenedClasses = [].concat.apply([], res.data)
     for (let i = 0; i < flattenedClasses.length; i++) {
         for (let j = 0; j < flattenedClasses[i].classificationId.length; j++) {
             if (flattenedClasses[i].classificationType[j] === "SKILL" && flattenedClasses[i].classificationName[j].toUpperCase() === searchString.toUpperCase()){
                 classesArray.push(flattenedClasses[i])
             }
     }
 }
 return classesArray
}
)} catch{console.log(error.response.body);}
}

async function getClasses() {
   try {
     const response = await axios.get('http://localhost:8000/classes')
     return response
   } catch (error) {
     console.log(error.response.body);
   }}

app.get('/listClasses', function (req, res) {
   fs.readFile( __dirname + "/" + "classes.json", 'utf8', function (err, data) {
    res.end( data );
   });
})

app.get('/uniqueSkills', function (req, res) {
   fs.readFile( __dirname + "/" + "uniqueSkills.json", 'utf8', function (err, data) {
    res.end( data );
   });
})

app.use('/', async (req, res, next) => {
   try{const filters = req.query;
   let classes = await filterClasses(filters.id).then(res=> res)
   let prettyClasses = JSON.stringify(classes)
   res.send(prettyClasses)
   next()}
   catch(error){console.log(error)}
});

// change port number to process.env.PORT when ready to deploy
var server = app.listen(5000, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})
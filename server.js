var express = require('express');
var app = express();
var fs = require("fs");

app.get('/courses', function (req, res) {
   fs.readFile(__dirname + "/" + "courses.json", 'utf8', function (err, data) {
      res.end(data);
   })
})

const port = 5000;
// Set port to local port for debugging. Set to process.env.PORT when ready to deploy. 
app.listen(port, () => {
  console.log('Express server listening on port', port)
});

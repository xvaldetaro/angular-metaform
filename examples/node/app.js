var express = require('express'),
    bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/../../'));

var port = process.env.PORT || 3000;

app.listen(port);

console.log('Server started.  Running at http://localhost:' + port);
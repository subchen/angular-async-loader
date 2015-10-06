var express = require('express');
var app = express();

app.use('/', express.static(__dirname + '/webapp'));
app.use('/assets', express.static(__dirname + '/node_modules'));

app.listen(8080, function() {
    console.log('listening on http://localhost:8080/');
});

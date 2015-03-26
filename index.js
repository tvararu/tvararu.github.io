var path = require('path');
var express = require('express');
var compression = require('compression');

var app = express();

// Enable gzip compression.
app.use(compression());

app.use('/', express.static(path.resolve(__dirname, 'dist')));
app.listen(3000);

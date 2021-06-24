var express = require('express');
var app = express();

app.use(express.static(__dirname));

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

app.listen(process.env.PORT || 10666);

console.log('Сервер стартовал!');
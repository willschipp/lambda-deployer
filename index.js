var express = require('express');
var fs = require('fs');
var app = express();

app.use('/js',express.static(__dirname + '/app/js'));
app.use('/css',express.static(__dirname + '/app/css'));
app.use('/bower_components',express.static(__dirname + '/bower_components'));
app.use('/img',express.static(__dirname + '/app/img'));
app.use('/partials',express.static(__dirname + '/app/partials'));

app.use(require('body-parser').urlencoded({extended:true}));
app.use(require('body-parser').json());

app.get('/',function(req,res) {
  res.sendFile(__dirname + '/app/index.html');
});

app.use('/api',require('./api'));


app.listen(3000,function() {
  console.log('running...');
  if (!fs.existsSync(__dirname + '/tmp')) {
    fs.mkdirSync(__dirname + '/tmp');
  }
});

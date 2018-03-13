var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var async = require('async');

app.use(bodyParser.json());

//app.use(express.bodyParser());


app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var folder = './casey/';
var filenames = [];

app.get('/', function(req, res){
     console.log('GET /')
     var html = '<html><body><h1> From rpi!!!!</h1></body></html>';
     res.writeHead(200, {'Content-Type': 'text/html'});

     filenames = [];
     fs.readdirSync(folder).forEach(file => {
        filenames.push(file);
      })

     async.eachSeries(
        // Pass items to iterate over
        filenames,
        // Pass iterator function that is called for each item
        function(filename, cb) {
          fs.readFile(filename, function(err, content) {
            if (!err) {
              res.write(content);
            }
            // Calling cb makes it go to the next item.
            cb(err);
          });
        },
        // Final callback after each item has been iterated over.
        function(err) {
          res.end()
        //   res.end(html);
        }
      );
     
});

const URLregex = /-.+[^//]/;


app.post('/', function(req, res){
    //TODO check for known fingerprint (me | Dom | alark | noopur)
    console.log('POST /');
    console.log(req.headers.referer);

    var name = URLregex.exec(req.headers.referer)
    name = name[0].substring(1);;

    fs.writeFile('./'+ name + '/' + new Date().getTime() + name + '.json', JSON.stringify(req.body), function(err) {     
        if(err) {
            return console.log(err);
        }  
        console.log("The file was saved!");
    }); 

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('thanks');
});

port = 3000;
app.listen(port);
console.log('Listening at http://localhost:' + port);
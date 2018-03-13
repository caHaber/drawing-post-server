var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.json());

//app.use(express.bodyParser());


app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function(req, res){
    console.log('GET /')
     //var html = '<html><body><form method="post" action="http://localhost:3000">Name: <input type="text" name="name" /><input type="submit" value="Submit" /></form></body>';
     var html = '<html><body><h1> From rpi!!!!</h1></body></html>';
     res.writeHead(200, {'Content-Type': 'text/html'});
     res.end(html);
});

const URLregex = /-.+[^//]/;


app.post('/', function(req, res){
    //TODO check for known fingerprint (me | Dom | alark | noopur)
    console.log('POST /');
    // console.log(req.body);
    console.log(req.headers.referer);
    
    var name = URLregex.exec(req.headers.referer)
    name = name.substring(1);;
    // console.log(dir);

    fs.writeFile('./'+ name + '/' + new Date().getTime() + name + '-.json', JSON.stringify(req.body), function(err) {     
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
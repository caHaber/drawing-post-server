var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var async = require('async');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database/sketches.db');
var viz = require('./viz.js');

app.use(bodyParser.json());

var total;

db.all('SELECT * FROM MAIN',function(err,rows){
    // console.log(rows.length);
    total = rows.length;
    // console.log(err);
});

app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var filenames = [];

var style = 
`<style type="text/css">

.line{
    fill: none;
    // stroke: #ffab00;
    // stroke-width: 3;
}

</style>`

app.get('/', function(req, res){
     console.log('GET /')
     var html = '<html><body><h1> Error!!!!</h1></body></html>';
     res.writeHead(200, {'Content-Type': 'text/html'});
     var person = req.query.p;   

     var statement = 'SELECT * FROM MAIN where NAME=?';

    db.all(statement, person, function(err,rows){
        if(err) {
            res.write(html);
            console.log(err);
            res.end();
        } 
        else {
            var svg = '<html>' + style + '<body>' + viz.generate(rows) +'</body></html>'    
            res.write(svg);
            // console.log(rows);
            // rows.forEach(function(d){
                
            //     if(d.Sketch != null){
            //         // console.log(JSON.parse(d.Sketch));
            //         res.write(d.Sketch);
            //     }
                   
            // });   
            res.end();
        }
        
    });
   
});

const URLregex = /-.+[^//]/;

app.post('/', function(req, res){
    //TODO check for known fingerprint (me | Dom | alark | noopur)
    // console.log('POST /');
    // console.log(req.headers.referer);

    var name = URLregex.exec(req.headers.referer)
    name = name[0].substring(1);;

    total++;

    var Sketch,width,height,strokewidth,color,timestamp;

    // console.log(r)
    Sketch = JSON.stringify(req.body.lineSegs);
    width = req.body.width;
    height = req.body.height;
    strokewidth = req.body.strokeWidth;
    color = req.body.strokeColor.toString();
    timestamp = new Date().toUTCString();
    
    try {
        db.run("INSERT INTO MAIN VALUES(?,?,?,?,?,?,?,?)", [
            total,
            name,
            Sketch,
            width,
            height,
            strokewidth,
            color,
            timestamp]);
    }catch(err){
        console.log(err);
    }

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('thanks');
});

port = 3000;
app.listen(port);
console.log('Listening at http://localhost:' + port);
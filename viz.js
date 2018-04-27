
var d3 = require("d3");
var hex = require("d3-hexbin");
var jsdom = require("jsdom");
var { JSDOM } = jsdom;


var margin = {width:25,
    height: 100}


    var height = 600,
        width = 500;

exports.generate = function(data){

    // var svg = d3.select("body").apppend("svg");

    data.forEach(function(d){
        var parsed = JSON.parse(d.Sketch);

        try {
            parsed = eval("(" + parsed + ")");
        }catch (e){
            // console.log(e)
            // Probably should set e to null or something
        }   
        d.Sketch = parsed;
    });

    data = data.filter(function(d){ return d.timestamp !== null});



    const dom = new JSDOM();   


    var svg = d3.select(dom.window.document.body).append("svg").append("svg")
        .attr("version", "1.1")
        .attr("xmlns", d3.namespaces.svg)
        .attr("xmlns:xlink", d3.namespaces.xlink)
        .attr("width", width)
        .attr("height", height);

        svg.append("g").attr("class","title").attr("transform","translate(0,50)")
            .append("text")
            .text("Casey's Last Month");
        // .attr("viewBox", "0 0 " + width + " " + height);

    return drawData(svg, data).node().outerHTML;
}

function drawData(svg,data) {
    if(data === null)
        return svg;


    drawHexbins(svg,data);

    return svg;
}




function drawHexbins(svg,data)
{

    var hexbin = hex.hexbin();
    var cellSize = 70;



    hexbin.radius(35);

    function xA(d) {
        return d3.timeWeek.count(d3.timeYear(d), d) * cellSize;
    }


    function yA(d) {
       return d.getDay() * cellSize;
    }

    function getMinus1month(){
        var d = new Date();
        // d = d.now();
        d.setMonth(d.getMonth()-1)
        return d;
    }

    // var g = svg.append("g").attr("class","hexgroup").attr("transform", function(d){return "translate(" + margin.width + "," + margin.height + ")"; });

    var timeDays = d3.timeDays(getMinus1month(), new Date()); 

    // svg.attr("transform","scale(.5) translate(-300,-300)");

    var g = svg.append("g")
    .attr("transform", function(d){return "translate(" + (margin.width)  + "," + (margin.height) + ")"; })
    .attr("fill", "none")
    .attr("stroke", "black");

var hexes = g  
  .selectAll("path")
  .data(timeDays)
  .enter()
    .append("g")
    .attr("class",function(d){return "day x" + (d.getMonth() + "x" + d.getDate()) } )
    .attr("transform", function(d,i) {return "translate(" + (xA(d) -800)  + "," + (+yA(d)) + ")";  });

hexes    
    .append("clipPath")
    .attr("id", function(d){return "x" + (d.getMonth() + "x" + d.getDate())} )   
    .append("path")
    .attr("d", hexbin.hexagon())
    .attr("data-elem", function(d){return d})
    .attr("fill","grey")
    .attr("class",function(d,i){return"hexClip"});

hexes .append("path")
.attr("d", hexbin.hexagon())
.attr("data-elem", function(d){return d})
.attr("fill","grey")
.attr("class",function(d,i){return"hex"});    

    // .attr("x", function(d) { return d3.timeWeek.count(d3.timeYear(d), d) * cellSize; })
    // .attr("y", function(d) { return d.getDay() * cellSize; })
    // .datum(d3.timeFormat("%Y-%m-%d"));





    // console.log(timedata);
    // console.log(hexbin(timedata));

      data.forEach(function(h){    
          var time = new Date(h.timestamp);  
          var timeString = "x"+(time.getMonth() + "x" + time.getDate());

        var line = d3.line()
        .x(function(d) { return (d.x - h.Sketch[0].x) *.2 - 30; })
        .y(function(d) { return (d.y - h.Sketch[0].y) *.2; });

        if(h !== null && h.Sketch !== null){
            var color = h.color.split(',');

            var day = svg.select("." + timeString);
            // console.log(day);

            day.append("path")
                .datum(h.Sketch)
                .attr("clip-path","url(#" + timeString + ")")
                .attr("class",function(d){return"line x" + (time.getMonth() + "x" + time.getDate()) })
                .attr("stroke-width", 1)
                .attr("stroke", 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + color[3] + ')')
                .attr("d",line);
                // .attr("transform", "translate(" + (  +xA(time)  - 30 - 800) + "," + (yA(time) ) + ")")
                
        }    
    })

}


// function mapSketch(sketch) {
//     sketch.map(function)

// }

var d3 = require("d3");
var hex = require("d3-hexbin");
var jsdom = require("jsdom");
var { JSDOM } = jsdom;


var margin = {width: 50,
    height: 50}


    var height = 800,
        width = 600;

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
        .attr("height", height)
        .attr("viewBox", "0 0 " + width + " " + height);

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



    hexbin.radius(30);

    function xA(d) {
        return d3.timeWeek.count(d3.timeYear(d), d) * cellSize
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

    var timedata = d3.timeDays(getMinus1month(), new Date()); 

    svg.attr("transform","scale(.5) translate(-300,-300)");

    var g = svg.append("g")
    .attr("transform", function(d){return "translate(" + (margin.width)  + "," + (margin.height - height + 50) + ")"; })
    .attr("fill", "none")
    .attr("stroke", "red");

g  
  .selectAll("path")
  .data(timedata)
  .enter().append("path")
    // .attr("width", cellSize)
    // .attr("height", cellSize)
    .attr("transform", function(d,i) { return "translate(" + yA(d) + "," + xA(d) + ")";  })
    .attr("d", hexbin.hexagon())
    .attr("data-elem", function(d){return d})
    // .attr("x", function(d) { return d3.timeWeek.count(d3.timeYear(d), d) * cellSize; })
    // .attr("y", function(d) { return d.getDay() * cellSize; })
    .datum(d3.timeFormat("%Y-%m-%d"));



    var line = d3.line()
        .x(function(d) { return (d.x); })
        .y(function(d) { return (d.y); });

    // console.log(timedata);
    // console.log(hexbin(timedata));

      data.forEach(function(h){        
        console.log(h);
        if(h !== null && h.Sketch !== null){
            var color = h.color.split(',');
            g.append("path")
                .datum(h.Sketch)
                .attr("class","line")
                .attr("stroke-width", h.strokewidth)
                .attr("stroke", 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + color[3] + ')')
                .attr("d",line)
                .attr("transform", "scale(.6) translate(" + (yA(new Date(h.timestamp))) + "," + (xA(new Date(h.timestamp)) ) + ")")
                
        }    
    })

}


// function mapSketch(sketch) {
//     sketch.map(function)

// }
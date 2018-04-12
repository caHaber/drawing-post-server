
var d3 = require("d3");
var jsdom = require("jsdom");
var { JSDOM } = jsdom;

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



    const dom = new JSDOM();   

    var height = 1000,
        width = 600;

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

    var line = d3.line()
        .x(function(d) { return (d.x); })
        .y(function(d) { return (d.y); });

    data.forEach(function(h){        
        if(h !== null && h.Sketch !== null){
            var color = h.color.split(',');
            svg.append("path")
                .datum(h.Sketch)
                .attr("class","line")
                .attr("stroke-width", h.strokewidth)
                .attr("stroke", 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + color[3] + ')')
                .attr("d",line);
                
        }

       
    })


    return svg;
}


// function mapSketch(sketch) {
//     sketch.map(function)

// }
window.onload = init;

var transformMap = {};
var formatTime,leftAxis;

function init(){

    injectd3code()

    var scale = d3.scaleBand()
        .domain(["SUN","MON","TUE","WED","THR","FRI","SAT"])
        .range([0,500]);

    console.log("frontend");
    formatTime = d3.timeFormat("%b/%d");
    leftAxis = d3.axisLeft(scale);

    var bins = d3.selectAll(".day");

    d3.select("svg").attr("transform", "scale(2.5) translate(200,200)")
.append("g")
    .attr("transform", "translate(10,57)")
    .call(leftAxis);

    d3.selectAll(".hex")
        .transition().attr("fill","white");

        bins.on("touchstart", touchstart);

}

function injectd3code(){
    d3.selection.prototype.moveToFront = function() {  
        return this.each(function(){
          this.parentNode.appendChild(this);
        });
      };
      d3.selection.prototype.moveToBack = function() {  
          return this.each(function() { 
              var firstChild = this.parentNode.firstChild; 
              if (firstChild) { 
                  this.parentNode.insertBefore(this, firstChild); 
              } 
          });
      };
}



function transitionShape(me, hex){

    var d0 = hex ? "m0,-35l30.31088913245535,17.499999999999996l3.552713678800501e-15,35l-30.31088913245535,17.500000000000007l-30.31088913245535,-17.499999999999986l-1.7763568394002505e-14,-34.999999999999986z" : "m-50,-100l100,0l0,200l-100,0l0,-200z";

    me.transition().duration(500)
    .on("start", function repeat() {
        d3.active(this)
        .attrTween("d", pathTween(d0, 4));
    });
}

function touchstart(){
    var me = d3.select(this);
    var day = me.attr("class").split(' ')[1];

    console.log(me);

    var gday = d3.select("g." + day);

    

   




    var clip = gday.select("clipPath").select("path");
    // var d1 = clip.attr("d");





    if(!gday.classed("focus")){
        gday.moveToFront();

        //Set original position using data-elem
        gday.attr("data-elem", function(d){
            return this.getAttribute("transform") } );


        gday
        .transition()
        .attr("transform", function(d){
            return "translate(150,250) scale(2)";
        });

        transitionShape(clip, false);
        transitionShape(gday.select(".hex"), false);
        //Set for me
        me.attr("data-elem", function(d){
            return this.getAttribute("transform") } );

        me.transition().attr("fill","white")
        .attr("transform", function(d){
            return "translate(150,250) scale(2)";
        });


        var lines = gday.selectAll("path.line");

        lines.each(function(d,i){
            console.log(i,"lines");
            d3.select(this).transition().attr("transform","translate(0," + ((i * 20) - 50) + ")");
        })
    

        var text = gday.append("g").attr("class","info").attr("transform","translate(-45,-80)");
        text.classed("hide",false);
        text.append("text")

        .text(formatTime(new Date(gday.select(".hex").attr("data-elem")) ));
        text.moveToFront();




        gday.classed("focus",true);
    } else {
        gday.moveToFront();   
        gday.select("g.info").remove();

        

        gday
        .transition()
        .attr("transform", function(d){
            return this.getAttribute("data-elem");
        });

        var lines = gday.selectAll("path.line");

        lines.each(function(d,i){
            console.log(i,"lines");
            d3.select(this).transition().attr("transform","translate(0,0)");
        })

        transitionShape(clip, true);
        transitionShape(gday.select(".hex"), true);

        me.transition().attr("fill","white")
        .attr("transform", function(d){
            return this.getAttribute("data-elem");
        });
        gday.classed("focus",false);
    }
   
}

function pathTween(d1, precision) {
    return function() {
      var path0 = this,
          path1 = path0.cloneNode(),
          n0 = path0.getTotalLength(),
          n1 = (path1.setAttribute("d", d1), path1).getTotalLength();
  
      // Uniform sampling of distance based on specified precision.
      var distances = [0], i = 0, dt = precision / Math.max(n0, n1);
      while ((i += dt) < 1) distances.push(i);
      distances.push(1);
  
      // Compute point-interpolators at each distance.
      var points = distances.map(function(t) {
        var p0 = path0.getPointAtLength(t * n0),
            p1 = path1.getPointAtLength(t * n1);
        return d3.interpolate([p0.x, p0.y], [p1.x, p1.y]);
      });
  
      return function(t) {
        return t < 1 ? "M" + points.map(function(p) { return p(t); }).join("L") : d1;
      };
    };
  }
window.onload = init;

function init(){

    console.log("frontend");

    var hexs = d3.selectAll(".hex");

    hexs
        .transition().attr("fill","green");

    hexs.on("touchstart", touchstart);

}

function touchstart(){
    var me = d3.select(this);
    var day = me.attr("class").split(' ')[1];

    console.log(me);

    d3.selectAll("." + day)
    .transition()
    .attr("transform", function(d){
        return this.getAttribute("transform") +
                     " scale(6)";
    });


    me.transition().attr("fill","white")
    .attr("transform", function(d){
        return this.getAttribute("transform") +
                     " scale(6)";
    });
}
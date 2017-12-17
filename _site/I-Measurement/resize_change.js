
d3.select(window)
    		.on("resize", sizeChange);

function sizeChange() {
        // Map1
        svgMap1.attr("transform", "scale(" + $(".container").width()/900 + ")");
        svg1.style("height",$(".container").width()*0.7)
        svgLegend1.attr("transform", "translate(100,"+ $(".container").width()*0.45 +")");
        // Map2
  	    svgMap2.attr("transform", "scale(" + $(".container").width()/900 + ")");
        svg2.style("height",$(".container").width()*0.7)
        svgLegend2.attr("transform", "translate(100,"+ $(".container").width()*0.45 +")");

	};

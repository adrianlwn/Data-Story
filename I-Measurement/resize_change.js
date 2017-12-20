
d3.select(window)
    		.on("resize", sizeChange);

function sizeChange() {
        // Map1
        svgMap1.attr("transform", "scale(" + $(".container").width()/900 + ")");
        svg1.attr("height",$(".container").width()*0.7)
        svgLegend1.attr("transform", "translate(100,"+ $(".container").width()*0.51 +")");
        // Map2
  	    svgMap2.attr("transform", "scale(" + $(".container").width()/900 + ")");
        svg2.attr("height",$(".container").width()*0.7)
        svgLegend2.attr("transform", "translate(100,"+ $(".container").width()*0.51 +")");

        // Map3
        svgMap3.attr("transform", "scale(" + $(".container").width()/900 + ")");
        svg3.attr("height",$(".container").width()*0.7)
        svgLegend3.attr("transform", "translate(100,"+ ($(".container").width()*0.51 ) +")");

        // Map4
        svgMap4.attr("transform", "scale(" + $(".container").width()/900 + ")");
        svg4.attr("height",$(".container").width()*0.7)
        svgLegend4.attr("transform", "translate(100,"+ ($(".container").width()*0.51 ) +")");

	};

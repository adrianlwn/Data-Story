
var all_data;
var color_scale;
var width = 1080,
    height = 520;

var fill_opacity_normal = 1,
    fill_opacity_highlight = 0.5;

var width_line_normal = 0.7,
    width_line_highlight = 1.5;

var dropped_countries = ["ATA"]

var q = d3.queue()
q.defer(d3.json,"/I-Measurement/measurement.json")
q.await(function(error, results) {
      if (error) throw error;
      all_data = results;
      // Initial display of the map
      updateMap("Nigeria_2015");
    });
/*
d3.json("/I-Measurement/measurement.json", function(all_data) {
  console.log(data);
  return data
});
*/


var svgMap = d3.select("#map") //.attr("width","80%").attr("margin","0 auto")
  .append("svg")
  .attr("width","100%")
  .append("g");
  //.attr("width",width)
  //.attr("height",height);


var projection = d3.geoMercator()
  .scale(130)
  .center([0, 60 ])
  .rotate([-10,0]);


var path = d3.geoPath()
  .projection(projection);


function fill_color(d,variableSelected) {
  if (  dropped_countries.indexOf(d.id) != -1 ) {
    return null
  }
  var data_event = all_data[variableSelected];
  return color_scale(data_event[d.id])
};

// Function that creates a color scale
function create_scale(variableSelected) {

  var data_event = all_data[variableSelected];
  var tweets = d3.values(data_event).sort(function(a, b){return a-b});
  console.log(tweets);
  color_scale = d3.scaleLog()
    .domain([d3.quantile(tweets,0.95), d3.quantile(tweets,1)])
    .range(['black', 'red']);
  console.log(color_scale(6000));
};


function strocke_width(d) {
  if (dropped_countries.indexOf(d.id) != -1) {
    console.log(d.id);
    return "0"
  }
  return width_line_normal
};



function updateMap(variableSelected) {

  create_scale(variableSelected);


  d3.json("/topojson/world/countries.json", function(error, world) {
    if (error) throw error;
          // remove old elements
          svgMap.selectAll("path").remove();
          svgMap.selectAll("path")
          .data(topojson.feature(world, world.objects.units).features)
          .enter().append("path")
          .attr("d", path)
          .attr("class", "country")
          .style("fill",  function(d) {return fill_color(d,variableSelected)}
            )
          .style("stroke", "white")
          .style("stroke-width", function(d) {return strocke_width(d)}
            )
          .on('mouseover', function(d, i) {
                //d3.select(this).style('fill', 'black');
                d3.select(this).style('fill-opacity', fill_opacity_highlight);
                d3.select(this).style('stroke-width', width_line_highlight);
              }
            )
          .on('mouseout', function(d, i) {
                  d3.select(this).style('stroke-width', width_line_normal);
                  d3.select(this).style('fill-opacity', fill_opacity_normal);

              }
            );

  });
}


function updateLegend(variableSelected) {
    // bind data
    var ordinal = d3.scaleOrdinal()
      .domain(codes[variableSelected].keys)
      .range(codes[variableSelected].values);

    svgLegend.append("g")
      .attr("class", "legendOrdinal")
      .attr("transform", "translate(20,20)");

    var legendOrdinal = d3.legendColor()
        .shapePadding(10)
        .orient("vertical")
        .shapeWidth(30)
        .shapeHeight(10)
        .scale(ordinal)
        .labels(codes[variableSelected].labels)
        .title(codes[variableSelected].title);

    svgLegend.select(".legendOrdinal")
      .call(legendOrdinal);

    // remove old elements
    svgLegend.exit().remove();
}
// generate initial legend
//updateLegend("var1");

// select variable for which to display a legend
d3.select("#variable")
  .on("change", function() {
    var variableName = document.getElementById("variable").value;
    //updateLegend(variableName);
    updateMap(variableName);
});

d3.select(window)
    		.on("resize", sizeChange);

function sizeChange() {
	    d3.select("g").attr("transform", "scale(" + $(".container").width()/900 + ")");
	    $("svg").height($(".container").width()*0.7);
      console.log($(".container").width());
	}

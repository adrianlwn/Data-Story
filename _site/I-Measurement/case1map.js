
// Global Variables :
var width = 1080,
    height = 520;

var fill_opacity_normal = 1,
    fill_opacity_highlight = 0.5;

var width_line_normal = 0.7,
    width_line_highlight = 1.5;

var dropped_countries = ["ATA"]


// Tooltip :

var tooltip1 = d3.select("#map1").append("div")
    .attr("class", "mytooltip")
    .style("display", "none");

// Map

var svg1 = d3.select("#map1") //.attr("width","80%").attr("margin","0 auto")
  .append("svg")
  .attr("width","100%")
var svgMap1 = svg1.append("g");

var projection = d3.geoMercator()
  .scale(130)
  .center([0, 60 ])
  .rotate([-10,0]);

var path = d3.geoPath()
  .projection(projection);

// Legend :
var svgLegend1 = svg1.append("g").attr("class", "legendJenks")
  .attr("transform", "translate(60,"+$ (".container").width()*0.45 +")");

function diplay_scale() {

  var legend = d3.legendColor()
    .labelFormat(d3.format(".2f"))
    .labels(mylabels)
    .scale(color_scale);
    svgLegend1.call(legend);
}







function fill_color(all_data,d,variableSelected,normalized) {
  console.log(normalized);
  if (  dropped_countries.indexOf(d.id) != -1 ) {
    return 'FloralWhite'
  }
  var data_event = all_data[variableSelected];

  if (data_event[d.id] == null){
    return 'LightGrey'

  }
  return color_scale(data_event[d.id])
};

// Function that creates a color scale
function create_scale(all_data,all_raw_data,variableSelected,normalized) {

  var data_event = all_data[variableSelected];
  var data_raw_event = all_raw_data[variableSelected];

  var tweets = d3.values(data_event).sort(function(a, b){return a-b});
  var tweets_raw = d3.values(data_raw_event).sort(function(a, b){return a-b});

  var k = 8;
  jenks_sets = ss.ckmeans(tweets,k);

  var total_length = 0;
  var jenks_bins = new Array(k)
  mylabels = new Array(k+1)
  mylabels[0] = "Less than 0"
  for (var i = 0; i < jenks_sets.length; i++) {
    jenks_bins[i] = d3.min(jenks_sets[i])
    mylabels[i+1] = tweets_raw[total_length+1] + " to " + tweets_raw[total_length + jenks_sets[i].length]
    total_length = total_length + jenks_sets[i].length;
  }
  mylabels[k] = "More than " + d3.max(tweets_raw)

  var jenks_colors = d3.schemeYlGnBu[k+1];

  color_scale = d3.scaleThreshold()
      .domain(jenks_bins)
      .range(jenks_colors);
  console.log(color_scale(0));
};


function strocke_width(d) {
  if (dropped_countries.indexOf(d.id) != -1) {
    return "0"
  }
  return width_line_normal
};



function updateMap(variableSelected,normalized) {
  var mylabels;
  var path_json;
  var raw_data;
  var all_data;
  var jenks_sets;


  var path_normalized_json = "/I-Measurement/measurement_norm.json";
  var path_json = "/I-Measurement/measurement.json";
  if (normalized == 'tweet_normalized'){
    var path_output_json = path_normalized_json;
  }
  else {
    var path_output_json = path_json
  }
  d3.json(path_json, function(error, all_raw_data) {
  d3.json(path_output_json, function(error, all_data) {
  create_scale(all_data,all_raw_data,variableSelected,normalized);

  d3.json("/topojson/world/countries.json", function(error, world) {
    if (error) throw error;
          // remove old elements
          svgMap1.selectAll("path").remove();
          svgMap1.selectAll("path")
          .data(topojson.feature(world, world.objects.units).features)
          .enter().append("path")
          .attr("d", path)
          .attr("class", "country")
          .style("fill",  function(d) {return fill_color(all_data,d,variableSelected,normalized)}
            )
          .style("stroke", "FloralWhite")
          .style("stroke-width", function(d) {return strocke_width(d)}
            )
          .on('mouseover', function(d, i) {
                d3.select(this).style("stroke", "FloralWhite")
                  .style("fill",  function(d) {
                        return d3.rgb(fill_color(all_data,d,variableSelected,normalized)).brighter(0.1).toString() });
                tooltip1.style("display", "inline");
              })
          .on('mousemove',function(d,i) {
                var coordinates = d3.mouse(this.parentNode)
                tooltip1.style("left", (coordinates[0] * $(".container").width()/900 + 19) + "px")
                        .style("top", (coordinates[1] * $(".container").width()/900 - 70 ) + "px");
                tooltip1.select("h5").remove();
                tooltip1.selectAll("h6").remove();
                tooltip1.append("h5").text(all_data['name'][d.id])
                tooltip1.append("h6").text("Tweets : "+ all_raw_data[variableSelected][d.id])
                tooltip1.append("h6").text("Population : "+ all_raw_data['POP'][d.id])
          })
          .on('mouseout', function(d, i) {
                  d3.select(this)//.style('stroke-width', width_line_normal)
                    .style("fill",  function(d) {return fill_color(all_data,d,variableSelected,normalized)})
                    .style("stroke", "FloralWhite");
                  tooltip1.style("display", "none");
              }
            );
            diplay_scale()
          });
        });
      });
}

// select variable for which to display a legend
d3.select("#event1")
  .on("change", function() {
    var variableName = document.getElementById("event1").value;
    var normalized = document.getElementById("normalized1").value;

    //updateLegend(variableName);
    updateMap(variableName,normalized);
});

d3.select("#normalized1")
  .on("change", function() {
    var variableName = document.getElementById("event1").value;
    var normalized = document.getElementById("normalized1").value;
    //updateLegend(variableName);
    updateMap(variableName,normalized);
});

d3.select(window)
    		.on("resize", sizeChange);

function sizeChange() {
	    d3.select("g").attr("transform", "scale(" + $(".container").width()/900 + ")");
	    $("svg").height($(".container").width()*0.7);
      svgLegend1.attr("transform", "translate(100,"+ $(".container").width()*0.45 +")");

	};

  updateMap("Orlando",'tweet_normalized');

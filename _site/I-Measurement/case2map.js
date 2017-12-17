
// Global Variables :
var width = 1080,
    height = 520;

var fill_opacity_normal = 1,
    fill_opacity_highlight = 0.5;

var width_line_normal = 0.7,
    width_line_highlight = 1.5;

var dropped_countries = ["ATA"]


// Tooltip :

var tooltip2 = d3.select("#map2").append("div")
    .attr("class", "mytooltip")
    .style("display", "none");

// Map

var svg2 = d3.select("#map2") //.attr("width","80%").attr("margin","0 auto")
  .append("svg")
  .attr("width","100%")
var svgMap2 = svg2.append("g");

var projection = d3.geoMercator()
  .scale(130)
  .center([0, 60 ])
  .rotate([-10,0]);

var path = d3.geoPath()
  .projection(projection);

// Legend :
var svgLegend2 = svg2.append("g").attr("class", "legendJenks")
  .attr("transform", "translate(60,"+$ (".container").width()*0.45 +")");

function diplay_scale2(color_scale) {
  mylabels = new Array(jenks_sets.length+1)
  var form = d3.format(",.2r")
  mylabels[0] = "Less than " + form(d3.min(jenks_sets[0]))
  for (var i = 0; i < jenks_sets.length; i++) {
    mylabels[i+1] = form(d3.min(jenks_sets[i]))  + " to " + form(d3.max(jenks_sets[i]))
  }
  mylabels[jenks_sets.length] = "More than " + form(d3.max( jenks_sets[jenks_sets.length-1]))

  var legend = d3.legendColor()
    .labels(mylabels)
    .scale(color_scale);
    svgLegend2.call(legend);
}


function fill_color2(all_data,d,variableSelected,normalized,color_scale) {
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
function create_scale2(all_data,variableSelected,normalized) {
  k = 8;

  var data_event = all_data[variableSelected];
  var tweets = d3.values(data_event).sort(function(a, b){return a-b});

  jenks_sets = ss.ckmeans(tweets,k);

  var total_length = 0;
  var jenks_bins = new Array(k)

  for (var i = 0; i < jenks_sets.length; i++) {
    jenks_bins[i] = d3.min(jenks_sets[i])
  }

  var jenks_colors = d3.schemeYlGnBu[k+1];
  return d3.scaleThreshold()
      .domain(jenks_bins)
      .range(jenks_colors);
};


function strocke_width2(d) {
  if (dropped_countries.indexOf(d.id) != -1) {
    return "0"
  }
  return width_line_normal
};



function updateMap2(variableSelected,normalized) {
  var mylabels;
  var path_json;
  var raw_data;
  var all_data;
  var jenks_sets;
  var color_scale;


  var form = d3.format(",")



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
  color_scale = create_scale2(all_data,variableSelected,normalized);

  d3.json("/topojson/world/countries.json", function(error, world) {
    if (error) throw error;
          // remove old elements
          svgMap2.selectAll("path").remove();
          svgMap2.selectAll("path")
          .data(topojson.feature(world, world.objects.units).features)
          .enter().append("path")
          .attr("d", path)
          .attr("class", "country")
          .style("fill",  function(d) {return fill_color2(all_data,d,variableSelected,normalized,color_scale)}
            )
          .style("stroke", "FloralWhite")
          .style("stroke-width", function(d) {return strocke_width2(d)}
            )
          .on('mouseover', function(d, i) {
                d3.select(this).style("stroke", "FloralWhite")
                  .style("fill",  function(d) {
                        return d3.rgb(fill_color2(all_data,d,variableSelected,normalized,color_scale)).brighter(0.1).toString() });
                tooltip2.style("display", "inline");
              })
          .on('mousemove',function(d,i) {
                var coordinates = d3.mouse(this.parentNode)
                tooltip2.style("left", (coordinates[0] * $(".container").width()/900 + 19) + "px")
                        .style("top", (coordinates[1] * $(".container").width()/900 - 70 ) + "px");
                tooltip2.select("h5").remove();
                tooltip2.selectAll("h6").remove();
                tooltip2.append("h5").text(all_data['name'][d.id])
                tooltip2.append("h6").text("Tweets : "+ form(all_raw_data[variableSelected][d.id]))
                tooltip2.append("h6").text("Population : "+ form(all_raw_data['POP'][d.id]))
          })
          .on('mouseout', function(d, i) {
                  d3.select(this)//.style('stroke-width', width_line_normal)
                    .style("fill",  function(d) {return fill_color2(all_data,d,variableSelected,normalized,color_scale)})
                    .style("stroke", "FloralWhite");
                  tooltip2.style("display", "none");
              }
            );
            diplay_scale2(color_scale)
          });
        });
      });
}

// select variable for which to display a legend
d3.select("#event2")
  .on("change", function() {
    var variableName = document.getElementById("event2").value;
    var normalized = document.getElementById("normalized2").value;

    //updateLegend(variableName);
    updateMap2(variableName,normalized);
});

d3.select("#normalized2")
  .on("change", function() {
    var variableName = document.getElementById("event2").value;
    var normalized = document.getElementById("normalized2").value;
    //updateLegend(variableName);
    updateMap2(variableName,normalized);
});


  updateMap2("Orlando",'tweet_normalized');

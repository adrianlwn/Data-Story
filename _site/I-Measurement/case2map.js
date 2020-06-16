
// Global Variables :
var width = 1080,
    height = 520;

var fill_opacity_normal = 1,
    fill_opacity_highlight = 0.5;

var width_line_normal = 0.7,
    width_line_highlight = 1.5;

var dropped_countries = ["ATA"]

// Title Map :

var titleMap2 = d3.select("#map2").append("div")
.attr("class", "mytitle");


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
  mylabels[0] = form(d3.min(jenks_sets[0])) + " or less"
  for (var i = 0; i < jenks_sets.length; i++) {

    var min = form(d3.min(jenks_sets[i]))
    var max = form(d3.max(jenks_sets[i]))
    if (max != min ) {
      mylabels[i+1] = min  + " to " + max
    }
    else {
        mylabels[i+1] = min
    }

  }
  mylabels[jenks_sets.length] = form(d3.min( jenks_sets[jenks_sets.length-1])) + " and more"

  var legend = d3.legendColor()
    .labels(mylabels)
    .scale(color_scale)
    svgLegend2.call(legend);
}


function fill_color2(all_data,d,variableSelected,normalized,color_scale) {
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
  k = 8
  var all_data_event = new Array(0)
  for (var i = 0; i < event_information.length; i++) {
    all_data_event = all_data_event.concat(d3.values(all_data[event_information[i].name]));
  }
  console.log(all_data_event);

  var tweets = d3.values(all_data_event).sort(function(a, b){return a-b});
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



  var path_normalized_json = "/Tweet-Awareness-Data-Story//I-Measurement/measurement_norm.json";
  var path_json = "/Tweet-Awareness-Data-Story/I-Measurement/measurement.json";
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
          svgMap2.selectAll("circle").remove();


          // Map Title :
          var coordinatesTitle = [420,15]
          var full_name = event_information.filter(function(d){ if (d.name == variableSelected) {return d.full_name}})[0]['full_name']
          titleMap2.selectAll("h1").remove()
          titleMap2.selectAll("h3").remove()

          titleMap2.style("left", (coordinatesTitle[0] * $(".container").width()/900 ) + "px")
                  .style("top", (coordinatesTitle[1] * $(".container").width()/900 ) + "px")
          if (normalized == "tweet_normalized"){
            titleMap2.append('h1').append('h1').text('Normalized Distribution')
          }
          else {
            titleMap2.append('h1').text('Tweet Distribution')
          }
          titleMap2.append('h3').style("font-weight", "900").text(full_name);

          // The map
          svgMap2.selectAll("path")
          .data(topojson.feature(world, world.objects.units).features)
          .enter().append("path")
          .attr("d", path)
          .attr("class", "country")
          .style("fill",  function(d) {return fill_color2(all_data,d,variableSelected,normalized,color_scale)}
            )
          .style("stroke", "LightGrey")
          .style("stroke-width", function(d) {return strocke_width2(d)}
            )
          .on('mouseover', function(d, i) {
                d3.select(this).style("stroke", "LightGrey")
                  .style("fill",  function(d) {
                        return d3.rgb(fill_color2(all_data,d,variableSelected,normalized,color_scale)).brighter(0.1).toString() });
                tooltip2.style("display", "inline");
              })
          .on('mousemove',function(d,i) {
                var coordinates = d3.mouse(this.parentNode)
                tooltip2.style("left", (coordinates[0] * $(".container").width()/900 + 19) + "px")
                        .style("top", (coordinates[1] * $(".container").width()/900 - 105 ) + "px");
                tooltip2.select("h5").remove();
                tooltip2.selectAll("h6").remove();
                tooltip2.selectAll("p").remove();
                tooltip2.append("h5").text(all_data['name'][d.id])
                if (normalized == "tweet_normalized"){
                  tooltip2.append("h6").text("Normalized : " + d3.format(".2f")(all_data[variableSelected][d.id]))
                }
                tooltip2.append("h6").text("Tweets : "+ form(all_raw_data[variableSelected][d.id]))
                tooltip2.append("h6").text("Average Tweets : "+ form(all_raw_data['average'][d.id]))
                tooltip2.append("h6").text("Population : "+ form(all_raw_data['POP'][d.id]))

          })
          .on('mouseout', function(d, i) {
                  d3.select(this)//.style('stroke-width', width_line_normal)
                    .style("fill",  function(d) {return fill_color2(all_data,d,variableSelected,normalized,color_scale)})
                    .style("stroke", "LightGrey");
                  tooltip2.style("display", "none");
              }
            );
            diplay_scale2(color_scale)
            // Add events on the map :
            svgMap2.selectAll("circle")
                .data(event_information).enter()
                .append("circle")
                .attr("cx", function (d) { return  projection([d.location[1],d.location[0]])[0] })
                .attr("cy", function (d) { return  projection([d.location[1],d.location[0]])[1] })
                .attr("r", "3px")
                .attr("name", function (d) {return d.name})
                .attr("selected",function (d) {
                  if (variableSelected == d.name) { return "True" ;}
                  else { return "False" ;  }})
                .attr("fill", function (d) {
                  if (variableSelected == d.name) { return "Red" ;}
                  else { return "rgba(0,0,0,0)" ;  }
                })
                .attr("fill-opacity",1)
                .attr("stroke-width",1.5)
                .attr("stroke",function (d) {
                  if (variableSelected == d.name) { return "Red " ;}
                  else { return "Red" ;  }
                })
                .on('mouseover', function(d, i) {
                  d3.select(this)
                    //.style("stroke", "LightGrey");
                    .attr("r", "6px");
                    tooltip2.style("display", "inline");


                })
                .on('mouseout', function(d, i) {
                  d3.select(this)
                    //.style("stroke", "LightGrey");
                    .attr("r","3px");
                    tooltip2.style("display", "none")
                            .style("height","")
                            .style("background","")
                            .style("color","");

                })
                .on('mousemove',function(d,i) {
                      var coordinates = d3.mouse(this.parentNode)
                      tooltip2.style("height", "285px")
                              .style("background", "rgba(255,10,10,0.7)")
                              .style("color","#EEE")
                              .style("left", (coordinates[0] * $(".container").width()/900 + 19) + "px")
                              .style("top", (coordinates[1] * $(".container").width()/900 - 290 ) + "px");
                      tooltip2.select("h5").remove();
                      tooltip2.selectAll("h6").remove();
                      tooltip2.selectAll("p").remove();

                      tooltip2.append("h5").style("font-size","18px").text(event_information[i]['full_name']);
                      tooltip2.append("h6").text('Date : ' +event_information[i]['date'])
                      tooltip2.append("h6").text( 'Country : ' +event_information[i]['country'])
                      tooltip2.append("h6").text('Total Tweets : ' + form(event_information[i]['total_tweets']))
                      tooltip2.append("h6").text( 'Death : ' + event_information[i]['death'])
                      tooltip2.append("h6").text('Injured : ' + event_information[i]['injured'])

                      tooltip2.append("p").attr('align',"justify").text(event_information[i]['description']);
                })
                .on('click', function(d){
                    updateMap2(d.name,d3.select('input[name="normalized2"]:checked').attr('value'));
                })
          });
        });
      });
}



d3.selectAll('#radio2').selectAll('input')
  .on("change", function() {
    var normalized = d3.select(this).attr('value');
    var event_selected = svgMap2.selectAll("circle").filter( function(d) { return d3.select(this).attr("selected") == "True" ;}).attr("name");
    //updateLegend(variableName);
    updateMap2(event_selected,normalized);
});


  updateMap2("Orlando",'natural');

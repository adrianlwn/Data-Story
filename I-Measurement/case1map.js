// Global Variables :
var width = 1080,
    height = 520;

var fill_opacity_normal = 1,
    fill_opacity_highlight = 0.5;

var width_line_normal = 0.7,
    width_line_highlight = 1.5;

var dropped_countries = ["ATA"]

var event_information = [
              { 'name' :'Charlie-Hebdo',
                'full_name': "Charlie Hebdo Attack",
                'location': [48.864,2.349],
                'description': "Blah Blah Paris Attack Terrible ",
                'date': "7 January 2015"},
              { 'name' :'Nigeria_2016',
                'full_name': "Nigeria Dalori Attack",
                'location': [11.333,12.65],
                'description': "Blah Blah Dalori Attack Terrible ",
                'date': "30 January 2016"},
              { 'name' : 'Bruxelles',
                'full_name': "Bruxelles Airport Attack",
                'location': [50.901,4.484],
                'description': "Blah Blah Bruxelles Attack Terrible ",
                'date': "22 March 2016"},
            { 'name': 'Pakistan',
              'full_name': "Lahore Bombing Attack",
              'location': [31.516,74.290],
              'description': "Blah Blah Pakistan Attack Terrible ",
              'date': "27 March 2016"},
            { 'name' : 'Orlando',
              'full_name': "Orlando Nightclub Shooting",
              'location': [28.519,-81.376],
              'description': "Blah Blah Orlando Attack Terrible ",
              'date': "27 March 2016"},
            { 'name' : 'Istanbul',
              'full_name': "Istanbul Airport Shooting",
              'location': [40.976,28.814],
              'description': "Blah Blah Istanul Attack Terrible ",
              'date': "28 June 2016"},
            { 'name': 'Nigeria_2015',
              'full_name': "Nigeria Baga Massacre",
              'location': [13.119, 13.856],
              'description': "Blah Blah Boko Haram Attack Terrible ",
              'date': "08 January 2015"},
            { 'name': 'Lebanon' ,
            'full_name': "Jabal Mohsen Suicide Attacks",
              'location': [34.433, 35.85],
              'description': "Blah Blah Liban Attack Terrible ",
              'date': "10 January 2015"}
            ]


console.log(event_information);

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

function  diplay_scale(color_scale){
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
    svgLegend1.call(legend);
}


function fill_color(all_data,d,variableSelected,normalized,color_scale) {
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
function create_scale(all_data,variableSelected,normalized) {
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


function strocke_width(d) {
  if (dropped_countries.indexOf(d.id) != -1) {
    return "0"
  }
  return width_line_normal
};



function updateMap1(variableSelected,normalized) {
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
  color_scale = create_scale(all_data,variableSelected,normalized);


  d3.json("/topojson/world/countries.json", function(error, world) {
    if (error) throw error;
          // remove old elements
          svgMap1.selectAll("path").remove();
          svgMap1.selectAll("circle").remove();

          // Main Map :

          svgMap1.selectAll("path")
          .data(topojson.feature(world, world.objects.units).features)
          .enter().append("path")
          .attr("d", path)
          .attr("class", "country")
          .style("fill",  function(d) {return fill_color(all_data,d,variableSelected,normalized,color_scale)}
            )
          .style("stroke", "LightGrey")
          .style("stroke-width", function(d) {return strocke_width(d)}
            )
          .on('mouseover', function(d, i) {
                d3.select(this).style("stroke", "LightGrey")
                  .style("fill",  function(d) {
                        return d3.rgb(fill_color(all_data,d,variableSelected,normalized,color_scale)).brighter(0.1).toString() });
                tooltip1.style("display", "inline");
              })
          .on('mousemove',function(d,i) {
                var coordinates = d3.mouse(this.parentNode)
                tooltip1.style("left", (coordinates[0] * $(".container").width()/900 + 19) + "px")
                        .style("top", (coordinates[1] * $(".container").width()/900 - 80 ) + "px");
                tooltip1.select("h5").remove();
                tooltip1.selectAll("h6").remove();
                tooltip1.append("h5").text(all_data['name'][d.id])
                tooltip1.append("h6").text("Tweets : "+ form(all_raw_data[variableSelected][d.id]))
                tooltip1.append("h6").text("Population : "+ form(all_raw_data['POP'][d.id]))
          })
          .on('mouseout', function(d, i) {
                  d3.select(this)//.style('stroke-width', width_line_normal)
                    .style("fill",  function(d) {return fill_color(all_data,d,variableSelected,normalized,color_scale)})
                    .style("stroke", "LightGrey");
                  tooltip1.style("display", "none");
              }
            );
            diplay_scale(color_scale)
            // Add events on the map :
            svgMap1.selectAll("circle")
                .data(event_information).enter()
                .append("circle")
                .attr("cx", function (d) { return  projection([d.location[1],d.location[0]])[0] })
                .attr("cy", function (d) { return  projection([d.location[1],d.location[0]])[1] })
                .attr("r", "2px")
                .attr("name", function (d) {return d.name})
                .attr("selected",function (d) {
                  if (variableSelected == d.name) { return "True" ;}
                  else { return "False" ;  }})
                .attr("fill", function (d) {
                  if (variableSelected == d.name) { return "Red" ;}
                  else { return "rgba(0,0,0,0)" ;  }
                })
                .attr("fill-opacity",1)
                .attr("stroke",function (d) {
                  if (variableSelected == d.name) { return "Red " ;}
                  else { return "Red" ;  }
                })
                .on('mouseover', function(d, i) {
                  d3.select(this)
                    //.style("stroke", "LightGrey");
                    .style("r", "5px");
                    tooltip1.style("display", "inline");


                })
                .on('mouseout', function(d, i) {
                  d3.select(this)
                    //.style("stroke", "LightGrey");
                    .style("r","2px");
                    tooltip1.style("display", "none")
                            .style("height","")
                            .style("background","")
                            .style("color","");

                })
                .on('mousemove',function(d,i) {
                      var coordinates = d3.mouse(this.parentNode)
                      tooltip1.style("height", "140px")
                              .style("background", "rgba(255,10,10,0.7)")
                              .style("color","#EEE")
                              .style("left", (coordinates[0] * $(".container").width()/900 + 19) + "px")
                              .style("top", (coordinates[1] * $(".container").width()/900 - 145 ) + "px");
                      tooltip1.select("h5").remove();
                      tooltip1.selectAll("h6").remove();
                      tooltip1.append("h5").text(event_information[i]['full_name'])
                      //tooltip1.append("h6").text("Tweets : "+ form(all_raw_data[variableSelected][d.id]))
                      //tooltip1.append("h6").text("Population : "+ form(all_raw_data['POP'][d.id]))
                })
                .on('click', function(d){
                    updateMap1(d.name,d3.select('input[name="normalized1"]:checked').attr('value'));
                })


          });


        });
      });
}

d3.selectAll('#radio1').selectAll('input')
  .on("change", function() {
    var normalized = d3.select(this).attr('value');
    var event_selected = svgMap1.selectAll("circle").filter( function(d) { return d3.select(this).attr("selected") == "True" ;}).attr("name");
    //updateLegend(variableName);
    updateMap1(event_selected,normalized);
});


  updateMap1("Orlando",'natural');

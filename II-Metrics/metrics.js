// Global Variables :
var width = 1080,
    height = 520;

var fill_opacity_normal = 1,
    fill_opacity_highlight = 0.5;

var width_line_normal = 0.7,
    width_line_highlight = 1.5;

var metrics_information = {
  'language': {
    'full_name' : 'Language Distance',
    'unit' : '',
    'description' : 'Distance based on the offical languages and their phylogenetic trees '
  }, 'real_distance': {
    'full_name' : 'Real Distance',
    'unit' : 'km',
    'description' : 'Real distance between centers of countries'
  }, 'hop_distance': {
    'full_name' : 'Hop Distance',
    'unit' : 'hops',
    'description' : 'Smallest number of borders to cross in order to reach a country'
  }, 'flight_distance': {
    'full_name' : 'Outbound flights',
    'unit' : '%',
    'description' : 'Percentage of all the outbound flights of a country to the selected country'
  }, 'religion_distance': {
    'full_name' : 'Religion Distance',
    'unit' : '',
    'description' : 'Religious Distance based on the proportions of religons per country'
  },  'neib_distance': {
    'full_name' : 'Neighbor Influence',
    'unit' : '%',
    'description' : 'Reaction of neigboring countries based on the relative size of their neighbors'
}}

// Title Map :

var lengendMap3 = d3.select("#metric").append("div")
.attr("class", "mylegend");



// Title Map :

var titleMap3 = d3.select("#metric").append("div")
.attr("class", "mytitle");


// Tooltip :

var tooltip3 = d3.select("#metric").append("div")
    .attr("class", "mytooltip")
    .style("display", "none");

// Map

var svg3 = d3.select("#metric") //.attr("width","80%").attr("margin","0 auto")
  .append("svg")
  .attr("width","100%")
var svgMap3 = svg3.append("g");

var projection = d3.geoMercator()
  .scale(130)
  .center([0, 60 ])
  .rotate([-10,0]);

var path = d3.geoPath()
  .projection(projection);

// Legend :
var svgLegend3 = svg3.append("g").attr("class", "legendJenks")
  .attr("transform", "translate(60,"+$ (".container").width()*0.45  +")");

function  diplay_scale3(color_scale)
 {
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
    svgLegend3.call(legend);
}


function fill_color3(all_data,d,variableSelected,selected_country,color_scale) {
  if (  dropped_countries.indexOf(d.id) != -1 ) {
    return 'FloralWhite'
  }
  var data_event = all_data;

  if (data_event[d.id] == null){
    return '#EEEEEE'

  }
  return color_scale(data_event[d.id])
};

// Function that creates a color scale
function create_scale3(all_data,variableSelected,selected_country) {

  var data_event = all_data;
  var values_event = d3.values(data_event).sort(function(a, b){return a-b});
  all_data
  unique_values = new Array(0)
  for (var i = 0; i < values_event.length; i++) {
    if (unique_values.indexOf(values_event[i]) == -1 && values_event[i] != null){
      unique_values.push(values_event[i])

    }
  }
  k = d3.max([d3.min([8,unique_values.length]),2]);

  jenks_sets = ss.ckmeans(values_event,k);

  var total_length = 0;

  var jenks_colors = Array.from(d3.schemeYlOrBr[k+1]);


  var jenks_bins = new Array(0)
  for (var i = 0; i < jenks_sets.length; i++) {
    if (d3.min(jenks_sets[i]) != null || jenks_bins.indexOf(d3.max(jenks_sets[i])) == -1) {
      jenks_bins.push(d3.min(jenks_sets[i]));
    }
    else {
      jenks_sets.splice(i,1)
      jenks_colors.pop();
    }
  }

  if (variableSelected != 'flight_distance' && variableSelected != 'neib_distance'){
    jenks_colors.reverse()

  }


  var my_colorScale = d3.scaleThreshold()
      .domain(jenks_bins)
      .range(jenks_colors);

  return my_colorScale
};


function strocke_width3(d) {
  if (dropped_countries.indexOf(d.id) != -1) {
    return "0"
  }
  return width_line_normal
};



function updateMap3(variableSelected,selected_country) {
  var mylabels;
  var path_json;
  var raw_data;
  var all_data;
  var jenks_sets;
  var color_scale;
  var form = d3.format(",.2f")

  var path_json = "/I-Measurement/measurement.json";
  var path_metrics_json = "/II-Metrics/metrics.json";

  d3.json(path_json, function(error, all_raw_data) {
  d3.json(path_metrics_json, function(error, metrics_data) {
    console.log(error);
    all_data = metrics_data[variableSelected][selected_country]
    color_scale = create_scale3(all_data,variableSelected,selected_country);

  d3.json("/topojson/world/countries.json", function(error, world) {
    if (error) throw error;
          // remove old elements
          svgMap3.selectAll("path").remove();

          var coordinatesLegend= [80,350]
          //var full_name = event_information.filter(function(d){ if (d.name == variableSelected) {return d.full_name}})[0]['full_name']
          lengendMap3.selectAll("h5").remove()
          lengendMap3.selectAll("h6").remove()
          lengendMap3.selectAll("p").remove()
          lengendMap3.selectAll("br").remove()


          lengendMap3.style("left", (coordinatesLegend[0] * $(".container").width()/900 ) + "px")
                  .style("top", (coordinatesLegend[1] * $(".container").width()/900 ) + "px")
          lengendMap3.append('h6').text('Description');
          lengendMap3.append('p').text(metrics_information[variableSelected]['description'])
          lengendMap3.append('br')

          lengendMap3.append('h6').text('Unit : ' + metrics_information[variableSelected]['unit'] );



          // Map Title :
          var coordinatesTitle = [420,15]
          //var full_name = event_information.filter(function(d){ if (d.name == variableSelected) {return d.full_name}})[0]['full_name']
          titleMap3.selectAll("h1").remove()
          titleMap3.selectAll("h3").remove()

          titleMap3.style("left", (coordinatesTitle[0] * $(".container").width()/900 ) + "px")
                  .style("top", (coordinatesTitle[1] * $(".container").width()/900 ) + "px")

          titleMap3.append('h1').append('h1').text(metrics_information[variableSelected]['full_name'])

          titleMap3.append('h3').style("font-weight", "900").text('to ' +  all_raw_data['name'][selected_country] );


          svgMap3.selectAll("path")
          .data(topojson.feature(world, world.objects.units).features)
          .enter().append("path")
          .attr("d", path)
          .attr("class", "country")
          .style("fill",  function(d) {return fill_color3(all_data,d,variableSelected,selected_country,color_scale)}
            )
          .style("stroke", 'LightGrey' )
          .style("stroke-width", function(d) {return strocke_width3(d)}
            )
          .on('mouseover', function(d, i) {
                d3.select(this).style("stroke", "LightGrey")
                  .style("fill",  function(d) {
                        return d3.rgb(fill_color3(all_data,d,variableSelected,selected_country,color_scale)).brighter(0.1).toString() });
                tooltip3.style("display", "inline");
              })
          .on('mousemove',function(d,i) {
                var coordinates = d3.mouse(this.parentNode)
                tooltip3.style("left", (coordinates[0] * $(".container").width()/900 + 19) + "px")
                        .style("top", (coordinates[1] * $(".container").width()/900 - 80 ) + "px");


                tooltip3.select("h5").remove();
                tooltip3.selectAll("h6").remove();

                tooltip3.append("h5").text(all_raw_data['name'][d.id]) // Country name

                if (all_data[d.id] != null ){
                  var distance_val = form(all_data[d.id])

                } else if (variableSelected == 'neib_distance') {
                  var distance_val = "0.0"

                }
                else {
                  var distance_val = "INF"
                }

                tooltip3.append("h6").text("Distance to " + all_raw_data['name'][selected_country] + " : "+ distance_val + ' '+ metrics_information[variableSelected]['unit'])

                if (variableSelected == 'language'){
                  var language_list = all_raw_data['languages'][d.id][0]
                  for (var i = 1; i < d3.min([6,all_raw_data['languages'][d.id].length]); i++) {
                    language_list  = language_list + ', ' + all_raw_data['languages'][d.id][i]
                  }
                  tooltip3.append("h6").text("Languages : " + language_list)

                }
                else if (variableSelected == 'religion_distance') {
                  var religion_list = all_raw_data['main_religions'][d.id][0]
                  for (var i = 1; i < all_raw_data['main_religions'][d.id].length; i++) {
                    religion_list  = religion_list + ', ' + all_raw_data['main_religions'][d.id][i]
                  }
                  tooltip3.append("h6").text("Religions : " + religion_list)

                }
                else if (variableSelected == 'flight_distance') {
                  tooltip3.selectAll("h6").remove()
                  tooltip3.append("h6").text("Percentage of flights to " + all_raw_data['name'][selected_country] + " : "+ distance_val + ' '+ metrics_information[variableSelected]['unit'])

                }
                else if (variableSelected == 'neib_distance') {
                  tooltip3.selectAll("h6").remove()
                  tooltip3.append("h6").text("Neighors' reaction to an event in " + all_raw_data['name'][selected_country] + " : "+ distance_val + ' '+ metrics_information[variableSelected]['unit'])

                }

                else {

                }
          })
          .on('mouseout', function(d, i) {
                  d3.select(this)//.style('stroke-width', width_line_normal)
                    .style("fill",  function(d) {return fill_color3(all_data,d,variableSelected,selected_country,color_scale)})
                    .style("stroke", "LightGrey");
                  tooltip3.style("display", "none");
              }
            )
            .on("click", function(d){
                  updateMap3(variableSelected,d.id)
            });
            diplay_scale3(color_scale)

          });
        });
      });
}

d3.selectAll('#radio3').selectAll('input')
  .on("change", function() {
    var metric_selected = d3.select(this).attr('value');
    console.log(metric_selected);
    updateMap3(metric_selected,'CHE');
});



  updateMap3("language",'CHE');

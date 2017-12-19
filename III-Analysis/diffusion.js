// Global Variables :
var width = 1080,
    height = 520;

var fill_opacity_normal = 1,
    fill_opacity_highlight = 0.5;

var width_line_normal = 0.7,
    width_line_highlight = 1.5;


var diffusion_information = {
  'graph_diffusion': {
    'full_name' : 'Graph Diffusion',
    'unit' : '',
    'description' : 'Blah Blah '
  }, 'column_name': {
    'full_name' : 'Other Metric Title',
    'unit' : 'mynunit',
    'description' : 'Blah Blah Metric'
  }
}

// Title Map :

var lengendMap4 = d3.select("#diffusion1").append("div")
.attr("class", "mylegend");



// Title Map :

var titleMap4 = d3.select("#diffusion1").append("div")
.attr("class", "mytitle");


// Tooltip :

var tooltip4 = d3.select("#diffusion1").append("div")
    .attr("class", "mytooltip")
    .style("display", "none");

// Map

var svg4 = d3.select("#diffusion1") //.attr("width","80%").attr("margin","0 auto")
  .append("svg")
  .attr("width","100%")
var svgMap4 = svg4.append("g");

var projection = d3.geoMercator()
  .scale(130)
  .center([0, 60 ])
  .rotate([-10,0]);

var path = d3.geoPath()
  .projection(projection);

// Legend :
var svgLegend4 = svg4.append("g").attr("class", "legendJenks")
  .attr("transform", "translate(60,"+$ (".container").width()*0.45  +")");

function  diplay_scale4(color_scale4)
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
    .scale(color_scale4)
    svgLegend4.call(legend);
}


function fill_color4(all_data,d,variableSelected,selected_country,color_scale4) {
  if (  dropped_countries.indexOf(d.id) != -1 ) {
    return 'FloralWhite'
  }
  var data_event = all_data;

  if (data_event[d.id] == null){
    return '#EEEEEE'

  }
  return color_scale4(data_event[d.id])
};

// Function that creates a color scale
function create_scale4(all_data,variableSelected,selected_country) {
  var countries = d3.keys(all_data[variableSelected])
  console.log(countries);
  var all_data_event = new Array(0)
  for (var i = 0; i < countries.length; i++) {
    all_data_event = all_data_event.concat(d3.values(all_data[variableSelected][countries[i]]));
  }
  console.log('LOL');
  console.log(all_data_event)

  var data_event = all_data_event;
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

  if (variableSelected != 'graph_diffusion' && variableSelected != 'others'){
    jenks_colors.reverse()

  }


  var my_colorScale = d3.scaleThreshold()
      .domain(jenks_bins)
      .range(jenks_colors);

  return my_colorScale
};


function strocke_width4(d) {
  if (dropped_countries.indexOf(d.id) != -1) {
    return "0"
  }
  return width_line_normal
};





function updateMap4(variableSelected,selected_country) {
  var mylabels;
  var path_json;
  var raw_data;
  var all_data;
  var jenks_sets;
  var form = d3.format(",.2f")

  var path_json = "/I-Measurement/measurement.json";
  var path_diffusions_json = "/III-Analysis/diffusion.json";

  d3.json(path_json, function(error, all_raw_data) {
  d3.json(path_diffusions_json, function(error, diffusion_data) {
    console.log(error);
    console.log(diffusion_data);
    all_data = diffusion_data[variableSelected][selected_country]
    console.log('color_scale4');
    console.log(color_scale4);
    if ( color_scale4 ) {
    } else {
      console.log('color_scale4_creation')
      color_scale4 = create_scale4(diffusion_data,variableSelected,selected_country);

    }

  d3.json("/topojson/world/countries.json", function(error, world) {
    if (error) throw error;
          // remove old elements
          svgMap4.selectAll("path").remove();

          var coordinatesLegend= [80,350]
          //var full_name = event_information.filter(function(d){ if (d.name == variableSelected) {return d.full_name}})[0]['full_name']
          /*lengendMap4.selectAll("h5").remove()
          lengendMap4.selectAll("h6").remove()
          lengendMap4.selectAll("p").remove()
          lengendMap4.selectAll("br").remove()


          lengendMap4.style("left", (coordinatesLegend[0] * $(".container").width()/900 ) + "px")
                  .style("top", (coordinatesLegend[1] * $(".container").width()/900 ) + "px")
          lengendMap4.append('h6').text('Description');
          lengendMap4.append('p').text(diffusion_information[variableSelected]['description'])
          lengendMap4.append('br')

          lengendMap4.append('h6').text('Unit : ' + diffusion_information[variableSelected]['unit'] );

          */

          // Map Title :
          var coordinatesTitle = [420,15]
          //var full_name = event_information.filter(function(d){ if (d.name == variableSelected) {return d.full_name}})[0]['full_name']
          titleMap4.selectAll("h1").remove()
          titleMap4.selectAll("h3").remove()

          titleMap4.style("left", (coordinatesTitle[0] * $(".container").width()/900 ) + "px")
                  .style("top", (coordinatesTitle[1] * $(".container").width()/900 ) + "px")

          titleMap4.append('h1').append('h1').text(diffusion_information[variableSelected]['full_name'])

          titleMap4.append('h3').style("font-weight", "900").text('from ' +  all_raw_data['name'][selected_country] );


          svgMap4.selectAll("path")
          .data(topojson.feature(world, world.objects.units).features)
          .enter().append("path")
          .attr("d", path)
          .attr("class", "country")
          .style("fill",  function(d) {return fill_color4(all_data,d,variableSelected,selected_country,color_scale4)}
            )
          .style("stroke", 'LightGrey' )
          .style("stroke-width", function(d) {return strocke_width4(d)}
            )
          .on('mouseover', function(d, i) {
                d3.select(this).style("stroke", "LightGrey")
                  .style("fill",  function(d) {
                        return d3.rgb(fill_color4(all_data,d,variableSelected,selected_country,color_scale4)).brighter(0.1).toString() });
                tooltip4.style("display", "inline");
              })
          .on('mousemove',function(d,i) {
                var coordinates = d3.mouse(this.parentNode)
                tooltip4.style("left", (coordinates[0] * $(".container").width()/900 + 19) + "px")
                        .style("top", (coordinates[1] * $(".container").width()/900 - 80 ) + "px");


                tooltip4.select("h5").remove();
                tooltip4.selectAll("h6").remove();

                tooltip4.append("h5").text(all_raw_data['name'][d.id]) // Country name

                if (all_data[d.id] != null ){
                  var distance_val = form(all_data[d.id])

                } else {
                  var distance_val = "INF"
                }

                tooltip4.append("h6").text("Diffusion from " + all_raw_data['name'][selected_country] + " : "+ distance_val + ' '+ diffusion_information[variableSelected]['unit'])

                if (variableSelected == 'language'){
                  var language_list = all_raw_data['languages'][d.id][0]
                  for (var i = 1; i < d3.min([6,all_raw_data['languages'][d.id].length]); i++) {
                    language_list  = language_list + ', ' + all_raw_data['languages'][d.id][i]
                  }
                  tooltip4.append("h6").text("Languages : " + language_list)

                }
                else if (variableSelected == 'religion_distance') {
                  var religion_list = all_raw_data['main_religions'][d.id][0]
                  for (var i = 1; i < all_raw_data['main_religions'][d.id].length; i++) {
                    religion_list  = religion_list + ', ' + all_raw_data['main_religions'][d.id][i]
                  }
                  tooltip4.append("h6").text("Religions : " + religion_list)

                }
                else if (variableSelected == 'neib_distance') {
                  tooltip4.selectAll("h6").remove()
                  tooltip4.append("h6").text("Percentage of flight " + all_raw_data['name'][selected_country] + " : "+ distance_val + ' '+ diffusion_information[variableSelected]['unit'])

                }

                else {

                }
          })
          .on('mouseout', function(d, i) {
                  d3.select(this)//.style('stroke-width', width_line_normal)
                    .style("fill",  function(d) {return fill_color4(all_data,d,variableSelected,selected_country,color_scale4)})
                    .style("stroke", "LightGrey");
                  tooltip4.style("display", "none");
              }
            )
            .on("click", function(d){
                  updateMap4(variableSelected,d.id)
            });
            diplay_scale4(color_scale4)

          });
        });
      });
}

d3.selectAll('#radio4').selectAll('input')
  .on("change", function() {
    var metric_selected = d3.select(this).attr('value');
    console.log(metric_selected);
    updateMap4(metric_selected,'TUR');
});

var color_scale4;



updateMap4("graph_diffusion",'TUR');

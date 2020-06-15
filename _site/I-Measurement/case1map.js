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
                'death':12,
                'injured':11,
                'responsible': "two brothers, members of Al-Qaeda’s branch in Yemen",
                'description': "The two brothers, Saïd and Chérif Kouachi, forced their way into the offices of the French satirical weekly newspaper Charlie Hebdo in Paris. They were armed with rifles and other weapons. A major manhunt led to the discovery of the suspects, who exchanged fire with police. The brothers took hostages at a signage on 9 January and were shot dead when they emerged from the building firing.",
                'total_tweets' : 1743964,
                'location': [48.864,2.349],
                'country' : "France",
                'date': "7 January 2015"},

              { 'name' :'Nigeria_2016',
                'full_name': "Dalori Attack",
                'location': [11.333,12.65],
                'country' : "Nigeria",
                'death': 86,
                'injured':62,
                'responsible':'Boko Haram militants',
                'description': "Two militants in two cars and motorcycles entered Dalori and began to shoot at residents and firebomb their huts. The attack lasted for about four hours. Children were burnt alive",
                'total_tweets' : 8156,
                'date': "30 January 2016"},

              { 'name' : 'Bruxelles',
                'full_name': "Bruxelles Airport Attack",
                'country' : "Belgium",
                'location': [51.401,3.984],
                'death': "35 (3 perpetrators)",
                'injured': "300+",
                'responsible': "three militants of terrorist cell ISIL",
                'description': "Three coordinated suicide bombings: two nail bombings and one bombing at Maalbeek metro station. Two suicide bombers, carrying explosives in large suitcases, attacked a departure hall of the airport. A third bomb was found in a search of the airport and was later destroyed. Another explosion took place just over an hour later in the middle carriage of a three-carriage train at Maalbeek metro station",
                'total_tweets' :281861,
                'date': "22 March 2016"},

            { 'name': 'Pakistan',
              'full_name': "Lahore Bombing Attack",
              'country' : "Pakistan",
              'location': [31.516,74.290],
              'death': 75,
              'injured': "340+",
              'responsible':"jamaat-ul-Ahrar (Pakistani Taliban group)",
              'description': "Description: suicide bombing in the main entrance of Gulshan-e-Iqbal Park in Lahore. The victims where Christians who were celebrating Catholic Easter, but Muslims were also killed. Most of the victims were women and children.",
              'total_tweets' : 94969,
              'date': "27 March 2016"},

            { 'name' : 'Orlando',
              'full_name': "Orlando Shooting",
              'country' : "United States",
              'location': [28.519,-81.376],
              'death': 49,
              'injured': 53,
              'responsible': "ISIL member",
              'description': "Mass shooting inside Pulse, a gay nightclub. The shooter was a 29-year-old security guard who pledged allegiance to ISIL while doing the attack. He was shot and killed by police officers after a three-hour standoff. Pulse was hosting a \"Latin Night\" and thus most of the victims were Latinos. It is the deadliest incident of violence against LGBT people in U.S. history, and the deadliest terrorist attack in the U.S. since the September 11 attacks in 2001. ",
              'total_tweets' :1277929,
              'date': "27 March 2016"},

            { 'name' : 'Istanbul',
              'full_name': "Istanbul Airport Shooting",
              'location': [40.976,28.814],
              'country' : "Turkey",
              'death':45,
              'injured':"230+",
              'responsible':"3 attackers. No one claimed responsibility for the attack",
              'description': "Shootings and suicide bombings at Atatürk airport in Istanbul. The three attackers were armed with automatic weapons and explosive belts and they simultaneously attacked at the international terminal of Terminal 2.",
              'total_tweets' : 64208,
              'date': "28 June 2016"},

            { 'name': 'Nigeria_2015',
              'full_name': "Nigeria Baga Massacre",
              'location': [13.119, 13.856],
              'country' : "Nigeria",
              'death': "200+",
              'injured': "unknown",
              'responsible': "Boko Haram terrorist group",
              'description': "Series of mass killings in Baga and its environs that lasted one week. Boko Haram overran a military base and then forced thousands of locals from the region and committed mass killings that culminated on the 7th January. The extent of the exact number of victims is unclear, but is believed to be large. Boko Haram’s leader, Abubakar Shekau, claimed responsibility for the massacre in a video statement.",
              'total_tweets' : 63384,
              'date': "08 January 2015"},

            { 'name': 'Lebanon' ,
            'full_name': "Jabal Mohsen Attack",
              'location': [34.433, 34.95],
              'death': 9,
              'country' : "Lebanon",
              'injured': "30+",
              'responsible': "al-Qaeda group Nusra Front",
              'description': "Two suicide bombers blew themselves up in a crowded café, Jabal Mohsen. The attack was targeted at members of the Alawite sect. After the first explosion, the second suicide bomber approached the Abu Imran café but was tackles by a 60-year-old father who prevented many deaths.",
              'total_tweets' : 17062,
              'date': "10 January 2015"}
            ]


console.log(event_information);

// Title Map :

var titleMap1 = d3.select("#map1").append("div")
.attr("class", "mytitle");

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


  var path_normalized_json = "./I-Measurement/measurement_norm.json";
  var path_json = "./I-Measurement/measurement.json";
  if (normalized == 'tweet_normalized'){
    var path_output_json = path_normalized_json;
  }
  else {
    var path_output_json = path_json
  }
  d3.json(path_json, function(error, all_raw_data) {
  d3.json(path_output_json, function(error, all_data) {
  color_scale = create_scale(all_data,variableSelected,normalized);

  console.log(all_raw_data);
  d3.json("/topojson/world/countries.json", function(error, world) {
    if (error) throw error;
          // remove old elements
          svgMap1.selectAll("path").remove();
          svgMap1.selectAll("circle").remove();

          // Map Title :
          var coordinatesTitle = [420,15]
          var full_name = event_information.filter(function(d){ if (d.name == variableSelected) {return d.full_name}})[0]['full_name']
          titleMap1.selectAll("h1").remove()
          titleMap1.selectAll("h3").remove()

          titleMap1.style("left", (coordinatesTitle[0] * $(".container").width()/900 ) + "px")
                  .style("top", (coordinatesTitle[1] * $(".container").width()/900 ) + "px")
          if (normalized == "tweet_normalized"){
            titleMap1.append('h1').append('h1').text('Normalized Distribution')
          }
          else {
            titleMap1.append('h1').text('Tweet Distribution')
          }
          titleMap1.append('h3').style("font-weight", "900").text(full_name);

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
                        .style("top", (coordinates[1] * $(".container").width()/900 - 105 ) + "px");
                tooltip1.select("h5").remove();
                tooltip1.selectAll("h6").remove();
                tooltip1.selectAll("p").remove();

                tooltip1.append("h5").text(all_data['name'][d.id])
                if (normalized == "tweet_normalized"){
                  tooltip1.append("h6").text("Normalized : " + d3.format(".2f")(all_data[variableSelected][d.id]))
                }
                tooltip1.append("h6").text("Tweets : "+ form(all_raw_data[variableSelected][d.id]))
                tooltip1.append("h6").text("Average Tweets : "+ form(all_raw_data['average'][d.id]))
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
                    tooltip1.style("display", "inline");


                })
                .on('mouseout', function(d, i) {
                  d3.select(this)
                    //.style("stroke", "LightGrey");
                    .attr("r","3px");
                    tooltip1.style("display", "none")
                            .style("height","")
                            .style("background","")
                            .style("color","");

                })
                .on('mousemove',function(d,i) {
                      var coordinates = d3.mouse(this.parentNode)
                      tooltip1.style("height", "285px")
                              .style("background", "rgba(255,10,10,0.7)")
                              .style("color","#EEE")
                              .style("left", (coordinates[0] * $(".container").width()/900 + 19) + "px")
                              .style("top", (coordinates[1] * $(".container").width()/900 - 290 ) + "px");
                      tooltip1.select("h5").remove();
                      tooltip1.selectAll("h6").remove();
                      tooltip1.selectAll("p").remove();
                      tooltip1.append("h5").style("font-size","18px").text(event_information[i]['full_name']);
                      tooltip1.append("h6").text('Date : ' +event_information[i]['date'])
                      tooltip1.append("h6").text( 'Country : ' +event_information[i]['country'])
                      tooltip1.append("h6").text('Total Tweets : ' + form(event_information[i]['total_tweets']))
                      tooltip1.append("h6").text( 'Death : ' + event_information[i]['death'])
                      tooltip1.append("h6").text('Injured : ' + event_information[i]['injured'])

                      tooltip1.append("p").attr('align',"justify").text(event_information[i]['description']);
                      tooltip1.append("h6").text('')
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


var basic_choropleth = new Datamap({
  element: document.getElementById("LeMap"),
  projection: 'mercator',
  fills: {
    defaultFill: "#F6C846",
    authorHasTraveledTo: "#fa0fa0"
  },
  responsive: true,
  data: {
    USA: { fillKey: "authorHasTraveledTo" },
    JPN: { fillKey: "authorHasTraveledTo" },
    ITA: { fillKey: "authorHasTraveledTo" },
    CRI: { fillKey: "authorHasTraveledTo" },
    KOR: { fillKey: "authorHasTraveledTo" },
    DEU: { fillKey: "authorHasTraveledTo" },
  }
});

d3.select(window).on('resize', function() {
        basic_choropleth.resize();
    });

var colors = d3.scale.category10();

window.setInterval(function() {
  basic_choropleth.updateChoropleth({
    USA: colors(Math.random() * 10),
    RUS: colors(Math.random() * 100),
    AUS: { fillKey: 'authorHasTraveledTo' },
    BRA: colors(Math.random() * 50),
    CAN: colors(Math.random() * 50),
    ZAF: colors(Math.random() * 50),
    IND: colors(Math.random() * 50),
  });
}, 2000);

// Use the D3 library to read in samples.json from the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";


d3.json(url).then(function (data) {
  //console.log(data);
});



function init() {

  d3.json(url).then(function (data) {

    var drop_down = d3.select("#selDataset");
    // create dropdown menu and append
    var name_ids = data.names;
    name_ids.forEach((input) => {
      drop_down
        .append("option")
        .text(input)
        .property("value", input);
    });

    //let first ID be default
    let first_id = (data.names[0]);
    // calling other functions
    Charts(first_id);
    TotalMetadata(first_id);
  });
};

init()




//Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
//Use sample_values as the values for the bar chart.
//Use otu_ids as the labels for the bar chart.
//Use otu_labels as the hovertext for the chart.

// function for updating all charts as metadata is selected/changed

function Charts(input) {
  d3.json(url).then(function (data) {
    // filtering data for input
    let samples = data.samples.filter(n => n.id == input);
    // result of filtered data
    let result = samples[0];

    // variables
    let sample_values = result.sample_values;
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;

    //decsending order then top 10
    var yticks = otu_ids.slice(0, 10).map(ids => `OTU ${ids}`).reverse();

    // trace for bar chart
    let trace_01 = {
      //decsending order then top 10
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    };

    let barChart_data = [trace_01];
    let layout = {
      title: `Top 10 OTUs found in ${input}`,
    };

    Plotly.newPlot("bar", barChart_data, layout);

    //start bubble chart
    var bubbleChart_data = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Sunset"
      }

    };

    var bubble_layout = {
      title: "OTUs Based on Size",
      xaxis: {title:"Otu ID"},
      margin: {t:30},
      hovermode: "closest"


    };

    Plotly.newPlot("bubble", [bubbleChart_data], bubble_layout);




  });


}

// Updating the metadata function

function TotalMetadata(input) {
  d3.json(url).then(function (data) {
    var metadata = data.metadata;

    // filtering data for input
    let filtered = metadata.filter(x => x.id == input);
    // result of filtered data
    let result = filtered[0];
    console.log(result);
    // placing findings in proper location
    var panel_input = d3.select("#sample-metadata");

    panel_input.html("");

    Object.entries(result).forEach(([k, v]) => {
      panel_input.append("h5").text(`${k}: ${v}`);
    });
  });
};






// function to allow for info and charts to update when a new id is selected
function optionChanged(newSample) {

  //console.log(newSample);

  Charts(newSample);
  TotalMetadata(newSample);
}



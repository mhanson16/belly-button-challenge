// Use the D3 library to read in samples.json from the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";


d3.json(url).then(function (data){
//console.log(data);
});



function init(){

  d3.json(url).then(function(data){
      
      var drop_down = d3.select("#selDataset");
      // create dropdown menu and append
      var name_ids = data.names;
      name_ids.forEach((input)=>{
        drop_down
        .append("option")
        .text(input)
        .property("value", input);
        } );

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

function Charts(input){
  d3.json(url).then(function (data){
    // filtering data for input
    let samples = data.samples.filter(n => n.id == input);
    // result of filtered data
    let result = samples[0];
    
    // variables, in decsending order then top 10
    let sample_values = result.sample_values.slice(0,10).reverse();
    let otu_ids = result.otu_ids.slice(0,10).map(ids => `OTU ${ids}`).reverse();
    let otu_labels = result.otu_labels.slice(0,10).reverse();


    // trace for bar chart
    let trace_01 = {
      x: sample_values,
      y: otu_ids,
      text: otu_labels,
      type: "bar",
      orientation: "h"
    };

    let barChart_data = [trace_01];
    let layout = {
      title: `Top Ten + ${input}`,
    };

    Plotly.newPlot("bar", barChart_data, layout);
  });


}

// Updating the metadata function

function TotalMetadata(input){
  d3.json(url).then(function (data){
    var metadata = data.metadata;
    
    // filtering data for input
    let filtered = metadata.filter(x => x.id == input);
    // result of filtered data
    let result = filtered[0];
    console.log(result);
    // placing findings in proper location
    var panel_input = d3.select("#select-metadata");
    
    panel_input.html("");
    //
    panel_input.append("h5").text("id: " + result.id);
    panel_input.append("h5").text("ethnicity: " + result.ethnicity);
    panel_input.append("h5").text("geneder: " + result.gender);
    panel_input.append("h5").text("age: " + result.age);
    panel_input.append("h5").text("location: " + result.location);
    panel_input.append("h5").text("bbtype: " + result.bbtype);
    panel_input.append("h5").text("wfreq: " + result.wfreq);
    });
  };






// function to allow for info and charts to update when a new id is selected
function Changed(newSample){

  //console.log(newSample);

  Charts(newSample);
  TotalMetadata(newSample);
}



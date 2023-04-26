const margin = { top: 20, right: 30, bottom: 100, left: 80 };
const width = 1200 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

// Load the data from the CSV file
d3.csv("/data/koi_cumulative_v1.csv").then(function (data) {

 

  // Convert the data types from strings to numbers where appropriate
  data.forEach(function (d) {
    d.koi_prad = +d.koi_prad;
    d.koi_insol = +d.koi_insol;

  });

  // Define the scales for the x and y axes
  var xScale = d3
    .scaleLog()
    .domain(
      d3.extent([10e3, 10e-3])
    )
    .range([0, width]);

  var yScale = d3
    .scaleLog()
    .domain(
      d3.extent([10e-2, 10e2])
    )
    .range([height, 0]);

  // Define the x and y axes
  var xAxis = d3
    .axisBottom(xScale)
    .tickSizeOuter(0)
    .tickPadding(10)
    .tickFormat(function (d) {
      if(d < 1){
        // return decimal value 
        return d.toFixed(2);

      }
      return d;

    });

  var yAxis = d3.axisLeft(yScale).tickSizeOuter(0).tickPadding(10);



  // Create the SVG container and add the axes
  var svg = d3
    .select("#general_plots3")
    .append("svg")
    .attr("preserveAspectRatio", "none")
    .attr("width", "100%")
    .attr(
      "viewBox",
      `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom
      }`
    )
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let tooltip = d3
    .select("#general_plots")
    .append("div")
    .style("position", "absolute")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("color", "white")
    .style("background-color", "#11191f")
    .style("border", "none")
    .style("border-radius", "5px")
    .style("padding", "5px");



  // Bind the data to a selection of circles
  var circles = svg.selectAll("circle").data(data).enter().append("circle");
  let name = "";
  circles
    .attr("cx", function (d) {
      var test = xScale(d.koi_insol);
      if (!test) {
        // skip this iteration 
        return;
      }
      // if the point lies outside the range of the axis, the scale will return undefined
      // so we need to check for this and skip this iteration
      if (xScale(d.koi_insol) > width - 30 || xScale(d.koi_insol) < 10 || yScale(d.koi_prad) > height - 20|| yScale(d.koi_prad) < 20) {
        return 
      }
      return xScale(d.koi_insol);
    })
    .attr("cy", function (d) {
      // similar test
      var test = yScale(d.koi_prad);
      if (!test) {
        // skip this iteration
        return;
      }
      if (xScale(d.koi_insol) > width || xScale(d.koi_insol) < 0 || yScale(d.koi_prad) > height || yScale(d.koi_prad) < 0) {
        return 
      }
      

      return yScale(d.koi_prad);
    })
    .attr("r", function (d) {
      return 2
    })
    .attr("fill", function (d) {
      // return a colour based on esi compared to earth. first define the earths amouunts
      var earth_insol = 1.361;
      var earth_prad = 1;
      var earth_esi = 1;

      // calculate the total difference between the earth and this planet using only insol and prad
      var insol_diff = Math.abs(d.koi_insol - earth_insol) / earth_insol;
      var prad_diff = Math.abs(d.koi_prad - earth_prad) / earth_prad;
      var total_diff = (insol_diff + prad_diff) / 2;





    // colour using total diff with 10 distinct colours
    if (total_diff < 0.2) {

      return "#00ff00";
    } else if (total_diff < 0.4) {
      return "#33ff00";
    } else if (total_diff < 0.6) {
      return "#66ff00";
    } else if (total_diff < 0.8) {
      return "#99ff00";
    } else if (total_diff < 1) {
      return "#ccff00";

    } else if (total_diff < 1.2) {
      return "#ffff00";
    } else if (total_diff < 1.4) {
      return "#ffcc00";
    } else if (total_diff < 1.6) {
      return "#ff9900";
    } else if (total_diff < 1.8) {
      return "#ff6600";
    } else if (total_diff < 2) {
      return "#ff3300";
    } 
    else if (total_diff < 200) {
      return "#ff0000";
    }
    else {
      // some colour dull red
      return "#800000";


      
    }  

  })
  



  // add a huge circle for the position of earth on this graph

  svg
    .append("circle")
    .attr("cx", function (d) {
      return xScale(1.361);
    })
    .attr("cy", function (d) {
      return yScale(1);
    })
    .attr("r", function (d) {
      return 4;
    })
    .attr("fill", function (d) {
      return "#ffffff";
    })
  // Set the position and size attributes based on the data



  svg
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
  .selectAll("text")
  .style("text-anchor", "end")
  .attr("transform", "rotate(-90)")
  .attr("dx", "-1.2em")
  .attr("dy", "-1.2em")
  // increase thickness of axis
  
  .style("fill", "white")
  
  // add title for this axis
  


svg.selectAll(".x.axis path").style("stroke", "white");

svg.selectAll(".x.axis line").style("stroke", "white");

svg
  .append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .selectAll("text")
  .style("fill", "white");

svg.selectAll(".y.axis path").style("stroke", "white");

svg.selectAll(".y.axis line").style("stroke", "white");


svg
.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + 0 + ")")
.call(xAxis)

.selectAll("text")

.style("text-anchor", "end")
.attr("transform", "rotate(-90)")
.attr("dx", "-1.2em")
.attr("dy", "-1.2em")
// make text transparent
.style("opacity", "0")
// make text transparent




.style("fill", "white");
svg.selectAll(".x.axis path").style("stroke", "white");
svg.selectAll(".x.axis line").style("stroke", "white");

svg
.append("g")
.attr("class", "y axis")
// move it to the right side of the ploy
.attr("transform", "translate(" + width + ",0)")
.call(yAxis)
// make the markings transparent


svg.selectAll(".y.axis path").style("stroke", "white");
svg.selectAll(".y.axis line").style("stroke", "white");

svg.append("text")
   .attr("transform", "translate(" + (width/2) + "," + (height + margin.bottom) + ")")
   .style("text-anchor", "middle")
   .style("fill", "white")
   .text("Radius of Planet (Earth Radii)");

// Add y axis label
svg.append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", 0 - margin.left)
   .attr("x", 0 - (height / 2))
   .attr("dy", "1em")
   .style("text-anchor", "middle")
   .style("fill", "white")
   .text("Insolation (Earth Flux)");


  


}); // End of data loading

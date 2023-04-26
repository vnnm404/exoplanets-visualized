const margin = { top: 20, right: 30, bottom: 100, left: 80 };
const width = 1200 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

// Load the data from the CSV file



function calculateFactor(x, y) {
  // Calculate the distance of the point from the origin
  var distance = Math.sqrt(x * x + y * y);

  // Map the distance to a factor between 0 and 1
  var factor = d3.scaleLinear()
    .domain([0, Math.sqrt(200)]) // maximum distance for the given domain and range
    .range([0, 1])(distance);

  return factor;
}


// Define the scales for the x and y axes
var xScale = d3.scaleLinear()
  .domain([-10, 10])
  .range([0, width]);

// Define the y domain and range
var yScale = d3.scaleLinear()
  .domain([-10, 10])
  .range([height, 0]);
// Define the x and y axes
var xAxis = d3
  .axisBottom(xScale)
  .tickSizeOuter(0)
  .tickPadding(10)
  .tickFormat(function (d) {
    return d;
  });

var yAxis = d3.axisLeft(yScale).tickSizeOuter(0).tickPadding(10);

// Create the SVG container and add the axes
var svg = d3
  .select("#general_plots2")
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



// Bind the data to a selection of circles


const colorStops = [
  { offset: 0.0, color: 'red' },
  { offset: 0.3, color: 'orange' },
  { offset: 0.5, color: 'yellow' },
  { offset: 0.7, color: 'green' },
  { offset: 1.0, color: 'blue' },
];
// Bind the data to a selection of circles
const data = d3.range(50000).map(() => ({
  x: Math.random() * 20 - 10.5,
  y: Math.random() * 20 - 10,
}));

svg
  .selectAll("rect")
  // filter the data to make the left side of the rectangle always more than the x axis
  .data(data.filter((d) => (d.x) > -10))
  .enter()
  .append("rect")
  .attr("width", 22)
  .attr("height", 10)
  .attr("x", (d) => (xScale(d.x)))
  .attr("y", (d) => yScale(d.y) - 10)
  .style("fill", (d) => {
    const factor = calculateFactor(d.x, d.y);
    return d3.interpolateRgb("red", "blue")(factor);
  });
  
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
  .style("fill", "white");

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
.style("fill", "white");

svg.selectAll(".x.axis path").style("stroke", "white");
svg.selectAll(".x.axis line").style("stroke", "white");

svg
.append("g")
.attr("class", "y axis")
.call(yAxis)
.attr("transform", "translate("+ width + ", 0)")
.selectAll("text")
.style("fill", "white");

svg.selectAll(".y.axis path").style("stroke", "white");
svg.selectAll(".y.axis line").style("stroke", "white");
 
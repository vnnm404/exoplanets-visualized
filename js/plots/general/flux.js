const margin = { top: 20, right: 30, bottom: 100, left: 80 };
const width = 1200 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

// Load the data from the CSV file
d3.csv("/data/ESI_and_zone.csv").then(function (data) {
  data.push({ 'pl_insol': 1.15, 'pl_rade': 1.0161, 'pl_name': 'Teegardens Star b' })
  data.push({ 'pl_insol': 1, 'pl_rade': 1, 'pl_name': 'Earth' })
  // Convert the data types from strings to numbers where appropriate
  data.forEach(function (d) {
    d.pl_rade = +d.pl_rade;
    d.pl_insol = +d.pl_insol;
  });

  // Define the scales for the x and y axes
  let xScale = d3
    .scaleLog()
    .domain(
      d3.extent([10e3, 10e-3])
    )
    .range([0, width]);

  let yScale = d3
    .scaleLog()
    .domain(
      d3.extent([10e-2, 10e2])
    )
    .range([height, 0]);

  // Define the x and y axes
  let xAxis = d3
    .axisBottom(xScale)
    .tickSizeOuter(0)
    .tickPadding(10)
    .tickFormat(function (d) {
      if (d < 1) {
        return d.toFixed(2);
      }
      return d;

    });

  let yAxis = d3.axisLeft(yScale).tickSizeOuter(0).tickPadding(10);

  // Create the SVG container and add the axes
  let svg = d3
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
  let circles = svg.selectAll("circle").data(data).enter().append("circle");
  let name = "";
  circles
    // add unique classname
    .attr("class", function (d) {
      name = d.pl_name;
      return name;
    })

    .attr("cx", function (d) {
      let test = xScale(d.pl_insol);
      if (!test) {
        // skip this iteration 
        return 9999;
      }
      // if the point lies outside the range of the axis, the scale will return undefined
      // so we need to check for this and skip this iteration
      if (xScale(d.pl_insol) > width - 30 || xScale(d.pl_insol) < 10 || yScale(d.pl_rade) > height - 20 || yScale(d.pl_rade) < 0) {
        return 9999
      }
      return xScale(d.pl_insol);
    })
    .attr("cy", function (d) {
      // similar test
      let test = yScale(d.pl_rade);
      if (!test) {
        // skip this iteration
        return 9999;
      }
      if (xScale(d.pl_insol) > width || xScale(d.pl_insol) < 0 || yScale(d.pl_rade) > height || yScale(d.pl_rade) < 0) {
        return 9999
      }
      return yScale(d.pl_rade);
    })
    .attr("r", function (d) {
      if (d.pl_name == 'Teegardens Star b' || d.pl_name == 'Earth') {
        console.log("hello")
        return 6
      }
      else
        return 2.85;
    })
    .attr("fill", function (d) {
      if (d.pl_name == 'Teegardens Star b')
        return "blue"
      else if (d.pl_name == 'Earth')
        return "white"
      else {
        let earth_insol = 1;
        let earth_prad = 1;

        // calculate the total difference between the earth and this planet using only insol and prad
        let insol_diff = ((d.pl_insol - earth_insol) / (d.pl_insol + earth_insol)) * ((d.pl_insol - earth_insol) / (d.pl_insol + earth_insol))
        let prad_diff = ((d.pl_rade - earth_prad) / (earth_prad + d.pl_rade)) * ((d.pl_rade - earth_prad) / (earth_prad + d.pl_rade))
        let esi = 1 - Math.sqrt((insol_diff + prad_diff) / 2);

        // map from green to red based on 0 to 1, make a function, make the opacity 0.6
        let color = d3.scaleLinear()
          .domain([0, 1])
          .range(["#ff0000", "#00ff00"]);

        // use colour function to get a colour based on esi, and opacity 0.6
        return color(esi);
      }
    })
    // opacity 0.6
    .attr("opacity", function (d) {
      if (d.pl_name == 'Teegardens Star b' || d.pl_name == 'Earth')
        return 0.9
      else
        return 0.4
    })
    // make opacirt of point 1 on hover
    .on("mouseover", function (event, d) {
      d3.select(this).attr("opacity", 1);
      // radius bigger in a transition
      if (d.pl_name == 'Teegardens Star b' || d.pl_name == 'Earth')
        d3.select(this).transition().duration(100).attr("r", 10);
      else
        d3.select(this).transition().duration(100).attr("r", 7);
      // make tooltip visible
      let matrix = this.getScreenCTM().translate(
        +this.getAttribute("cx"),
        +this.getAttribute("cy")
      );
      let earth_insol = 1;
      let earth_prad = 1;

      let insol_diff = ((d.pl_insol - earth_insol) / (d.pl_insol + earth_insol)) * ((d.pl_insol - earth_insol) / (d.pl_insol + earth_insol))
      let prad_diff = ((d.pl_rade - earth_prad) / (earth_prad + d.pl_rade)) * ((d.pl_rade - earth_prad) / (earth_prad + d.pl_rade))

      let esi = 1 - Math.sqrt((insol_diff + prad_diff) / 2);

      tooltip
        .html(
          // print name, radius, insolation, and esi
          "<b>" +
          d.pl_name +
          "</b><br/>" +
          "Radius: " +
          d.pl_rade +
          " Earth radii<br/>" +
          "Insolation: " +
          d.pl_insol +
          " Earth insolation<br/>" +
          "ESI: " +
          esi
        )
        .style("opacity", 1)
        .style("left", window.pageXOffset + matrix.e + 15 + "px")
        .style("top", window.pageYOffset + matrix.f - 30 + "px");
    })
    // make opacity 0.4 on mouseout
    .on("mouseout", function (event, d) {

      // radius smaller
      if (d.pl_name == 'Teegardens Star b' || d.pl_name == 'Earth') {
        d3.select(this).transition().duration(100).attr("r", 6);
        d3.select(this).attr("opacity", 0.9);
      }
      else {
        d3.select(this).transition().duration(100).attr("r", 2.85);
        d3.select(this).attr("opacity", 0.4);
      }
      // make tooltip invisible
      tooltip.style("opacity", 0);
    })

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
    .style("opacity", "0")
    .style("fill", "white");

  svg.selectAll(".x.axis path").style("stroke", "white");
  svg.selectAll(".x.axis line").style("stroke", "white");

  svg
    .append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + width + ",0)")
    .call(yAxis)

  svg.selectAll(".y.axis path").style("stroke", "white");
  svg.selectAll(".y.axis line").style("stroke", "white");

  svg.append("text")
    .attr("transform", "translate(" + (width / 2) + "," + (height + margin.bottom) + ")")
    .style("text-anchor", "middle")
    .style("fill", "white")
    .text("Insolation (Earth Flux)");

  // Add y axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("fill", "white")
    .text("Radius of Planet (Earth Radii)");

  // Define the color ranges and corresponding values
  const colorRanges = [
    { color: "#00ff00", range: " Closer to esi = 1" },
    { color: "#ff0000", range: "Closer to esi = 0" },
    { color: "#ffffff", range: "Earth, esi = 1" },
  ];

  colorRanges.forEach((colorRange, index) => {
    // Add a legend for each color range
    svg
      .append("text")
      .attr("x", 20)
      .attr("y", 20 * index + 15)
      .text(colorRange.range)
      .attr("transform", "translate(0, 20)")
      // color it according t0 that colour rang
      .style("fill", colorRange.color)
  });
}); // End of data loading
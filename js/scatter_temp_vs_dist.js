const margin = { top: 20, right: 30, bottom: 100, left: 80 };
const width = 1200 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

// Load the data from the CSV file
d3.csv("/data/Exoplanets_v1.csv").then(function (data) {

    // Convert the data types from strings to numbers where appropriate
    data.forEach(function (d) {
        // console.log("data ")
        d.sy_snum = +d.sy_snum;
        d.sy_pnum = +d.sy_pnum;
        d.sy_mnum = +d.sy_mnum;
        d.disc_year = +d.disc_year;
        d.pl_orbper = +d.pl_orbper;
        d.pl_orbsmax = +d.pl_orbsmax;
        d.pl_rade = +d.pl_rade;
        d.pl_masse = +d.pl_masse;
        d.pl_dens = +d.pl_dens;
        d.pl_eqt = +d.pl_eqt;
        d.st_teff = +d.st_teff;
        d.st_logg = +d.st_logg;
        d.sy_dist = +d.sy_dist;
    });

    // Define the scales for the x and y axes
    var xScale = d3.scaleLog()
        .domain(d3.extent(data, function (d) { return d.pl_orbsmax; }))
        .range([0, width])

    var yScale = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return d.st_teff; }))
        .range([height, 0]);

    // Define the x and y axes
    var xAxis = d3.axisBottom(xScale)
        .tickSizeOuter(0)
        .tickPadding(10)
        .tickFormat(function (d) {
            return d;
        })

    var yAxis = d3.axisLeft(yScale)
        .tickSizeOuter(0)
        .tickPadding(10);

    // Define the habitable planet region
    var habitableMinTemp = 273; // K
    var habitableMaxTemp = 5000; // K
    var habitableMaxDist = 1; // AU

    // Create the SVG container and add the axes
    var svg = d3.select("#general_plots").append("svg")
        .attr('preserveAspectRatio', 'none')
        .attr('width', '100%')
        .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("dx", "-1.2em")
        .attr("dy", "-1.2em")
        .style("fill", "white")

    svg.selectAll(".x.axis path")
        .style("stroke", "white");

    svg.selectAll(".x.axis line")
        .style("stroke", "white");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll("text")
        .style("fill", "white")

    svg.selectAll(".y.axis path")
        .style("stroke", "white");

    svg.selectAll(".y.axis line")
        .style("stroke", "white");

    // Bind the data to a selection of circles
    var circles = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle");

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width / 2)
        .attr("y", height + 35 + 20)
        .text("Distance in AU")
        .style("fill", "white");

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -45)
        .attr("x", -height / 2)
        .attr("transform", "rotate(-90)")
        .text("Temperature")
        .style("fill", "white")

    // Set the position and size attributes based on the data
    circles.attr("cx", function (d) { return xScale(d.pl_orbsmax); })
        .attr("cy", function (d) { return yScale(d.st_teff); })
        .attr("r", function (d) { return d.pl_rade / 5 || 3 / 5; }) // set a default radius of 3 if pl_rade is missing
        .style("fill", function (d) {

            if (d.st_teff >= habitableMinTemp && d.st_teff <= habitableMaxTemp && d.pl_orbsmax <= habitableMaxDist) {
                return "green"; // habitable planet
            } else {
                return "red"; // non-habitable planet
            }
        });

    svg.append("line")
        .attr("class", "habitable-line")
        .attr("x1", xScale(0))
        .attr("y1", yScale(habitableMinTemp))
        .attr("x2", xScale(habitableMaxDist))
        .attr("y2", yScale(habitableMinTemp))
        .style("stroke", "white")

    svg.append("line")
        .attr("class", "habitable-line")
        .attr("x1", xScale(habitableMaxDist))
        .attr("y1", yScale(habitableMinTemp))
        .attr("x2", xScale(habitableMaxDist))
        .attr("y2", yScale(habitableMaxTemp))
    // .style("stroke", "white")



}); // End of data loading

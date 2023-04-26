const margin = { top: 20, right: 30, bottom: 100, left: 80 };
const width = 1200 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

const svg = d3
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

d3.csv("/data/koi_cumulative_v1.csv").then(function (data) {
    // Convert the data types from strings to numbers where appropriate
    data.forEach(function (d) {
        d.koi_steff = +d.koi_steff;
        d.koi_insol = +d.koi_insol;
    });

    let xScale = d3
        .scaleLog()
        .domain(
            d3.extent([10e3, 10e-3])
        )
        .range([0, width]);

    let yScale = d3
        .scaleLinear()
        .domain(
            d3.extent(data, function (d) {
                return d.koi_steff;
            })
        )
        .range([height, 0]);

    let xAxis = d3
        .axisBottom(xScale)
        .tickSizeOuter(0)
        .tickPadding(10)
        .tickFormat(function (d) {
            // Check if the number is greater than or equal to 1
            if (d >= 1) {
                // If yes, return the number without the "m"
                return d;
            } else {
                // If not, return the number in scientific notation
                return d.toExponential(0);
            }
        });

    let yAxis = d3.axisLeft(yScale).tickSizeOuter(0).tickPadding(10);

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
        .attr("transform", "translate(" + width + ",0)")
        .call(yAxis)

    svg.selectAll(".y.axis path").style("stroke", "white");
    svg.selectAll(".y.axis line").style("stroke", "white");

    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + "," + (height + margin.bottom - 40) + ")")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text("Temperature (Stellar Effective Temperature)");

    // Add y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text("Insolation (Earth Flux)");

})
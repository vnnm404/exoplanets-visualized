const data = await d3.csv('../data/Exoplanets_radius.csv')

const ranges = [
    { end: 2, value: 0 },
    { end: 4, value: 0 },
    { end: 6, value: 0 },
    { end: 8, value: 0 },
    { end: 10, value: 0 },
    { end: 12, value: 0 },
    { end: 14, value: 0 },
    { end: 16, value: 0 }
]

const ranges2 = [
    { end: 1, value: 0 },
    { end: 2, value: 0 },
    { end: 3, value: 0 },
    { end: 4, value: 0 },
    { end: 5, value: 0 }
]

data.forEach(item => {
    item.pl_rade = parseFloat(item.pl_rade)
    let val = item.pl_rade

    for (const range of ranges) {
        if (val < range.end) {
            range.value++
            break
        }
    }

    for (const range of ranges2) {
        if (val < range.end) {
            range.value++
            break
        }
    }
})

// Set the margins and dimensions for the chart
const margin = { top: 20, right: 20, bottom: 50, left: 50 };
const width = 1000 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;
const innerRadius = 100
const outerRadius = Math.min(width, height) / 2;

// Create an SVG container for the chart
var svg = d3.select("#general_plots1")
    .attr("class", "radius_vs_count1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${width / 2 + margin.left}, ${height / 2 + margin.top})`)

var svg2 = d3.select("#general_plots2")
    .attr("class", "radius_vs_count2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${width / 2 + margin.left}, ${height / 2 + margin.top})`)

// Define the scales for the x-axis and y-axis

var x = d3.scaleBand()
    .range([0, 2 * Math.PI])
    .domain(ranges.map(r => r.end))

var x2 = d3.scaleBand()
    .range([0, 2 * Math.PI])
    .domain(ranges2.map(r => r.end))

var y = d3.scaleRadial()
    .range([innerRadius, outerRadius])
    .domain([0, 10000])

svg.append("g")
    .selectAll("path")
    .data(ranges)
    .join("path")
    .attr("fill", "#69b3a2")
    .attr("d", d3.arc()     // imagine your doing a part of a donut plot
        .innerRadius(innerRadius)
        .outerRadius(d => y(d.value))
        .startAngle(d => x(d.end))
        .endAngle(d => x(d.end) + x.bandwidth())
        .padAngle(0.01)
        .padRadius(innerRadius))

svg.append("g")
    .selectAll("g")
    .data(ranges)
    .join("g")
    .attr("text-anchor", function (d) { return (x(d.end) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
    .attr("transform", function (d) { return "rotate(" + ((x(d.end) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (y(d.value) + 10) + ",0)"; })
    .append("text")
    .text(function (d) { return (d.value) })
    .attr("transform", function (d) { return (x(d.end) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle")

svg.append("g")
    .selectAll("g")
    .data(ranges)
    .join("g")
    .attr("text-anchor", function (d) { return (x(d.end) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
    .attr("transform", function (d) { return "rotate(" + ((x(d.end) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + 70 + ",0)"; })
    .append("text")
    .text(function (d) { return (d.end) })
    .attr("transform", function (d) { return (x(d.end) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle")

svg.append("text")
    .text("Radius relative")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle")
    .attr("transform", "translate(-44, -7)")

svg.append("text")
    .text("to Earth")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle")
    .attr("transform", "translate(-22, 7)")

svg.append("text")
    .text("(Earth = 1)")
    .style("fill", "blue")
    .style("font-size", "13px")
    .attr("alignment-baseline", "middle")
    .attr("transform", "translate(-26, 22)")

svg.append("text")
    .text("Number of planets")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle")
    .attr("transform", "translate(-55, 380)")

svg.append("g")
    .selectAll("path")
    .data(ranges)
    .join("path")
    .attr("fill", "#69b3a2")
    .attr("d", d3.arc()     // imagine your doing a part of a donut plot
        .innerRadius(innerRadius)
        .outerRadius(d => y(d.value))
        .startAngle(d => x(d.end))
        .endAngle(d => x(d.end) + x.bandwidth())
        .padAngle(0.01)
        .padRadius(innerRadius))

svg2.append("g")
    .selectAll("g")
    .data(ranges2)
    .join("g")
    .attr("text-anchor", function (d) { return (x2(d.end) + x2.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
    .attr("transform", function (d) { return "rotate(" + ((x2(d.end) + x2.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (y(d.value) + 10) + ",0)"; })
    .append("text")
    .text(function (d) { return (d.value) })
    .attr("transform", function (d) { return (x2(d.end) + x2.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle")

svg2.append("g")
    .selectAll("g")
    .data(ranges2)
    .join("g")
    .attr("text-anchor", function (d) { return (x2(d.end) + x2.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
    .attr("transform", function (d) { return "rotate(" + ((x2(d.end) + x2.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + 70 + ",0)"; })
    .append("text")
    .text(function (d) { return (d.end) })
    .attr("transform", function (d) { return (x2(d.end) + x2.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle")

svg2.append("text")
    .text("Radius relative")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle")
    .attr("transform", "translate(-44, -7)")

svg2.append("text")
    .text("to Earth")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle")
    .attr("transform", "translate(-22, 7)")

svg2.append("text")
    .text("(Earth = 1)")
    .style("fill", "blue")
    .style("font-size", "13px")
    .attr("alignment-baseline", "middle")
    .attr("transform", "translate(-26, 22)")

svg2.append("text")
    .text("Number of planets")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle")
    .attr("transform", "translate(-55, 380)")

svg2.append("g")
    .selectAll("path")
    .data(ranges2)
    .join("path")
    .attr("fill", "#69b3a2")
    .attr("d", d3.arc()     // imagine your doing a part of a donut plot
        .innerRadius(innerRadius)
        .outerRadius(d => y(d.value))
        .startAngle(d => x2(d.end))
        .endAngle(d => x2(d.end) + x2.bandwidth())
        .padAngle(0.01)
        .padRadius(innerRadius))

let yAxis = svg.append("g")
    .attr("text-anchor", "middle");

let yTick = yAxis
    .selectAll("g")
    .data(y.ticks(3).slice(1))
    .enter().append("g");

yTick.append("circle")
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("r", y);

yTick.append("text")
    .attr("y", function (d) { return -y(d); })
    .attr("dy", "0.35em")
    .attr("fill", "none")
    .attr("stroke", "#fff")
    .attr("stroke-width", 5)
    .text(y.tickFormat(5, "s"));

yTick.append("text")
    .attr("y", function (d) { return -y(d); })
    .attr("dy", "0.35em")
    .text(y.tickFormat(5, "s"));

yAxis = svg2.append("g")
    .attr("text-anchor", "middle");

yTick = yAxis
    .selectAll("g")
    .data(y.ticks(3).slice(1))
    .enter().append("g");

yTick.append("circle")
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("r", y);

yTick.append("text")
    .attr("y", function (d) { return -y(d); })
    .attr("dy", "0.35em")
    .attr("fill", "none")
    .attr("stroke", "#fff")
    .attr("stroke-width", 5)
    .text(y.tickFormat(5, "s"));

yTick.append("text")
    .attr("y", function (d) { return -y(d); })
    .attr("dy", "0.35em")
    .text(y.tickFormat(5, "s"));
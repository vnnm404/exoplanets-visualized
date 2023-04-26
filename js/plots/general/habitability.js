const margin = { top: 20, right: 30, bottom: 100, left: 80 };
const width = 1200 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

const svg = d3
    .select("#general_plots1")
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
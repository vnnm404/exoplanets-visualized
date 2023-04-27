// # This file was produced by the NASA Exoplanet Archive  http://exoplanetarchive.ipac.caltech.edu
// # Wed Apr 26 13: 54: 24 2023
// #
// # User preference: *
// #
// # CONSTRAINT: where(pl_name_display not null
// # CONSTRAINT: and pl_radestr not null
// # CONSTRAINT: and pl_insolstr not null
// # CONSTRAINT: and st_teffstr not null)
// #
// # COLUMN pl_name:        Planet Name
// # COLUMN pl_rade:        Planet Radius[Earth Radius]
// # COLUMN pl_radeerr1:    Planet Radius Upper Unc. [Earth Radius]
// # COLUMN pl_radeerr2:    Planet Radius Lower Unc. [Earth Radius]
// # COLUMN pl_radelim:     Planet Radius Limit Flag
// # COLUMN pl_insol:       Insolation Flux[Earth Flux]
// # COLUMN pl_insolerr1:   Insolation Flux Upper Unc. [Earth Flux]
// # COLUMN pl_insolerr2:   Insolation Flux Lower Unc. [Earth Flux]
// # COLUMN pl_insollim:    Insolation Flux Limit Flag
// # COLUMN st_teff:        Stellar Effective Temperature[K]
// # COLUMN st_tefferr1:    Stellar Effective Temperature Upper Unc. [K]
// # COLUMN st_tefferr2:    Stellar Effective Temperature Lower Unc. [K]
// # COLUMN st_tefflim:     Stellar Effective Temperature Limit Flag

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

d3.csv("/data/ESI_and_zone.csv").then(function (data) {
    let data2 = []
    data2.push({ 'temp': 3600, 'flux': 1.15, 'radius': 1.0161, 'name': 'Teegardens Star b' })
    data2.push({ 'temp': 5900, 'flux': 1, 'radius': 1, 'name': 'Earth' })
    // Convert the data types from strings to numbers where appropriate
    data.forEach(function (d) {
        d.pl_rade = +d.pl_rade;
        d.st_teff = +d.st_teff;
        d.pl_insol = +d.pl_insol;

        if (d.pl_insol >= 0 && d.pl_insol <= 2)
            data2.push({ 'temp': d.st_teff, 'flux': d.pl_insol, 'radius': d.pl_rade, 'name': d.pl_name })
    });

    let xScale = d3
        .scaleLinear()
        .domain(
            d3.extent([0, 2])
        )
        .range([0, width]);

    let yScale = d3
        .scaleLinear()
        .domain(
            d3.extent(data2, function (d) {
                return d.temp;
            })
        )
        .range([height, 0]);

    let xAxis = d3
        .axisBottom(xScale)
        .tickSizeOuter(0)
        .tickPadding(10)
        .tickFormat(function (d) {
            if (d >= 1) {
                return d;
            } else {
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
        .attr("transform", "translate(" + (width / 2) + "," + (height + margin.bottom - 40) + ")")
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
        .text("Temperature (Stellar Effective Temperature)");

    svg.append("line")
        .attr("x1", xScale(1.46))
        .attr("y1", height)
        .attr("x2", width)
        .attr("y2", yScale(6100))
        .style("stroke-width", 2)
        .style("stroke", "#ffbfc0")

    svg.append("line")
        .attr("x1", xScale(0.98))
        .attr("y1", height)
        .attr("x2", xScale(1.375))
        .attr("y2", 0)
        .style("stroke-width", 2)
        .style("stroke", "#bedec0")

    svg.append("line")
        .attr("x1", xScale(0.91))
        .attr("y1", height)
        .attr("x2", xScale(1.27))
        .attr("y2", 0)
        .style("stroke-width", 2)
        .style("stroke", "#97cb9a")

    svg.append("line")
        .attr("x1", xScale(0.81))
        .attr("y1", height)
        .attr("x2", xScale(1.1))
        .attr("y2", 0)
        .style("stroke-width", 2)
        .style("stroke", "#77bb7c")

    svg.append("line")
        .attr("x1", xScale(0.225))
        .attr("y1", height)
        .attr("x2", xScale(0.4))
        .attr("y2", 0)
        .style("stroke-width", 2)
        .style("stroke", "#5daf64")

    svg.append("line")
        .attr("x1", xScale(0.2))
        .attr("y1", height)
        .attr("x2", xScale(0.35))
        .attr("y2", 0)
        .style("stroke-width", 2)
        .style("stroke", "#c0bffd")

    let circles = svg.selectAll("circle").data(data2).enter().append("circle");
    circles
        .attr("cx", function (d) {
            return xScale(d.flux);
        })
        .attr("cy", function (d) {
            return yScale(d.temp);
        })
        .attr("r", function (d) {
            if (d.name == 'Teegardens Star b' || d.name == 'Earth')
                return 8
            else if (d.radius < 1)
                return 1
            else if (d.radius < 10)
                return d.radius
            else
                return 10
        })
        .attr("fill", function (d) {
            if (d.name == 'Teegardens Star b')
                return "blue"
            else if (d.name == 'Earth')
                return "white"
            else {
                let P = { x: d.flux, y: d.temp };
                let A = { x: 1.46, y: 0 }
                let B = { x: 2, y: 6100 }
                let crossProduct = (B.x - A.x) * (P.y - A.y) - (B.y - A.y) * (P.x - A.x);

                if (crossProduct < 0)
                    return "#ffbfc0"
                else {
                    A = { x: 0.98, y: 0 }
                    B = { x: 1.375, y: 7000 }
                    crossProduct = (B.x - A.x) * (P.y - A.y) - (B.y - A.y) * (P.x - A.x);
                    if (crossProduct < 0)
                        return "#bedec0"
                    else {
                        A = { x: 0.91, y: 0 }
                        B = { x: 1.27, y: 7000 }
                        crossProduct = (B.x - A.x) * (P.y - A.y) - (B.y - A.y) * (P.x - A.x);
                        if (crossProduct < 0)
                            return "#97cb9a"
                        else {
                            A = { x: 0.81, y: 0 }
                            B = { x: 1.1, y: 7000 }
                            crossProduct = (B.x - A.x) * (P.y - A.y) - (B.y - A.y) * (P.x - A.x);
                            if (crossProduct < 0)
                                return "#77bb7c"
                            else {
                                A = { x: 0.225, y: 0 }
                                B = { x: 0.4, y: 7000 }
                                crossProduct = (B.x - A.x) * (P.y - A.y) - (B.y - A.y) * (P.x - A.x);
                                if (crossProduct < 0)
                                    return "#5daf64"
                                else {
                                    A = { x: 0.2, y: 0 }
                                    B = { x: 0.35, y: 7000 }
                                    crossProduct = (B.x - A.x) * (P.y - A.y) - (B.y - A.y) * (P.x - A.x);
                                    if (crossProduct < 0)
                                        return "#bedec0"
                                    else
                                        return "#c0bffd"
                                }
                            }
                        }
                    }
                }
            }
        })
        .on("mouseover", function (event, d) {
            let matrix = this.getScreenCTM().translate(
                +this.getAttribute("cx"),
                +this.getAttribute("cy")
            );

            tooltip
                .html(
                    "<b>" + d.name + "</b><br/>" +
                    "Temp: " + d.temp + " K<br/>" +
                    "Flux: " + d.flux
                )
                .style("opacity", 1)
                .style("left", window.pageXOffset + matrix.e + 15 + "px")
                .style("top", window.pageYOffset + matrix.f - 30 + "px");

            if (d.name == 'Teegardens Star b' || d.name == 'Earth') {
                d3.select(this).transition().duration(100).attr("r", 12);
                d3.select(this).style("fill", "lightblue");
                d3.select(this).style("stroke", "lightblue");
            }
        })
        .on("mouseout", function (event, d) {
            tooltip.style("opacity", 0);
            if (d.name == 'Teegardens Star b') {
                d3.select(this).transition().duration(100).attr("r", 8);
                d3.select(this).style("fill", "blue");
                d3.select(this).style("stroke", "blue");
            }
            else if (d.name == 'Earth') {
                d3.select(this).transition().duration(100).attr("r", 8);
                d3.select(this).style("fill", "white");
                d3.select(this).style("stroke", "white");
            }
        });

    const colors = [{ color: "#ffbfc0", zone: "Recent Venus" }, { color: "#bedec0", zone: "Runaway Greenhouse" }, { color: "#97cb9a", zone: "Runaway Greenhouse" }, { color: "#77bb7c", zone: "Runaway Greenhouse" }, { color: "#5daf64", zone: "Maximum Greenhouse" }, { color: "#c0bffd", zone: "Early Mars" }]

    colors.forEach((color, idx) => {
        svg.append("text")
            .attr("x", 910)
            .attr("y", 540 + idx * 20)
            .text(color.zone)
            .style("fill", color.color)
    })

})
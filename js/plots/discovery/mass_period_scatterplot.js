const uniques = (myArray) =>
  myArray.filter((value, index, array) => array.indexOf(value) === index);

function MassPeriodScatterPlot(
  data,
  { width, height, xAxis, yAxis, grid, x, y, shape, color }
) {
  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

  svg.append("g").attr("class", "dp3-x-axis").call(xAxis);

  svg.append("g").attr("class", "dp3-y-axis").call(yAxis);

  svg.append("g").attr("class", "dp3-grid").call(grid);

  svg
    .append("g")
    .attr("stroke-width", 1.5)
    .attr("font-family", "monospace")
    .attr("font-size", 10)
    .selectAll("path")
    .data(data)
    .join("path")
    .attr("transform", (d) => `translate(${x(d.x)},${y(d.y)})scale(0.5)`)
    .attr("fill", (d) => color(d.category))
    .attr("opacity", 0.6)
    .attr("d", (d) => shape(d.category))
    .attr("class", (d) => `mps_${d.category.replace(/ /g, "_")}`)
    .on("mouseover", (e, d) => {
      uniques(data.map((d_2) => d_2.category)).forEach((category, i) => {
        if (category === d.category) {
          d3.selectAll(`.mps_${category.replace(/ /g, "_")}`).attr(
            "opacity",
            0.9
          );
        } else {
          d3.selectAll(`.mps_${category.replace(/ /g, "_")}`).attr(
            "opacity",
            0.1
          );
        }
      });
    })
    .on("mouseout", (e, d) => {
      uniques(data.map((d_2) => d_2.category)).forEach((category, i) => {
        d3.selectAll(`.mps_${category.replace(/ /g, "_")}`).attr(
          "opacity",
          0.6
        );
      });
    });

  uniques(data.map((d) => d.category)).forEach((category, i) => {
    svg
      .append("text")
      .attr("x", 465)
      .attr("y", height - 75 - 15 * i)
      .attr("style", `color: ${color(category)}; font-size: 0.5rem`)
      .text(category);

    svg
      .append("path")
      .attr(
        "transform",
        `translate(${455},${height - 78.5 - 15 * i})scale(0.6)`
      )
      .attr("fill", color(category))
      .attr("d", shape(category))
      .attr("opacity", 0.8);
  });

  svg
    .append("text")
    .attr("x", 225)
    .attr("y", 15)
    .attr("style", "color: aliceblue; font-family: monospace;")
    .text("Mass Period Distribution");

  return svg.node();
}

async function drawScatterPlot() {
  let raw = await d3.csv("/data/mass_period_scatterplot.csv");

  const data = Object.values(
    raw.reduce((c, e) => {
      if (!c[e.pl_name]) c[e.pl_name] = e;
      return c;
    }, {})
  );

  data.forEach((d) => {
    d.category = d.discoverymethod;
    d.x = Number(d.pl_orbper);
    d.y = Number(d.pl_masse);
  });

  data.x = "Period (days) →";
  data.y = "↑ Earth Masses";

  // console.log(data.map((d) => d.pl_orbper).sort());

  const width = 600;
  const height = 400;
  const margin = { top: 25, right: 20, bottom: 35, left: 40 };

  const x = d3
    .scaleLog()
    .domain(d3.extent(data, (d) => d.x))
    .nice()
    .range([margin.left, width - margin.right]);

  const y = d3
    .scaleLog()
    .domain(d3.extent(data, (d) => d.y))
    .nice()
    .range([height - margin.bottom, margin.top]);

  const color = d3.scaleOrdinal(
    data.map((d) => d.category),
    d3.schemeCategory10
  );

  const shape = d3.scaleOrdinal(
    data.map((d) => d.category),
    d3.symbols.map((s) => d3.symbol().type(s)())
  );

  const xAxis = (g) =>
    g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(width / 80))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .append("text")
          .attr("x", width)
          .attr("y", margin.bottom - 4)
          .attr("fill", "currentColor")
          .attr("text-anchor", "end")
          .text(data.x)
      );

  const yAxis = (g) =>
    g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .append("text")
          .attr("x", -margin.left)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(data.y)
      );

  const grid = (g) =>
    g
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.1)
      .call((g) =>
        g
          .append("g")
          .selectAll("line")
          .data(x.ticks())
          .join("line")
          .attr("x1", (d) => 0.5 + x(d))
          .attr("x2", (d) => 0.5 + x(d))
          .attr("y1", margin.top)
          .attr("y2", height - margin.bottom)
      )
      .call((g) =>
        g
          .append("g")
          .selectAll("line")
          .data(y.ticks())
          .join("line")
          .attr("y1", (d) => 0.5 + y(d))
          .attr("y2", (d) => 0.5 + y(d))
          .attr("x1", margin.left)
          .attr("x2", width - margin.right)
      );

  const svg = MassPeriodScatterPlot(data, {
    width,
    height,
    xAxis,
    yAxis,
    grid,
    x,
    y,
    shape,
    color,
  });

  document.getElementById("discovery_plots3").appendChild(svg);
}

drawScatterPlot();

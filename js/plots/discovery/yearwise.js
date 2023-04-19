function StackedBarChart(
  data,
  { m: { lm, rm, tm, bm }, colorMap, ordinalSet }
) {
  const width = 600;
  const height = 400;

  const leftMargin = width * lm;
  const rightMargin = width * rm;
  const topMargin = height * tm;
  const bottomMargin = height * bm;

  const w = width - leftMargin - rightMargin;
  const h = height - topMargin - bottomMargin;

  const svg = d3
    .create("svg")
    .attr("id", "discovery-1")
    .attr("viewBox", "0 0 600 400")
    .attr("preserveAspectRatio", "none")
    .attr("width", "100%");

  // svg.append('svg')
  //   .attr('id', 'discovery-1-data')
  //   .attr('x', leftMargin)
  //   .attr('y', rightMargin);

  // const svgData = svg.select('#discovery-1-data');

  // draw x axis
  // svg.append('line')
  //   .attr('x1', 0).attr('x2', width)
  //   .attr('y1', h).attr('y2', h)
  //   .attr('style', 'stroke:black;stroke-width:1');

  const x = d3
    .scaleBand()
    .range([leftMargin, w + leftMargin])
    .domain(data.map((d) => d.year))
    .padding(0.1);

  const xAxis = d3.axisBottom(x).tickSizeOuter(0);

  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height - bottomMargin) + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("transform", "translate(0,4)rotate(-45)scale(0.7)")
    .style("text-anchor", "end")
    .style("fill", "white");

  svg.selectAll(".x.axis path").attr("stroke", "white");

  svg.selectAll(".x.axis line").attr("stroke", "white");

  const sumValues = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);
  const totals = data.map((d) => sumValues(d.data));
  // console.log(totals);
  // console.log([0, d3.max(totals)]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data.map((d) => sumValues(d.data))) + 250])
    .range([height - bottomMargin, topMargin]);

  svg
    .append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + leftMargin + "," + 0 + ")")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .attr("transform", "scale(0.7)")
    .style("text-anchor", "end")
    .style("fill", "white");

  svg.selectAll(".y.axis path").style("stroke", "white");

  svg.selectAll(".y.axis line").style("stroke", "white");

  const yearHeight = {};
  data.forEach((d) => {
    yearHeight[d.year] = 0;
  });

  ordinalSet.forEach((item, i) => {
    svg
      .selectAll("bars")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.year))
      .attr("y", (d) => y(d.data[item]) - yearHeight[d.year])
      .attr("width", x.bandwidth())
      .attr("height", (d) => {
        const rectHeight = height - y(d.data[item]) - bottomMargin;
        yearHeight[d.year] += rectHeight;
        return rectHeight;
      })
      .attr("fill", colorMap[item]);

    svg
      .append("text")
      .attr("transform", "scale(0.47)")
      .attr("x", leftMargin + 100)
      .attr("y", i * 30 + 200)
      .attr("fill", colorMap[item])
      .text(item);
  });

  svg
    .append("text")
    .attr("x", 200)
    .attr("y", 20)
    .text("Planets Detected per Year")
    .style("fill", "white");

  svg
    .append("text")
    .attr("transform", "rotate(-90, 30, 225)")
    .attr("x", 30)
    .attr("y", 225)
    .text("Number of Detections")
    .style("fill", "white");

  svg
    .append("text")
    .attr("x", 300)
    .attr("y", 370)
    .text("Year")
    .style("fill", "white");

  return svg.node();
}

async function draw() {
  let raw = await d3.csv("/data/stacked_discovery_year.csv");

  const years = raw
    .map((d) => d.disc_year)
    .filter((value, index, array) => array.indexOf(value) === index);
  years.push("1993"); // missing year
  years.sort();

  const methods = raw
    .map((d) => d.discoverymethod)
    .filter((value, index, array) => array.indexOf(value) === index);

  const out = Object.values(
    raw.reduce((c, e) => {
      if (!c[e.pl_name]) c[e.pl_name] = e;
      return c;
    }, {})
  );
  // console.log(out);
  raw = out;

  const data = [];
  years.forEach((year) => {
    const entry = {};
    methods.forEach((method) => {
      entry[method] = raw.filter(
        (d) => d.disc_year === year && d.discoverymethod === method
      ).length;
    });

    data.push({ year, data: entry });
  });

  const colors = [
    "9fc5e8",
    "586f7c",
    "2ec4b6",
    "609EA2",
    "ff9f1c",
    "2364aa",
    "3da5d9",
    "73bfb8",
    "C92C6D",
    "ea7317",
    "efdd8d",
  ];
  const colorMap = {};
  methods.forEach((method, i) => {
    // console.log(method, colors[i]);
    colorMap[method] = "#" + colors[i];
  });

  const svg = StackedBarChart(data, {
    m: { lm: 0.1, rm: 0.05, tm: 0.03, bm: 0.2 },
    colorMap,
    ordinalSet: methods,
  });

  document.getElementById("discovery_plots").appendChild(svg);

  return raw;
}

draw();

function StackedBarChart(data, { m: { lm, rm, tm, bm }, colorMap }) {
  const width = 600;
  const height = 400;

  const leftMargin = width * lm;
  const rightMargin = width * rm;
  const topMargin = height * tm;
  const bottomMargin = height * bm;

  const w = width - leftMargin - rightMargin;
  const h = height - topMargin - bottomMargin;

  const svg = d3.create('svg')
    .attr('id', 'discovery-1')
    .attr('viewBox', '0 0 600 400')
    .attr('preserveAspectRatio', 'none')
    .attr('width', '100%');
  
  svg.append('svg')
    .attr('id', 'discovery-1-data')
    .attr('x', leftMargin)
    .attr('y', rightMargin);

  const svgData = svg.select('#discovery-1-data');

  // draw x axis
  // svg.append('line')
  //   .attr('x1', 0).attr('x2', width)
  //   .attr('y1', h).attr('y2', h)
  //   .attr('style', 'stroke:black;stroke-width:1');

  const x = d3.scaleBand()
    .range([leftMargin, w + leftMargin])
    .domain(data.map(d => d.year));

  svg.append("g")
    .attr("transform", "translate(0," + (height - bottomMargin) + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(0,4)rotate(-45)scale(0.7)")
      .style("text-anchor", "end");

  const sumValues = obj => Object.values(obj).reduce((a, b) => a + b, 0);
  const totals = data.map(d => sumValues(d.data));
  console.log(totals);
  console.log([0, d3.max(totals)]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data.map(d => sumValues(d.data)))])
    .range([height, 0]);

  svg.append("g")
    .attr("transform", "translate(" + leftMargin + "," +  + ")")
    .call(d3.axisLeft(y))
    .selectAll("text")
      .attr("transform", "scale(0.7)")
      .style("text-anchor", "end");

  return svg.node();
}

async function draw() {
  const raw = await d3.csv('/data/stacked_discovery_year.csv');

  const years = raw.map(d => d.disc_year)
    .filter((value, index, array) => array.indexOf(value) === index);
  years.push('1993'); // missing year
  years.sort();

  const methods = raw.map(d => d.discoverymethod)
  .filter((value, index, array) => array.indexOf(value) === index);
  
  const data = [];
  years.forEach(year => {
    const entry = {};
    methods.forEach(method => {
      entry[method] = raw.filter(d => d.disc_year === year && d.discoverymethod === method).length;
      if (entry[method] > 12000) {
        console.log(year, method);
      }
    });

    data.push({ year, data: entry });
  });

  const colors = [
    '#03071e','#370617','#6a040f','#9d0208','#d00000',
    '#dc2f02','#e85d04','#f48c06','#faa307','#ffba08',
    '#8d99ae'
  ];
  const colorMap = {};
  methods.forEach((method, i) => {
    colorMap[method] = colors[i];
  });

  const svg = StackedBarChart(data, {
    m: { lm: 0.05, rm: 0.05, tm: 0.05, bm: 0.1 },
    colorMap
  });

  document.getElementById('discovery_plots').appendChild(svg);

  return raw;
}

draw();
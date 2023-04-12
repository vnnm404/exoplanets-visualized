function StackedBarChart(data, { m: { lm, rm, tm, bm } }) {
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
    .attr('viewbox', '0 0 600 400')
    .attr('preserveAspectRatio', 'none')
    .attr('width', '100%');
  
  svg.append('svg')
    .attr('id', 'discovery-1-data')
    .attr('x', leftMargin)
    .attr('y', rightMargin);

  const svgData = svg.select('#discovery-1-data');

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
    });

    data.push({ year, data: entry });
  });

  const svg = StackedBarChart(data, {
    m: { lm: 0.05, rm: 0.05, tm: 0.05, bm: 0.05 }
  });

  

  return raw;
}

draw();
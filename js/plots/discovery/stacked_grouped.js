function chart(y01z, { width, height, margin, xAxis, y, yMax, x, n, y1Max, z, methods }) {
  const svg = d3.create('svg')
    .attr('preserveAspectRatio', 'none')
    .attr('width', '100%')
    .attr('viewBox', [0, 0, width, height]);

  const rect = svg.selectAll('g')
    .data(y01z)
    .join('g')
    .attr('fill', (d, i) => {
      console.log(i, z(i));
      svg.append('text')
        .attr('x', 50)
        .attr('y', height - 200 - 15 * i)
        .attr('style', `color: ${z(i)}; font-size: 0.5rem;`)
        .text(methods[i]);
      return z(i);
    })
    .selectAll('rect')
    .data(d => d)
    .join('rect')
    .attr('x', (d, i) => {
      // console.log(i + 1992);
      return x(i);
    })
    .attr('y', height - margin.bottom)
    .attr('width', x.bandwidth())
    .attr('height', 0);

  svg.append('g')
    .attr('class', 'dp2-x-axis')
    .call(xAxis)
    .selectAll('text')
    .attr('transform', 'scale(0.8)translate(-16,25)rotate(-90)');

  const yAxis = svg => svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  const yG = svg.append('g')
    .attr('class', 'dp2-y-axis')
    .call(yAxis);

  yG.selectAll('line')
    .each((d, i) => {
      if (!d) return;

      yG.append('line')
        .attr('x1', margin.left)
        .attr('x2', width - margin.right - 4)
        .attr('y1', y(d))
        .attr('y2', y(d))
        .attr('style', 'stroke: rgba(244, 244, 248, 0.1); stoke-width: 1;');
    });

  yG.selectAll('text')
    .attr('transform', 'scale(0.9)');

  svg.append('text')
    .attr('x', width / 2 - 60)
    .attr('y', 15)
    .attr('style', 'color: aliceblue;')
    .text('Detections Per Year');

  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - 4)
    .attr('style', 'color: aliceblue; font-size: 0.6rem;')
    .text('Year');

  svg.append('text')
    .attr('x', 0)
    .attr('y', 17)
    .attr('style', 'color: aliceblue; font-size: 0.6rem;')
    .text('Number of Detections');

  function transitionGrouped() {
    y.domain([0, yMax + 200]);

    rect.transition()
      .duration(500)
      .delay((d, i) => i * 20)
      .attr('x', (d, i) => x(i) + x.bandwidth() / n * d[2])
      .attr('width', x.bandwidth() / n)
      .transition()
      .attr('y', d => y(d[1] - d[0]))
      .attr('height', d => y(0) - y(d[1] - d[0]));
  }

  function transitionStacked() {
    y.domain([0, y1Max + 200]);

    rect.transition()
      .duration(500)
      .delay((d, i) => i * 20)
      .attr('y', d => y(d[1]))
      .attr('height', d => y(d[0]) - y(d[1]))
      .transition()
      .attr('x', (d, i) => x(i))
      .attr('width', x.bandwidth());
  }

  function update(layout) {
    if (layout === 'stacked') transitionStacked();
    else transitionGrouped();
  }

  return Object.assign(svg.node(), { update });
}

async function draw() {
  let raw = await d3.csv('/data/stacked_grouped_data.csv');

  const out = Object.values(
    raw.reduce((c, e) => {
      if (!c[e.pl_name]) c[e.pl_name] = e;
      return c;
    }, {})
  );

  raw = out;

  let years = raw.map(d => d.disc_year)
    .filter((value, index, array) => array.indexOf(value) === index);
  years.push('1993'); // missing year
  years.sort();
  // years = years.map(year => Number(year));

  const methods = raw.map(d => d.discoverymethod)
    .filter((value, index, array) => array.indexOf(value) === index);

  const width = 600;
  const height = 400;
  const margin = { top: 0, right: 0, bottom: 50, left: 30 };
  const xAxis = svg => svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickPadding(6).tickSizeOuter(0).tickFormat(i => {
      // console.log(i);
      return `${i + 1992}`;
    }));

  const xz = d3.range(years.length);
  const yz = [];
  const n = methods.length;

  methods.forEach(method => {
    const yRow = [];
    years.forEach(year => {
      yRow.push(
        raw.filter(d => d.discoverymethod === method && d.disc_year === year).length
      );
    });
    yz.push(yRow);
  });

  const y01z = d3.stack()
    .keys(d3.range(n))
    (d3.transpose(yz))
    .map((data, i) => data.map(([y0, y1]) => [y0, y1, i]));

  const z = d3.scaleSequential(d3.interpolateReds)
    .domain([-0.5 * n, 1.5 * n]);

  // console.log(y01z);

  const yMax = d3.max(yz, y => d3.max(y));
  const y1Max = d3.max(y01z, y => d3.max(y, d => d[1]));
  const y = d3.scaleLinear()
    .domain([0, y1Max + 250])
    .range([height - margin.bottom, margin.top]);

  const x = d3.scaleBand()
    .domain(xz)
    .rangeRound([margin.left, width - margin.right])
    .padding(0.08);

  // { width, height, margin, xAxis, y, yMax, x, n, y1Max }
  const svg = chart(y01z, {
    width, height, margin, xAxis, y, yMax, x, n, y1Max, z, methods
  });
  svg.update('stacked');

  document.getElementById('Stacked').addEventListener('click', () => {
    svg.update('stacked');
  });

  document.getElementById('Grouped').addEventListener('click', () => {
    svg.update('grouped');
  });

  document.getElementById('discovery_plots2').appendChild(svg);
}

draw();


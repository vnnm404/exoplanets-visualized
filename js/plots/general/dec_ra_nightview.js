/*
# This file was produced by the NASA Exoplanet Archive  http://exoplanetarchive.ipac.caltech.edu
# Tue Apr 25 09:30:54 2023
#
# User preference: *
#
# CONSTRAINT:  where (pl_radestr > 0
# CONSTRAINT:  and rastr > 0
# CONSTRAINT:  and decstr > 0)
#
# COLUMN pl_name:        Planet Name
# COLUMN hostname:       Host Name
# COLUMN sy_snum:        Number of Stars
# COLUMN sy_pnum:        Number of Planets
# COLUMN pl_refname:     Planetary Parameter Reference
# COLUMN pl_orbper:      Orbital Period [days]
# COLUMN pl_orbpererr1:  Orbital Period Upper Unc. [days]
# COLUMN pl_orbpererr2:  Orbital Period Lower Unc. [days]
# COLUMN pl_orbperlim:   Orbital Period Limit Flag
# COLUMN pl_orbsmax:     Orbit Semi-Major Axis [au])
# COLUMN pl_orbsmaxerr1: Orbit Semi-Major Axis Upper Unc. [au]
# COLUMN pl_orbsmaxerr2: Orbit Semi-Major Axis Lower Unc. [au]
# COLUMN pl_orbsmaxlim:  Orbit Semi-Major Axis Limit Flag
# COLUMN pl_rade:        Planet Radius [Earth Radius]
# COLUMN pl_radeerr1:    Planet Radius Upper Unc. [Earth Radius]
# COLUMN pl_radeerr2:    Planet Radius Lower Unc. [Earth Radius]
# COLUMN pl_radelim:     Planet Radius Limit Flag
# COLUMN pl_radj:        Planet Radius [Jupiter Radius]
# COLUMN pl_radjerr1:    Planet Radius Upper Unc. [Jupiter Radius]
# COLUMN pl_radjerr2:    Planet Radius Lower Unc. [Jupiter Radius]
# COLUMN pl_radjlim:     Planet Radius Limit Flag
# COLUMN pl_bmasse:      Planet Mass or Mass*sin(i) [Earth Mass]
# COLUMN pl_bmasseerr1:  Planet Mass or Mass*sin(i) [Earth Mass] Upper Unc.
# COLUMN pl_bmasseerr2:  Planet Mass or Mass*sin(i) [Earth Mass] Lower Unc.
# COLUMN pl_bmasselim:   Planet Mass or Mass*sin(i) [Earth Mass] Limit Flag
# COLUMN pl_bmassj:      Planet Mass or Mass*sin(i) [Jupiter Mass]
# COLUMN pl_bmassjerr1:  Planet Mass or Mass*sin(i) [Jupiter Mass] Upper Unc.
# COLUMN pl_bmassjerr2:  Planet Mass or Mass*sin(i) [Jupiter Mass] Lower Unc.
# COLUMN pl_bmassjlim:   Planet Mass or Mass*sin(i) [Jupiter Mass] Limit Flag
# COLUMN pl_orbeccen:    Eccentricity
# COLUMN pl_orbeccenerr1: Eccentricity Upper Unc.
# COLUMN pl_orbeccenerr2: Eccentricity Lower Unc.
# COLUMN pl_orbeccenlim: Eccentricity Limit Flag
# COLUMN pl_insol:       Insolation Flux [Earth Flux]
# COLUMN pl_insolerr1:   Insolation Flux Upper Unc. [Earth Flux]
# COLUMN pl_insolerr2:   Insolation Flux Lower Unc. [Earth Flux]
# COLUMN pl_insollim:    Insolation Flux Limit Flag
# COLUMN pl_eqt:         Equilibrium Temperature [K]
# COLUMN pl_eqterr1:     Equilibrium Temperature Upper Unc. [K]
# COLUMN pl_eqterr2:     Equilibrium Temperature Lower Unc. [K]
# COLUMN pl_eqtlim:      Equilibrium Temperature Limit Flag
# COLUMN st_refname:     Stellar Parameter Reference
# COLUMN st_spectype:    Spectral Type
# COLUMN st_teff:        Stellar Effective Temperature [K]
# COLUMN st_tefferr1:    Stellar Effective Temperature Upper Unc. [K]
# COLUMN st_tefferr2:    Stellar Effective Temperature Lower Unc. [K]
# COLUMN st_tefflim:     Stellar Effective Temperature Limit Flag
# COLUMN st_rad:         Stellar Radius [Solar Radius]
# COLUMN st_raderr1:     Stellar Radius Upper Unc. [Solar Radius]
# COLUMN st_raderr2:     Stellar Radius Lower Unc. [Solar Radius]
# COLUMN st_radlim:      Stellar Radius Limit Flag
# COLUMN st_mass:        Stellar Mass [Solar mass]
# COLUMN st_masserr1:    Stellar Mass Upper Unc. [Solar mass]
# COLUMN st_masserr2:    Stellar Mass Lower Unc. [Solar mass]
# COLUMN st_masslim:     Stellar Mass Limit Flag
# COLUMN rastr:          RA [sexagesimal]
# COLUMN ra:             RA [deg]
# COLUMN decstr:         Dec [sexagesimal]
# COLUMN dec:            Dec [deg]
# COLUMN sy_dist:        Distance [pc]
# COLUMN sy_disterr1:    Distance [pc] Upper Unc
# COLUMN sy_disterr2:    Distance [pc] Lower Unc
#
*/

function formatTitle(d) {
  return d.pl_name + "\n" + d.category;
}

function StarMap(
  data,
  {
    width,
    height,
    path,
    radius,
    graticule,
    outline,
    xAxis,
    yAxis,
    projection,
    voronoi,
  }
) {
  const cx = width / 2;
  const cy = height / 2;

  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "middle")
    .attr("fill", "currentColor")
    .attr("preserveAspectRatio", "none")
    .style("margin", "0 -14px")
    .style("color", "white")
    .style("background", "radial-gradient(#081f2b 0%, #061616 100%)")
    .style("display", "block");

  svg
    .append("path")
    .attr("d", path(graticule))
    .attr("fill", "none")
    .attr("stroke", "currentColor")
    .attr("stroke-opacity", 0.2);

  svg
    .append("path")
    .attr("d", path(outline))
    .attr("fill", "none")
    .attr("stroke", "currentColor");

  svg.append("g").call(xAxis);

  svg.append("g").call(yAxis);

  const focusDeclination = svg
    .append("circle")
    .attr("cx", cx)
    .attr("cy", cy)
    .attr("fill", "none")
    .attr("stroke", "yellow");

  const focusRightAscension = svg
    .append("line")
    .attr("x1", cx)
    .attr("y1", cy)
    .attr("x2", cx)
    .attr("y2", cy)
    .attr("stroke", "yellow");

  svg
    .append("g")
    .attr("stroke", "black")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("r", (d) => {
      if (d.pl_name.startsWith("Tee")) return 12;
      return radius(d.magnitude);
    })
    .attr("opacity", (d) => {
      if (d.pl_name.startsWith("Tee")) return 1;
      return 0.7;
    })
    .attr("stroke", (d) => {
      if (d.pl_name.startsWith("Tee")) return "white";
      return "none";
    })
    .attr("stroke-width", (d) => {
      if (d.pl_name.startsWith("Tee")) return 3;
      return 0;
    })
    .attr("fill", (d) => {
      if (d.pl_name.startsWith("Kepler")) return "pink";
      if (d.pl_name.startsWith("K2")) return "lightblue";
      if (d.pl_name.startsWith("TOI")) return "teal";
      if (d.pl_name.startsWith("HAT")) return "lightbrown";
      if (d.pl_name.startsWith("WASP")) return "lightcoral";
      if (d.pl_name.startsWith("Tee")) return "blue";

      return "white";
    })
    .attr("transform", (d) => `translate(${projection(d)})`);

  svg
    .append("g")
    .attr("pointer-events", "all")
    .attr("fill", "none")
    .selectAll("path")
    .data(data)
    .join("path")
    .on("mouseover", mouseovered)
    .on("mouseout", mouseouted)
    .attr("d", (d, i) => voronoi.renderCell(i))
    .append("title")
    .text(formatTitle);

  function mouseovered(event, d) {
    const [px, py] = projection(d);
    const dx = px - cx;
    const dy = py - cy;
    const a = Math.atan2(dy, dx);
    focusDeclination.attr("r", Math.hypot(dx, dy));
    focusRightAscension
      .attr("x2", cx + 1e3 * Math.cos(a))
      .attr("y2", cy + 1e3 * Math.sin(a));
  }

  function mouseouted(event, d) {
    focusDeclination.attr("r", null);
    focusRightAscension.attr("x2", cx).attr("y2", cy);
  }

  return svg.node();
}

function categorizePlanetByRadius(planetRadius) {
  if (planetRadius < 0.5) {
    return "terran"; // planet smaller than half the size of Earth
  } else if (planetRadius < 0.8) {
    return "subterran"; // planet between half and 80% the size of Earth
  } else if (planetRadius < 1.25) {
    return "terran equivalent"; // planet between 80% and 125% the size of Earth
  } else if (planetRadius < 2) {
    return "superterran"; // planet between 125% and 200% the size of Earth
  } else if (planetRadius < 6) {
    return "mini-Neptunian"; // planet between 200% and 600% the size of Earth
  } else if (planetRadius < 10) {
    return "gas giant"; // planet larger than 600% the size of Earth
  }

  return null;
}

async function drawScatterPlot() {
  let raw = await d3.csv("/data/ra_dec_nightview.csv");

  let data = Object.values(
    raw.reduce((c, e) => {
      if (!c[e.pl_name]) c[e.pl_name] = e;
      return c;
    }, {})
  );

  data.push({
    pl_name: "Teegarden's Star b",
    pl_rade: 1.02,
    decstr: "+16d51m53.65s",
    rastr: "02h53m04.59s",
  });

  data = data.filter((d) => {
    const category = categorizePlanetByRadius(Number(d.pl_rade));
    if (category) {
      d.category = category;
      return true;
    }
    return false;
  });

  function decToDMS(decStr) {
    const [d, m, s] = decStr.split(/[dms]/).map(parseFloat);
    const sign = decStr.includes("-") ? -1 : 1;
    return [
      sign * (Math.abs(d) + m / 60 + s / 3600),
      sign * Math.abs(m),
      sign * Math.abs(s),
    ];
  }

  function raToHMS(raStr) {
    const [h, m, s] = raStr.split(/[hms]/).map(parseFloat);
    return [h + m / 60 + s / 3600, m, s];
  }

  data.forEach((d) => {
    const [decdeg, decmin, decsec] = decToDMS(d.decstr);
    const [rahour, ramin, rasec] = raToHMS(d.rastr);

    d.RA_hour = rahour;
    d.RA_min = ramin;
    d.RA_sec = rasec;
    d.dec_deg = decdeg;
    d.dec_min = decmin;
    d.dec_sec = decsec;
    d.magnitude = d.pl_rade;
    d[0] = (d.RA_hour + d.RA_min / 60 + d.RA_sec / 3600) * 15; // longitude
    d[1] = d.dec_deg + d.dec_min / 60 + d.dec_sec / 3600; // latitude
  });

  const width = 982;
  const height = 982;
  const scale = (width - 120) * 0.5;

  const projection = d3
    .geoStereographic()
    .reflectY(true)
    .scale(scale)
    .clipExtent([
      [0, 0],
      [width, height],
    ])
    .rotate([0, -90])
    .translate([width / 2, height / 2])
    .precision(0.1);
  const path = d3.geoPath(projection);
  const radius = d3.scaleLinear([0, 10], [0, 9]);
  const graticule = d3.geoGraticule().stepMinor([15, 10])();
  const outline = d3.geoCircle().radius(90).center([0, 90])();

  const xAxis = (g) =>
    g
      .call((g) =>
        g
          .append("g")
          .attr("stroke", "currentColor")
          .selectAll("line")
          .data(d3.range(0, 1440, 5)) // every 5 minutes
          .join("line")
          .datum((d) => [
            projection([d / 4, 0]),
            projection([d / 4, d % 60 ? -1 : -2]),
          ])
          .attr("x1", ([[x1]]) => x1)
          .attr("x2", ([, [x2]]) => x2)
          .attr("y1", ([[, y1]]) => y1)
          .attr("y2", ([, [, y2]]) => y2)
      )
      .call((g) =>
        g
          .append("g")
          .selectAll("text")
          .data(d3.range(0, 1440, 60)) // every hour
          .join("text")
          .attr("dy", "0.35em")
          .text((d) => `${d / 60}h`)
          .attr("font-size", (d) => (d % 360 ? null : 14))
          .attr("font-weight", (d) => (d % 360 ? null : "bold"))
          .datum((d) => projection([d / 4, -4]))
          .attr("x", ([x]) => x)
          .attr("y", ([, y]) => y)
      );

  const yAxis = (g) =>
    g.call((g) =>
      g
        .append("g")
        .selectAll("text")
        .data(d3.range(10, 91, 10)) // every 10°
        .join("text")
        .attr("dy", "0.35em")
        .text((d) => `${d}°`)
        .datum((d) => projection([0, d]))
        .attr("x", ([x]) => x)
        .attr("y", ([, y]) => y)
    );

  const voronoi = d3.Delaunay.from(data.map(projection)).voronoi([
    0,
    0,
    width,
    height,
  ]);

  const svg = StarMap(data, {
    width,
    height,
    path,
    radius,
    graticule,
    outline,
    xAxis,
    yAxis,
    projection,
    voronoi,
  });
  document.getElementById("nightsky").appendChild(svg);
}

drawScatterPlot();

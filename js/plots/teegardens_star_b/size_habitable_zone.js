// Define constants
const width = 400;
const height = 600;
const earthRadius = 10;
const teegardenRadius = 15;
const earthOrbitRadius = 100;
const teegardenOrbitRadius = 150;
const earthOrbitPeriod = 2000; // in milliseconds
const teegardenOrbitPeriod = 3000; // in milliseconds
const numPlanets = 5;
const planetRadius = 5;
const planetOrbitRadius = 30;
const planetOrbitPeriod = 1000; // in milliseconds

// Define data for the solar systems
const earthSystem = {
  name: "Earth System",
  star: {
    radius: earthRadius,
    orbitRadius: 0,
    orbitPeriod: 0,
    color: "yellow",
  },
  planets: [
    {
      name: "Mercury",
      radius: planetRadius,
      orbitRadius: planetOrbitRadius * 1,
      orbitPeriod: planetOrbitPeriod * 1,
      color: "gray",
    },
    {
      name: "Venus",
      radius: planetRadius,
      orbitRadius: planetOrbitRadius * 2,
      orbitPeriod: planetOrbitPeriod * 2,
      color: "orange",
    },
    {
      name: "Earth",
      radius: planetRadius,
      orbitRadius: planetOrbitRadius * 3,
      orbitPeriod: planetOrbitPeriod * 3,
      color: "blue",
    },
    {
      name: "Mars",
      radius: planetRadius,
      orbitRadius: planetOrbitRadius * 4,
      orbitPeriod: planetOrbitPeriod * 4,
      color: "red",
    },
    {
      name: "Jupiter",
      radius: planetRadius,
      orbitRadius: planetOrbitRadius * 5,
      orbitPeriod: planetOrbitPeriod * 5,
      color: "brown",
    },
  ],
};

const teegardenSystem = {
  name: "Teegarden System",
  star: {
    radius: teegardenRadius,
    orbitRadius: 0,
    orbitPeriod: 0,
    color: "yellow",
  },
  planets: [
    {
      name: "Planet 1",
      radius: planetRadius,
      orbitRadius: planetOrbitRadius * 1,
      orbitPeriod: planetOrbitPeriod * 1,
      color: "gray",
    },
    {
      name: "Planet 2",
      radius: planetRadius,
      orbitRadius: planetOrbitRadius * 2,
      orbitPeriod: planetOrbitPeriod * 2,
      color: "orange",
    },
    {
      name: "Planet 3",
      radius: planetRadius,
      orbitRadius: planetOrbitRadius * 3,
      orbitPeriod: planetOrbitPeriod * 3,
      color: "blue",
    },
    {
      name: "Planet 4",
      radius: planetRadius,
      orbitRadius: planetOrbitRadius * 4,
      orbitPeriod: planetOrbitPeriod * 4,
      color: "red",
    },
    {
      name: "Planet 5",
      radius: planetRadius,
      orbitRadius: planetOrbitRadius * 5,
      orbitPeriod: planetOrbitPeriod * 5,
      color: "brown",
    },
  ],
};

// Define function to draw a solar system
function drawSystem(system, svg) {
  // console.log(system);
  svg
    .append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("style", "font-family: monospace; color: white; font-size: 1.5rem;")
    .text(system.name);

  // Draw star
  svg
    .append("circle")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", system.star.radius)
    .attr("fill", system.star.color);

  // Draw planets
  for (let i = 0; i < numPlanets; i++) {
    const planet = system.planets[i];
    const planetGroup = svg.append("g");
    planetGroup
      .append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", planet.orbitRadius)
      .attr("stroke", "gray")
      .attr("fill", "none");
    const planetCircle = planetGroup
      .append("circle")
      .attr("r", planet.radius)
      .attr("fill", planet.color);
    const planetPath = planetGroup
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "gray");
    animatePlanet(
      planetCircle,
      planetPath,
      planet.orbitRadius,
      planet.orbitPeriod
    );
  }
}

function animatePlanet(planetCircle, planetPath, orbitRadius, orbitPeriod) {
  const cx = width / 2;
  const cy = height / 2;
  const duration = orbitPeriod;
  d3.timer((elapsed) => {
    const angle = (2 * Math.PI * elapsed) / duration;
    const x = cx + orbitRadius * Math.cos(angle);
    const y = cy + orbitRadius * Math.sin(angle);
    planetCircle.attr("cx", x).attr("cy", y);
  });
}

// Define function to describe an arc path
function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");
}

// Define function to convert polar to cartesian coordinates
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

// Draw solar systems
drawSystem(earthSystem, d3.select("#earth-system"));
drawSystem(teegardenSystem, d3.select("#teegarden-system"));

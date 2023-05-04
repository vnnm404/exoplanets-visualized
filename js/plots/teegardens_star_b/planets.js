// Set the dimensions of the canvas
const width = 500;
const height = 500;

// Create a projection for the earth
const projection = d3.geoOrthographic().translate([width / 2, height / 2]).scale(250).clipAngle(90);

// Create a path generator for the projection
const path = d3.geoPath().projection(projection);

// Create an SVG element inside the 'Earth-rotating' div
const svg = d3.select('#Earth-rotating').append('svg')
    .attr('width', width)
    .attr('height', height);

// Load the world data
d3.json('https://unpkg.com/world-atlas/world/110m.json').then(world => {

    // Draw the land polygons
    svg.append('path')
        .datum(topojson.feature(world, world.objects.land))
        .attr('d', path)
        .attr('fill', '#ccc');

    // Draw the water polygons
    svg.append('path')
        .datum(topojson.feature(world, world.objects.water))
        .attr('d', path)
        .attr('fill', '#aadaff');

    // Define a rotation function
    const rotate = () => {
        const currentRotation = projection.rotate();
        projection.rotate([currentRotation[0] + 0.1, currentRotation[1]]);
        svg.selectAll('path').attr('d', path);
    }

    // Start the rotation animation
    d3.interval(rotate, 10);
});

// scatterplot.js
(function(){
const rawData = [
    { year: 2018, type: "Painting", count: 5 },
    { year: 2018, type: "Sculpture", count: 3 },
    { year: 2018, type: "Writing", count: 8 },
    { year: 2019, type: "Painting", count: 7 },
    { year: 2019, type: "Sculpture", count: 4 },
    { year: 2019, type: "Writing", count: 6 },
    { year: 2020, type: "Painting", count: 2 },
    { year: 2020, type: "Sculpture", count: 6 },
    { year: 2020, type: "Writing", count: 10 },
    { year: 2021, type: "Painting", count: 4 },
    { year: 2021, type: "Sculpture", count: 5 },
    { year: 2021, type: "Writing", count: 7 },
    { year: 2022, type: "Painting", count: 6 },
    { year: 2022, type: "Sculpture", count: 2 },
    { year: 2022, type: "Writing", count: 9 }
];

// Aggregate data
const data = d3.rollup(
    rawData,
    v => ({ year: v[0].year, type: v[0].type, count: d3.sum(v, d => d.count) }),
    d => d.year + "_" + d.type
);

const aggregatedData = Array.from(data.values());

// Responsive dimensions
const margin = { top: 40, right: 80, bottom: 60, left: 100 };
const width = Math.min(800, window.innerWidth * 0.9) - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// Create SVG container
const svg = d3.select("#vis-scatterplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Scales
const xScale = d3.scaleBand()
    .domain([...new Set(aggregatedData.map(d => d.year))].sort())
    .range([0, width])
    .padding(0.1);

const yScale = d3.scaleBand()
    .domain([...new Set(aggregatedData.map(d => d.type))])
    .range([0, height])
    .padding(0.2);

const rScale = d3.scaleSqrt()
    .domain([0, d3.max(aggregatedData, d => d.count)])
    .range([5, 20]);

const colorScale = d3.scaleOrdinal()
    .domain([...new Set(aggregatedData.map(d => d.type))])
    .range(["#1a73e8", "#34c759", "#ff9500"]);

// Axes
svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale))
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .text("Year");

svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale))
    .append("text")
    .attr("class", "axis-label")
    .attr("x", -height / 2)
    .attr("y", -60)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Type of Creative Work");

// Tooltip (select existing element)
const tooltip = d3.select(".tooltip");

// Dots
svg.selectAll(".dot")
    .data(aggregatedData)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d.year) + xScale.bandwidth() / 2)
    .attr("cy", d => yScale(d.type) + yScale.bandwidth() / 2)
    .attr("r", d => rScale(d.count))
    .attr("fill", d => colorScale(d.type))
    .on("mouseover", function(event, d) {
        d3.select(this).attr("fill", d3.rgb(colorScale(d.type)).brighter(0.5));
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`Year: ${d.year}<br>Type: ${d.type}<br>Count: ${d.count}`)
            .style("left", Math.min(event.pageX + 10, window.innerWidth - 100) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
        d3.select(this).attr("fill", d => colorScale(d.type));
        tooltip.transition().duration(500).style("opacity", 0);
    });

// Legend for colors
const legend = svg.append("g")
    .attr("transform", `translate(${width + 20}, 20)`);

const types = [...new Set(aggregatedData.map(d => d.type))];
types.forEach((type, i) => {
    legend.append("circle")
        .attr("cx", 0)
        .attr("cy", i * 25)
        .attr("r", 6)
        .attr("fill", colorScale(type));
    legend.append("text")
        .attr("x", 15)
        .attr("y", i * 25 + 4)
        .text(type)
        .style("font-size", "12px");
});

// Legend for dot size
const sizes = [5, 10, 15];
const sizeLegend = svg.append("g")
    .attr("transform", `translate(${width + 20}, ${types.length * 25 + 30})`);
sizeLegend.append("text")
    .attr("x", 0)
    .attr("y", -10)
    .text("Count")
    .style("font-size", "12px");
sizes.forEach((size, i) => {
    sizeLegend.append("circle")
        .attr("cx", 0)
        .attr("cy", i * 25 + 10)
        .attr("r", rScale(size))
        .attr("fill", "#999");
    sizeLegend.append("text")
        .attr("x", 15)
        .attr("y", i * 25 + 14)
        .text(size)
        .style("font-size", "12px");
});

// Title
svg.append("text")
    .attr("x", width / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Creative Works by Year and Type");

})();
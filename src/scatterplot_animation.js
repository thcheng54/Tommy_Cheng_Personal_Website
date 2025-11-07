// scatterplot_animation.js - ENHANCED WITH FULL INTERACTIVE CONTROLS
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

// Get unique years for animation
const years = [...new Set(aggregatedData.map(d => d.year))].sort();
let currentYearIndex = 0;
let animationSpeed = 1500; // Default speed in milliseconds

// Responsive dimensions
const margin = { top: 60, right: 120, bottom: 100, left: 100 }; // Increased bottom margin for controls
const width = Math.min(800, window.innerWidth * 0.9) - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// Create SVG container
const svg = d3.select("#vis-scatterplot_animation")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Scales
const xScale = d3.scaleBand()
    .domain(years)
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

// Year highlight overlay
const yearHighlight = svg.append("rect")
    .attr("class", "year-highlight")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", xScale.bandwidth())
    .attr("height", height)
    .attr("fill", "#1a73e8")
    .attr("opacity", 0.1)
    .style("display", "none");

// Year label for animation
const yearLabel = svg.append("text")
    .attr("class", "year-label")
    .attr("x", width / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .style("fill", "#1a73e8");

// Create dots group
const dotsGroup = svg.append("g").attr("class", "dots-group");

// Function to update visualization for a specific year
function updateYear(yearIndex) {
    const year = years[yearIndex];
    const yearData = aggregatedData.filter(d => d.year === year);
    
    // Update year label
    yearLabel.text(`Creative Works in ${year}`);
    
    // Update year highlight position
    yearHighlight
        .attr("x", xScale(year))
        .style("display", "block");
    
    // Update slider display
    yearSlider.property("value", yearIndex);
    sliderYearDisplay.text(`Year: ${year}`);
    
    // Update dots with animation
    const dots = dotsGroup.selectAll(".dot")
        .data(yearData, d => d.type);
    
    // Remove old dots
    dots.exit()
        .transition()
        .duration(500)
        .attr("r", 0)
        .remove();
    
    // Update existing dots
    dots.transition()
        .duration(500)
        .attr("cx", d => xScale(d.year) + xScale.bandwidth() / 2)
        .attr("cy", d => yScale(d.type) + yScale.bandwidth() / 2)
        .attr("r", d => rScale(d.count));
    
    // Add new dots
    dots.enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.year) + xScale.bandwidth() / 2)
        .attr("cy", d => yScale(d.type) + yScale.bandwidth() / 2)
        .attr("r", 0)
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
        })
        .transition()
        .duration(500)
        .attr("r", d => rScale(d.count));
}

// ANIMATION CONTROLS CONTAINER
const controlsContainer = svg.append("g")
    .attr("class", "animation-controls")
    .attr("transform", `translate(0, ${height + 50})`);

// Main controls row
const mainControls = controlsContainer.append("g")
    .attr("class", "main-controls");

// Previous Year Button
const prevButton = mainControls.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 40)
    .attr("height", 30)
    .attr("rx", 5)
    .attr("fill", "#1a73e8")
    .style("cursor", "pointer")
    .attr("class", "control-btn");

mainControls.append("text")
    .attr("x", 20)
    .attr("y", 19)
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .style("font-size", "12px")
    .style("pointer-events", "none")
    .text("◀");

// Play/Pause button
const playButton = mainControls.append("rect")
    .attr("x", 50)
    .attr("y", 0)
    .attr("width", 60)
    .attr("height", 30)
    .attr("rx", 5)
    .attr("fill", "#1a73e8")
    .style("cursor", "pointer")
    .attr("class", "control-btn");

const playButtonText = mainControls.append("text")
    .attr("x", 80)
    .attr("y", 19)
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .style("font-size", "12px")
    .style("pointer-events", "none")
    .text("Play");

// Next Year Button
const nextButton = mainControls.append("rect")
    .attr("x", 120)
    .attr("y", 0)
    .attr("width", 40)
    .attr("height", 30)
    .attr("rx", 5)
    .attr("fill", "#1a73e8")
    .style("cursor", "pointer")
    .attr("class", "control-btn");

mainControls.append("text")
    .attr("x", 140)
    .attr("y", 19)
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .style("font-size", "12px")
    .style("pointer-events", "none")
    .text("▶");

// Year slider
const yearSlider = mainControls.append("input")
    .attr("type", "range")
    .attr("min", 0)
    .attr("max", years.length - 1)
    .attr("value", 0)
    .attr("x", 180)
    .style("width", "200px")
    .style("height", "30px")
    .attr("class", "year-slider");

// Year display for slider
const sliderYearDisplay = mainControls.append("text")
    .attr("x", 390)
    .attr("y", 19)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .text(`Year: ${years[0]}`);

// Speed controls row
const speedControls = controlsContainer.append("g")
    .attr("class", "speed-controls")
    .attr("transform", `translate(0, 40)`);

// Speed label
speedControls.append("text")
    .attr("x", 0)
    .attr("y", 15)
    .attr("text-anchor", "start")
    .style("font-size", "12px")
    .text("Speed:");

// Speed slider
const speedSlider = speedControls.append("input")
    .attr("type", "range")
    .attr("min", 500)
    .attr("max", 3000)
    .attr("value", animationSpeed)
    .attr("step", 100)
    .attr("x", 50)
    .style("width", "150px")
    .style("height", "20px")
    .attr("class", "speed-slider");

// Speed display
const speedDisplay = speedControls.append("text")
    .attr("x", 210)
    .attr("y", 15)
    .attr("text-anchor", "start")
    .style("font-size", "12px")
    .text(`1.5s`);

// Reset button
const resetButton = speedControls.append("rect")
    .attr("x", 250)
    .attr("y", -15)
    .attr("width", 60)
    .attr("height", 25)
    .attr("rx", 5)
    .attr("fill", "#666")
    .style("cursor", "pointer")
    .attr("class", "control-btn");

speedControls.append("text")
    .attr("x", 280)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .style("font-size", "11px")
    .style("pointer-events", "none")
    .text("Reset");

// View all button
const viewAllButton = speedControls.append("rect")
    .attr("x", 320)
    .attr("y", -15)
    .attr("width", 80)
    .attr("height", 25)
    .attr("rx", 5)
    .attr("fill", "#34c759")
    .style("cursor", "pointer")
    .attr("class", "control-btn");

speedControls.append("text")
    .attr("x", 360)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .style("font-size", "11px")
    .style("pointer-events", "none")
    .text("View All");

// Animation state
let isPlaying = false;
let animationInterval;

// Play/Pause button functionality
playButton.on("click", function() {
    togglePlayPause();
});

// Previous Year button
prevButton.on("click", function() {
    if (isPlaying) togglePlayPause();
    currentYearIndex = (currentYearIndex - 1 + years.length) % years.length;
    updateYear(currentYearIndex);
});

// Next Year button
nextButton.on("click", function() {
    if (isPlaying) togglePlayPause();
    currentYearIndex = (currentYearIndex + 1) % years.length;
    updateYear(currentYearIndex);
});

// Year slider functionality
yearSlider.on("input", function() {
    currentYearIndex = +this.value;
    if (isPlaying) togglePlayPause();
    updateYear(currentYearIndex);
});

// Speed slider functionality
speedSlider.on("input", function() {
    animationSpeed = 3500 - this.value; // Invert so faster = smaller number
    speedDisplay.text(`${(animationSpeed / 1000).toFixed(1)}s`);
    
    // Restart animation with new speed if playing
    if (isPlaying) {
        togglePlayPause();
        togglePlayPause();
    }
});

// Reset button functionality
resetButton.on("click", function() {
    if (isPlaying) togglePlayPause();
    currentYearIndex = 0;
    animationSpeed = 1500;
    speedSlider.property("value", 1500);
    speedDisplay.text("1.5s");
    updateYear(currentYearIndex);
});

// View all button functionality
viewAllButton.on("click", function() {
    if (isPlaying) togglePlayPause();
    showAllYears();
});

// Toggle play/pause function
function togglePlayPause() {
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        playButton.attr("fill", "#ff9500");
        playButtonText.text("Pause");
        
        animationInterval = setInterval(() => {
            currentYearIndex = (currentYearIndex + 1) % years.length;
            updateYear(currentYearIndex);
        }, animationSpeed);
    } else {
        playButton.attr("fill", "#1a73e8");
        playButtonText.text("Play");
        clearInterval(animationInterval);
    }
}

// Show all years at once
function showAllYears() {
    yearLabel.text("All Creative Works (2018-2022)");
    yearHighlight.style("display", "none");
    
    // Show all dots
    const dots = dotsGroup.selectAll(".dot")
        .data(aggregatedData, d => d.year + "_" + d.type);
    
    dots.enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.year) + xScale.bandwidth() / 2)
        .attr("cy", d => yScale(d.type) + yScale.bandwidth() / 2)
        .attr("r", 0)
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
        })
        .transition()
        .duration(500)
        .attr("r", d => rScale(d.count));
    
    dots.transition()
        .duration(500)
        .attr("r", d => rScale(d.count));
    
    dots.exit().remove();
}

// Legend for colors
const legend = svg.append("g")
    .attr("transform", `translate(${width + 30}, 20)`);

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

// CONCENTRIC CIRCLES LEGEND FOR DOT SIZES
const sizes = [5, 10, 15];
const concentricLegend = svg.append("g")
    .attr("transform", `translate(${width + 50}, ${types.length * 25 + 60})`);

// Add title for concentric circles
concentricLegend.append("text")
    .attr("x", 0)
    .attr("y", -25)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .text("Count (Concentric)");

// Create concentric circles
const maxRadius = rScale(15);
concentricLegend.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", maxRadius)
    .attr("fill", "none")
    .attr("stroke", "#999")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "2,2");

concentricLegend.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", rScale(10))
    .attr("fill", "none")
    .attr("stroke", "#999")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "2,2");

concentricLegend.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", rScale(5))
    .attr("fill", "none")
    .attr("stroke", "#999")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "2,2");

// Add labels for each circle with lines pointing to the circles
const labelData = [
    { radius: rScale(5), value: 5, angle: -45 },
    { radius: rScale(10), value: 10, angle: -30 },
    { radius: rScale(15), value: 15, angle: -15 }
];

labelData.forEach(d => {
    const angleRad = (d.angle * Math.PI) / 180;
    const labelX = Math.cos(angleRad) * (d.radius + 10);
    const labelY = Math.sin(angleRad) * (d.radius + 10);
    
    // Line from circle to label
    concentricLegend.append("line")
        .attr("x1", Math.cos(angleRad) * d.radius)
        .attr("y1", Math.sin(angleRad) * d.radius)
        .attr("x2", labelX)
        .attr("y2", labelY)
        .attr("stroke", "#999")
        .attr("stroke-width", 1);
    
    // Label text
    concentricLegend.append("text")
        .attr("x", labelX + (labelX > 0 ? 5 : -5))
        .attr("y", labelY + 4)
        .attr("text-anchor", labelX > 0 ? "start" : "end")
        .style("font-size", "11px")
        .style("fill", "#666")
        .text(d.value);
});

// Add a sample dot in the center to show scale reference
concentricLegend.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 3)
    .attr("fill", "#999")
    .attr("opacity", 0.7);

// Title
svg.append("text")
    .attr("x", width / 2)
    .attr("y", -40)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Creative Works by Year and Type - Interactive Timeline");

// Initialize with first year
updateYear(0);

// Keyboard controls
d3.select("body").on("keydown", function(event) {
    switch(event.key) {
        case "ArrowLeft":
            event.preventDefault();
            if (isPlaying) togglePlayPause();
            currentYearIndex = (currentYearIndex - 1 + years.length) % years.length;
            updateYear(currentYearIndex);
            break;
        case "ArrowRight":
            event.preventDefault();
            if (isPlaying) togglePlayPause();
            currentYearIndex = (currentYearIndex + 1) % years.length;
            updateYear(currentYearIndex);
            break;
        case " ":
            event.preventDefault();
            togglePlayPause();
            break;
        case "Escape":
            if (isPlaying) togglePlayPause();
            currentYearIndex = 0;
            updateYear(currentYearIndex);
            break;
    }
});

})();
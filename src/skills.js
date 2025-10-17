// skills.js
(function(){
const skillsData = [
    { skill: "Coding", score: 30 },
    { skill: "Video Editing", score: 70 },
    { skill: "Take Photo", score: 70 },
    { skill: "Image Editing", score: 60 },
    { skill: "Game Creation", score: 50 }
];

// Sort data descending by score for better visualization
const sortedData = skillsData.sort((a, b) => b.score - a.score);

// Responsive dimensions
const margin = { top: 40, right: 80, bottom: 60, left: 100 }; // Matches scatterplot
const width = Math.min(800, window.innerWidth * 0.9) - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// Create SVG container
const svg = d3.select("#vis-skills")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Scales
const xScale = d3.scaleLinear()
    .domain([0, 100]) // Scores out of 100
    .range([0, width]);

const yScale = d3.scaleBand()
    .domain(sortedData.map(d => d.skill))
    .range([0, height])
    .padding(0.2); // Matches scatterplot

// Axes
svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale))
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .text("Proficiency Score (0-100)");

svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale))
    .append("text")
    .attr("class", "axis-label")
    .attr("x", -height / 2)
    .attr("y", -60)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Skill");

// Tooltip (select existing element)
const tooltip = d3.select(".tooltip");

// Bars
svg.selectAll(".bar")
    .data(sortedData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("y", d => yScale(d.skill))
    .attr("height", yScale.bandwidth())
    .attr("x", 0)
    .attr("width", d => xScale(d.score))
    .attr("fill", "#1a73e8")
    .on("mouseover", function(event, d) {
        d3.select(this).attr("fill", d3.rgb("#1a73e8").brighter(0.5));
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`Skill: ${d.skill}<br>Score: ${d.score}/100`)
            .style("left", Math.min(event.pageX + 10, window.innerWidth - 100) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function() {
        d3.select(this).attr("fill", "#1a73e8");
        tooltip.transition().duration(500).style("opacity", 0);
    });

// Score labels
svg.selectAll(".score-label")
    .data(sortedData)
    .enter()
    .append("text")
    .attr("class", "score-label")
    .attr("y", d => yScale(d.skill) + yScale.bandwidth() / 2)
    .attr("x", d => xScale(d.score) + 5)
    .attr("dy", "0.35em")
    .text(d => d.score);

// Title
svg.append("text")
    .attr("x", width / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("My Skills Proficiency");
})();
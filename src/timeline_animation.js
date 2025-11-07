// timeline-animation.js - Personal Timeline with Animation Controls
(function(){
    // Personal timeline data
    const timelineData = [
        // Education
        { year: 2013, category: "education", title: "Chong Gene Hang College", description: "Secondary Education (S1-S6)", type: "school" },
        { year: 2019, category: "education", title: "DSE Examination", description: "5 passes including Chinese, English, Mathematics, Liberal Studies, Business, Accounting and Financial Studies", type: "exam" },
        { year: 2019, category: "education", title: "Community College of City University", description: "Associate of Science in Creative and Interactive Media Production", type: "college" },
        { year: 2021, category: "education", title: "City University of Hong Kong", description: "Bachelor of Science in Creative Media (BScCM)", type: "university" },
        
        // Work Experience
        { year: 2016, category: "work", title: "Panda Safari", description: "Hong Kong travel agent specializing in tour packages to Africa", type: "travel" },
        { year: 2019, category: "work", title: "IKEA HK, DFI Retail Group", description: "Sales Co-Worker Market Hall", type: "retail" },
        { year: 2019, category: "work", title: "Comme des Garçons", description: "Sales", type: "fashion" },
        { year: 2019, category: "work", title: "NIKE Lab PS7", description: "Sales Co-Worker, Store Assistance", type: "sports" },
        { year: 2019, category: "work", title: "Hoi Tin Athletic Association", description: "Assistance", type: "sports" },
        { year: 2020, category: "work", title: "IKEA HK, DFI Retail Group", description: "Sales Co-Worker, Show Room", type: "retail" },
        { year: 2022, category: "work", title: "IKEA HK, DFI Retail Group", description: "Store Operation Team Co-Worker", type: "retail" },
        { year: 2023, category: "work", title: "Cathay Pacific Airways Limited", description: "Flight Attendant", type: "aviation" }
    ];

    // Initialize visualization when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initTimelineVisualization();
    });

    function initTimelineVisualization() {
        const margin = { top: 60, right: 120, bottom: 100, left: 100 };
        const width = Math.min(1000, window.innerWidth * 0.9) - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        // Create SVG container
        const svg = d3.select("#timeline-visualization")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Get unique years and categories
        const years = [...new Set(timelineData.map(d => d.year))].sort((a, b) => a - b);
        const categories = [...new Set(timelineData.map(d => d.category))];
        const types = [...new Set(timelineData.map(d => d.type))];

        // Scales
        const xScale = d3.scaleLinear()
            .domain([d3.min(years) - 1, d3.max(years) + 1])
            .range([0, width]);

        const yScale = d3.scaleBand()
            .domain(categories)
            .range([0, height])
            .padding(0.2);

        const colorScale = d3.scaleOrdinal()
            .domain(types)
            .range(["#1a73e8", "#34c759", "#ff9500", "#af52de", "#ff3b30", "#5856d6", "#007aff", "#ff2d55"]);

        const rScale = d3.scaleSqrt()
            .domain([0, d3.max(timelineData, d => d.description.length / 10)])
            .range([5, 15]);

        // Axes
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale).tickFormat(d3.format("d")))
            .append("text")
            .attr("class", "axis-label")
            .attr("x", width / 2)
            .attr("y", 40)
            .attr("text-anchor", "middle")
            .style("fill", "white")
            .text("Year");

        svg.append("g")
            .call(d3.axisLeft(yScale))
            .append("text")
            .attr("class", "axis-label")
            .attr("x", -height / 2)
            .attr("y", -60)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .style("fill", "white")
            .text("Category");

        // Tooltip
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("opacity", 0)
            .style("pointer-events", "none");

        // Year highlight
        const yearHighlight = svg.append("line")
            .attr("class", "year-highlight")
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", 0)
            .attr("y2", height)
            .attr("stroke", "#fdbb2d")
            .attr("stroke-width", 2)
            .attr("opacity", 0.7)
            .style("display", "none");

        // Year label
        const yearLabel = svg.append("text")
            .attr("class", "year-label")
            .attr("x", width / 2)
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .style("fill", "#fdbb2d");

        // Create dots group
        const dotsGroup = svg.append("g").attr("class", "dots-group");

        // Animation state
        let currentYearIndex = 0;
        let animationSpeed = 1500;
        let isPlaying = false;
        let animationInterval;

        // Function to update visualization for a specific year
        function updateYear(yearIndex) {
            const year = years[yearIndex];
            const yearData = timelineData.filter(d => d.year === year);
            
            // Update year label
            yearLabel.text(`Timeline: ${year}`);
            
            // Update year highlight position
            yearHighlight
                .attr("x1", xScale(year))
                .attr("x2", xScale(year))
                .style("display", "block");
            
            // Update slider display
            yearSlider.property("value", yearIndex);
            sliderYearDisplay.text(`Year: ${year}`);
            
            // Update dots with animation
            const dots = dotsGroup.selectAll(".timeline-dot")
                .data(yearData, d => d.title);
            
            // Remove old dots
            dots.exit()
                .transition()
                .duration(500)
                .attr("r", 0)
                .remove();
            
            // Update existing dots
            dots.transition()
                .duration(500)
                .attr("cx", d => xScale(d.year))
                .attr("cy", d => yScale(d.category) + yScale.bandwidth() / 2)
                .attr("r", d => rScale(d.description.length / 10));
            
            // Add new dots
            dots.enter()
                .append("circle")
                .attr("class", "timeline-dot")
                .attr("cx", d => xScale(d.year))
                .attr("cy", d => yScale(d.category) + yScale.bandwidth() / 2)
                .attr("r", 0)
                .attr("fill", d => colorScale(d.type))
                .attr("stroke", "white")
                .attr("stroke-width", 2)
                .on("mouseover", function(event, d) {
                    d3.select(this).attr("fill", d3.rgb(colorScale(d.type)).brighter(0.5));
                    tooltip.transition().duration(200).style("opacity", 0.9);
                    tooltip.html(`<strong>${d.title}</strong><br>${d.description}<br>Year: ${d.year}`)
                        .style("left", Math.min(event.pageX + 10, window.innerWidth - 200) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    d3.select(this).attr("fill", d => colorScale(d.type));
                    tooltip.transition().duration(500).style("opacity", 0);
                })
                .transition()
                .duration(500)
                .attr("r", d => rScale(d.description.length / 10));
        }

        // Create animation controls
        const controlsContainer = d3.select("#timeline-visualization")
            .append("div")
            .attr("class", "animation-controls");

        // Previous Year Button
        const prevButton = controlsContainer.append("button")
            .attr("class", "control-btn")
            .text("◀ Previous")
            .on("click", function() {
                if (isPlaying) togglePlayPause();
                currentYearIndex = (currentYearIndex - 1 + years.length) % years.length;
                updateYear(currentYearIndex);
            });

        // Play/Pause button
        const playButton = controlsContainer.append("button")
            .attr("class", "control-btn")
            .text("Play")
            .on("click", togglePlayPause);

        // Next Year Button
        const nextButton = controlsContainer.append("button")
            .attr("class", "control-btn")
            .text("Next ▶")
            .on("click", function() {
                if (isPlaying) togglePlayPause();
                currentYearIndex = (currentYearIndex + 1) % years.length;
                updateYear(currentYearIndex);
            });

        // Year slider
        const yearSlider = controlsContainer.append("input")
            .attr("type", "range")
            .attr("class", "year-slider")
            .attr("min", 0)
            .attr("max", years.length - 1)
            .attr("value", 0)
            .on("input", function() {
                currentYearIndex = +this.value;
                if (isPlaying) togglePlayPause();
                updateYear(currentYearIndex);
            });

        // Year display
        const sliderYearDisplay = controlsContainer.append("div")
            .attr("class", "year-display")
            .text(`Year: ${years[0]}`);

        // Speed controls
        const speedControls = controlsContainer.append("div")
            .attr("class", "speed-controls");

        speedControls.append("span")
            .text("Speed:");

        const speedSlider = speedControls.append("input")
            .attr("type", "range")
            .attr("class", "speed-slider")
            .attr("min", 500)
            .attr("max", 3000)
            .attr("value", animationSpeed)
            .attr("step", 100)
            .on("input", function() {
                animationSpeed = 3500 - this.value; // Invert so faster = smaller number
                speedDisplay.text(`${(animationSpeed / 1000).toFixed(1)}s`);
                
                // Restart animation with new speed if playing
                if (isPlaying) {
                    togglePlayPause();
                    togglePlayPause();
                }
            });

        const speedDisplay = speedControls.append("span")
            .text("1.5s");

        // Reset button
        const resetButton = speedControls.append("button")
            .attr("class", "control-btn")
            .text("Reset")
            .on("click", function() {
                if (isPlaying) togglePlayPause();
                currentYearIndex = 0;
                animationSpeed = 1500;
                speedSlider.property("value", 1500);
                speedDisplay.text("1.5s");
                updateYear(currentYearIndex);
            });

        // View all button
        const viewAllButton = speedControls.append("button")
            .attr("class", "control-btn")
            .text("View All")
            .on("click", function() {
                if (isPlaying) togglePlayPause();
                showAllYears();
            });

        // Toggle play/pause function
        function togglePlayPause() {
            isPlaying = !isPlaying;
            
            if (isPlaying) {
                playButton.text("Pause").classed("active", true);
                
                animationInterval = setInterval(() => {
                    currentYearIndex = (currentYearIndex + 1) % years.length;
                    updateYear(currentYearIndex);
                }, animationSpeed);
            } else {
                playButton.text("Play").classed("active", false);
                clearInterval(animationInterval);
            }
        }

        // Show all years at once
        function showAllYears() {
            yearLabel.text("Complete Timeline");
            yearHighlight.style("display", "none");
            
            // Show all dots
            const dots = dotsGroup.selectAll(".timeline-dot")
                .data(timelineData, d => d.year + "_" + d.title);
            
            dots.enter()
                .append("circle")
                .attr("class", "timeline-dot")
                .attr("cx", d => xScale(d.year))
                .attr("cy", d => yScale(d.category) + yScale.bandwidth() / 2)
                .attr("r", 0)
                .attr("fill", d => colorScale(d.type))
                .attr("stroke", "white")
                .attr("stroke-width", 2)
                .on("mouseover", function(event, d) {
                    d3.select(this).attr("fill", d3.rgb(colorScale(d.type)).brighter(0.5));
                    tooltip.transition().duration(200).style("opacity", 0.9);
                    tooltip.html(`<strong>${d.title}</strong><br>${d.description}<br>Year: ${d.year}`)
                        .style("left", Math.min(event.pageX + 10, window.innerWidth - 200) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    d3.select(this).attr("fill", d => colorScale(d.type));
                    tooltip.transition().duration(500).style("opacity", 0);
                })
                .transition()
                .duration(500)
                .attr("r", d => rScale(d.description.length / 10));
            
            dots.transition()
                .duration(500)
                .attr("r", d => rScale(d.description.length / 10));
            
            dots.exit().remove();
        }

        // Legend for categories
        const legend = svg.append("g")
            .attr("transform", `translate(${width + 30}, 20)`);

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
                .style("font-size", "12px")
                .style("fill", "white");
        });

        // Title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -40)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("fill", "white")
            .text("My Personal Journey Timeline");

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
    }
})();
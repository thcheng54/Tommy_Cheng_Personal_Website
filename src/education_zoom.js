// education-tree.js WITH NAVIGATION CONTROLS
(function(){
const educationData = {
  "name": "Education",
  "children": [
    {
      "name": "Degrees",
      "children": [
        {
          "name": "2013-2019: Chong Gene Hang College (S1-S6)"
        },
        {
          "name": "2019: DSE - 5 passes (Chinese, English, Mathematics, Liberal Studies, Business, Accounting and Financial Studies)"
        },
        {
          "name": "2019-2021: Community College of City University - Associate of Science in Creative and Interactive Media Production"
        },
        {
          "name": "2021-Present: City University of Hong Kong - Bachelor of Science in Creative Media (BScCM)"
        }
      ]
    },
    {
      "name": "Courses",
      "children": [
        {
          "name": "Creative and Interactive Media Production"
        }
      ]
    },
    {
      "name": "Key Assignments",
      "children": [
        {
          "name": "Video Shooting Competitions"
        },
        {
          "name": "Short Film / Micro Movie Creation"
        }
      ]
    },
    {
      "name": "Self Learning",
      "children": [
        {
          "name": "Drawing and Editing Techniques (6+ years)"
        }
      ]
    },
    {
      "name": "MOOCs",
      "children": []
    },
    {
      "name": "Certificates",
      "children": [
        {
          "name": "Talent Development Scholarship"
        }
      ]
    },
    {
      "name": "Nodes",
      "children": [
        {
          "name": "Skills Gained",
          "children": [
            {
              "name": "Adobe Software (Premiere Pro, Illustrator, Photoshop)"
            },
            {
              "name": "Video Editing"
            },
            {
              "name": "Drawing"
            }
          ]
        },
        {
          "name": "Mentors",
          "children": [
            {
              "name": "Hong Kong Professional Teachers' Union"
            },
            {
              "name": "Salon Media Lab"
            }
          ]
        },
        {
          "name": "Grades",
          "children": [
            {
              "name": "DSE - 5 passes"
            },
            {
              "name": "Competition Awards"
            }
          ]
        }
      ]
    }
  ]
};

// Navigation state
let navigationState = {
  zoom: d3.zoomIdentity,
  isConstrained: false,
  currentScale: 1
};

// Responsive dimensions based on content
const margin = { top: 600, right: 300, bottom: 40, left: 80 };
const treeLayout = d3.tree().nodeSize([50, 250]); // Increased horizontal spacing to 250px
const root = d3.hierarchy(educationData);
treeLayout(root);

// Calculate dynamic dimensions
const descendants = root.descendants();
const maxDepth = root.height;
const totalNodes = descendants.length;
const minWidth = totalNodes * 250 + margin.left + margin.right; // Adjusted for larger nodeSize
const minHeight = (maxDepth + 1) * 50 + margin.top + margin.bottom; // Adjusted for larger vertical spacing

const width = Math.min(minWidth, window.innerWidth * 0.9); // Cap width at 90% of viewport
const height = Math.min(minHeight, 1200); // Cap height at 1200px

// Create SVG container with zoomable group
const svg = d3.select("#vis-education_zoom")
    .style("position", "relative")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(d3.zoom()
        .scaleExtent([0.1, 5])
        .on("zoom", function(event) {
            if (!navigationState.isConstrained) {
                g.attr("transform", event.transform);
                navigationState.zoom = event.transform;
                navigationState.currentScale = event.transform.k;
                updateZoomDisplay();
            }
        }))
    .on("dblclick.zoom", null); // Disable double-click zoom

const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Apply tree layout
const treeData = treeLayout(root);

// Links
g.selectAll(".link")
    .data(treeData.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x))
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    .attr("stroke-width", 2);

// Nodes
const nodes = g.selectAll(".node")
    .data(treeData.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.y},${d.x})`);

// Circles
nodes.append("circle")
    .attr("r", 6)
    .attr("fill", "#1a73e8");

// Text labels with improved wrapping
nodes.append("text")
    .attr("dy", "0.35em")
    .attr("x", d => d.children ? -15 : 15) // Increased x offset for better spacing
    .attr("text-anchor", d => d.children ? "end" : "start")
    .text(d => d.data.name)
    .style("font-size", "10px")
    .attr("fill", "#333")
    .call(wrap, 300); // Increased wrap width to 300px for longer labels

// Tooltip
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background", "#fff")
    .style("border", "1px solid #ccc")
    .style("padding", "5px")
    .style("border-radius", "3px");

// Interactivity
nodes.on("mouseover", function(event, d) {
    d3.select(this).select("circle").attr("fill", d3.rgb("#1a73e8").brighter(0.5));
    tooltip.transition().duration(200).style("opacity", 0.9);
    tooltip.html(`Node: ${d.data.name}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
})
.on("mouseout", function() {
    d3.select(this).select("circle").attr("fill", "#1a73e8");
    tooltip.transition().duration(500).style("opacity", 0);
});

// Title
g.append("text")
    .attr("x", width / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    //.text("Education Tree");

// Text wrapping function
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.2, // Slightly increased line height for better separation
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", text.attr("x")).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", text.attr("x")).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

// CREATE NAVIGATION CONTROLS
function createNavigationControls() {
    const controlsContainer = d3.select("#vis-education_zoom")
        .append("div")
        .attr("class", "navigation-controls");
    
    // Zoom display
    controlsContainer.append("div")
        .attr("class", "zoom-display")
        .text("Zoom: 100%");
    
    // Zoom In button
    controlsContainer.append("button")
        .attr("class", "nav-button")
        .html("+")
        .on("click", zoomIn);
    
    // Zoom Out button
    controlsContainer.append("button")
        .attr("class", "nav-button")
        .html("−")
        .on("click", zoomOut);
    
    // Reset button
    controlsContainer.append("button")
        .attr("class", "nav-button reset")
        .html("⟲")
        .on("click", resetView);
    
    // Constrained mode button
    controlsContainer.append("button")
        .attr("class", "nav-button constrained")
        .html("⊞")
        .attr("title", "Toggle constrained navigation")
        .on("click", toggleConstrainedMode);
    
    // Pan controls
    const panContainer = controlsContainer.append("div")
        .style("display", "flex")
        .style("flex-direction", "column")
        .style("align-items", "center")
        .style("gap", "2px");
    
    // Up button
    panContainer.append("button")
        .attr("class", "nav-button")
        .html("↑")
        .on("click", () => pan(0, 50));
    
    const middleRow = panContainer.append("div")
        .style("display", "flex")
        .style("gap", "2px");
    
    // Left button
    middleRow.append("button")
        .attr("class", "nav-button")
        .html("←")
        .on("click", () => pan(50, 0));
    
    // Center button (placeholder for alignment)
    middleRow.append("div")
        .style("width", "32px")
        .style("height", "32px");
    
    // Right button
    middleRow.append("button")
        .attr("class", "nav-button")
        .html("→")
        .on("click", () => pan(-50, 0));
    
    // Down button
    panContainer.append("button")
        .attr("class", "nav-button")
        .html("↓")
        .on("click", () => pan(0, -50));
}

// NAVIGATION FUNCTIONS
function zoomIn() {
    const newScale = Math.min(5, navigationState.currentScale * 1.5);
    const transform = d3.zoomIdentity
        .scale(newScale)
        .translate(
            navigationState.zoom.x / navigationState.currentScale * newScale,
            navigationState.zoom.y / navigationState.currentScale * newScale
        );
    
    applyTransform(transform);
}

function zoomOut() {
    const newScale = Math.max(0.1, navigationState.currentScale / 1.5);
    const transform = d3.zoomIdentity
        .scale(newScale)
        .translate(
            navigationState.zoom.x / navigationState.currentScale * newScale,
            navigationState.zoom.y / navigationState.currentScale * newScale
        );
    
    applyTransform(transform);
}

function resetView() {
    const transform = d3.zoomIdentity;
    applyTransform(transform);
}

function toggleConstrainedMode() {
    navigationState.isConstrained = !navigationState.isConstrained;
    const button = d3.select("#vis-education_zoom .nav-button.constrained");
    
    if (navigationState.isConstrained) {
        button.classed("active", true);
        button.style("background", "#27ae60");
        // Apply constraints
        applyViewConstraints();
    } else {
        button.classed("active", false);
        button.style("background", "#2ecc71");
    }
}

function pan(dx, dy) {
    const transform = d3.zoomIdentity
        .scale(navigationState.currentScale)
        .translate(
            navigationState.zoom.x + dx / navigationState.currentScale,
            navigationState.zoom.y + dy / navigationState.currentScale
        );
    
    applyTransform(transform);
}

function applyTransform(transform) {
    if (navigationState.isConstrained) {
        applyViewConstraints(transform);
    } else {
        g.transition()
            .duration(300)
            .attr("transform", transform);
        
        navigationState.zoom = transform;
        navigationState.currentScale = transform.k;
        updateZoomDisplay();
    }
}

function applyViewConstraints(transform = navigationState.zoom) {
    const constrainedTransform = d3.zoomIdentity
        .scale(Math.max(0.5, Math.min(3, transform.k))) // Limit scale
        .translate(
            Math.max(-width * 0.8, Math.min(width * 0.8, transform.x)),
            Math.max(-height * 0.8, Math.min(height * 0.8, transform.y))
        );
    
    g.transition()
        .duration(300)
        .attr("transform", constrainedTransform);
    
    navigationState.zoom = constrainedTransform;
    navigationState.currentScale = constrainedTransform.k;
    updateZoomDisplay();
}

function updateZoomDisplay() {
    d3.select("#vis-education_zoom .zoom-display")
        .text(`Zoom: ${Math.round(navigationState.currentScale * 100)}%`);
}

// Initialize navigation controls
createNavigationControls();

// Add keyboard shortcuts
d3.select("body").on("keydown", function(event) {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
    
    switch(event.key) {
        case '+':
        case '=':
            event.preventDefault();
            zoomIn();
            break;
        case '-':
        case '_':
            event.preventDefault();
            zoomOut();
            break;
        case '0':
            event.preventDefault();
            resetView();
            break;
        case 'c':
        case 'C':
            event.preventDefault();
            toggleConstrainedMode();
            break;
        case 'ArrowUp':
            event.preventDefault();
            pan(0, 50);
            break;
        case 'ArrowDown':
            event.preventDefault();
            pan(0, -50);
            break;
        case 'ArrowLeft':
            event.preventDefault();
            pan(50, 0);
            break;
        case 'ArrowRight':
            event.preventDefault();
            pan(-50, 0);
            break;
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    // You could add responsive behavior here if needed
});

})();
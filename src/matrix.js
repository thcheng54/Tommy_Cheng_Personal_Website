// src/matrix.js
// Tommy Cheng Adjacency Matrix – Fully Data-Driven & Responsive
// Last Updated: October 31, 2025

(function () {
    // Only run if container exists
    const container = d3.select("#vis-matrix .container");
    if (container.empty()) return;

    // === 1. CATEGORIES & COLORS ===
    const categories = {
        personal:    { color: '#e74c3c', label: 'You (Tommy)' },
        education:   { color: '#f1c40f', label: 'Education' },
        work:        { color: '#3498db', label: 'Work' },
        personality: { color: '#2ecc71', label: 'Personality' },
        activity:    { color: '#9b59b6', label: 'Extracurricular' },
        leadership:  { color: '#e67e22', label: 'Leadership' },
        skill:       { color: '#1abc9c', label: 'Skills' }
    };

    // === 2. NODES (28 total) ===
    const nodes = [
        { abbr: 'Tommy',   title: 'Cheng Tsz Hin, Tommy', category: 'personal' },
        { abbr: 'BScCM',   title: 'BScCM, CityU (2021-Present)', category: 'education' },
        { abbr: 'Assoc',   title: 'Associate, CCCU (2019-2021)', category: 'education' },
        { abbr: 'DSE',     title: 'DSE, 5 passes (2019)', category: 'education' },
        { abbr: 'CGHC',    title: 'Chong Gene Hang College (2013-2019)', category: 'education' },
        { abbr: 'Panda',   title: 'Panda Safari (2016-2018)', category: 'work' },
        { abbr: 'IKEA1',   title: 'IKEA Market Hall (2019)', category: 'work' },
        { abbr: 'CDG',     title: 'Comme des Garçons (2019)', category: 'work' },
        { abbr: 'NIKE',    title: 'NIKE Lab PS7 (2019-2020)', category: 'work' },
        { abbr: 'HTAA',    title: 'Hoi Tin Athletic (2019-2020)', category: 'work' },
        { abbr: 'IKEA2',   title: 'IKEA Show Room (2020-2022)', category: 'work' },
        { abbr: 'IKEA3',   title: 'IKEA Operations (2022-2024)', category: 'work' },
        { abbr: 'Cathay',  title: 'Cathay Pacific (2023)', category: 'work' },
        { abbr: 'iSign',   title: 'iSignage (2024-Present)', category: 'work' },
        { abbr: 'Quick',   title: 'Quick Learner', category: 'personality' },
        { abbr: 'UnderP',  title: 'Works Under Pressure', category: 'personality' },
        { abbr: 'Adapt',   title: 'Adaptable', category: 'personality' },
        { abbr: 'Calm',    title: 'Calm', category: 'personality' },
        { abbr: 'Schol',   title: 'Talent Scholarship (2019-2020)', category: 'activity' },
        { abbr: 'Vid17',   title: 'Video 2017 Champion', category: 'activity' },
        { abbr: 'Vid16',   title: 'Video 2016 Champion', category: 'activity' },
        { abbr: 'Infl',    title: 'Influencers 2017-2018', category: 'activity' },
        { abbr: 'Music',   title: 'Music Chairman', category: 'leadership' },
        { abbr: 'Stage',   title: 'Stage Manager', category: 'leadership' },
        { abbr: 'LasY',    title: 'Lasallian Youth', category: 'leadership' },
        { abbr: 'Adobe',   title: 'Adobe Software', category: 'skill' },
        { abbr: 'Lang',    title: 'Languages', category: 'skill' },
        { abbr: 'MSO',     title: 'MS Office', category: 'skill' }
    ];

    // === 3. RELATIONSHIPS (from → to) ===
    // Extracted from your original table (all non-empty cells)
    const relationships = [
        // Row 0: Tommy → All
        { from: 0, to: 1,  category: 'education',   desc: 'Tommy to BScCM: Pursuing Creative Media' },
        { from: 0, to: 2,  category: 'education',   desc: 'Tommy to Assoc: Completed Associate degree' },
        { from: 0, to: 3,  category: 'education',   desc: 'Tommy to DSE: Achieved 5 passes' },
        { from: 0, to: 4,  category: 'education',   desc: 'Tommy to CGHC: Secondary education' },
        { from: 0, to: 5,  category: 'work',        desc: 'Tommy to Panda: Early work experience' },
        { from: 0, to: 6,  category: 'work',        desc: 'Tommy to IKEA1: Sales role' },
        { from: 0, to: 7,  category: 'work',        desc: 'Tommy to CDG: Sales role' },
        { from: 0, to: 8,  category: 'work',        desc: 'Tommy to NIKE: Sales role' },
        { from: 0, to: 9,  category: 'work',        desc: 'Tommy to HTAA: Assistance role' },
        { from: 0, to: 10, category: 'work',        desc: 'Tommy to IKEA2: Showroom role' },
        { from: 0, to: 11, category: 'work',        desc: 'Tommy to IKEA3: Operations role' },
        { from: 0, to: 12, category: 'work',        desc: 'Tommy to Cathay: Flight Attendant' },
        { from: 0, to: 13, category: 'work',        desc: 'Tommy to iSign: Support Engineer' },
        { from: 0, to: 14, category: 'personality', desc: 'Tommy to Quick: Core trait' },
        { from: 0, to: 15, category: 'personality', desc: 'Tommy to UnderP: Core trait' },
        { from: 0, to: 16, category: 'personality', desc: 'Tommy to Adapt: Core trait' },
        { from: 0, to: 17, category: 'personality', desc: 'Tommy to Calm: Core trait' },
        { from: 0, to: 18, category: 'activity',    desc: 'Tommy to Schol: Scholarship award' },
        { from: 0, to: 19, category: 'activity',    desc: 'Tommy to Vid17: Video competition win' },
        { from: 0, to: 20, category: 'activity',    desc: 'Tommy to Vid16: Video competition win' },
        { from: 0, to: 21, category: 'activity',    desc: 'Tommy to Infl: Influencers award' },
        { from: 0, to: 22, category: 'leadership',  desc: 'Tommy to Music: Leadership role' },
        { from: 0, to: 23, category: 'leadership',  desc: 'Tommy to Stage: Leadership role' },
        { from: 0, to: 24, category: 'leadership',  desc: 'Tommy to LasY: Leadership role' },
        { from: 0, to: 25, category: 'skill',       desc: 'Tommy to Adobe: 6+ years of practice' },
        { from: 0, to: 26, category: 'skill',       desc: 'Tommy to Lang: Multilingual skills' },
        { from: 0, to: 27, category: 'skill',       desc: 'Tommy to MSO: Office proficiency' },

        // Row 22: Music → Quick Learner
        { from: 22, to: 14, category: 'personality', desc: 'Music to Quick: Leadership learning' },

        // Row 23: Stage → Quick Learner
        { from: 23, to: 14, category: 'personality', desc: 'Stage to Quick: Leadership learning' },

        // Row 24: LasY → Quick Learner
        { from: 24, to: 14, category: 'personality', desc: 'LasY to Quick: Leadership learning' },

        // Optional: Add more logical connections (examples)
        // { from: 25, to: 13, category: 'skill', desc: 'Adobe skills used in iSignage' },
        // { from: 25, to: 1,  category: 'skill', desc: 'Adobe used in BScCM projects' },
        // { from: 14, to: 11, category: 'personality', desc: 'Quick learner helped in IKEA operations' }
    ];

    // === 4. BUILD LEGEND ===
    const legend = container.append('div').attr('class', 'legend');
    Object.entries(categories).forEach(([key, { color, label }]) => {
        legend.append('div')
            .html(`<span class="color-box" style="background-color: ${color};"></span>${label}`);
    });

    // === 5. BUILD TABLE ===
    const table = container.append('table');

    // Header Row
    const headerRow = table.append('tr');
    headerRow.append('th'); // Empty corner
    nodes.forEach(node => {
        headerRow.append('th')
            .attr('title', node.title)
            .text(node.abbr);
    });

    // Body Rows
    nodes.forEach((rowNode, rowIndex) => {
        const tr = table.append('tr');
        tr.append('th')
            .attr('title', rowNode.title)
            .text(rowNode.abbr);

        nodes.forEach((colNode, colIndex) => {
            const relationship = relationships.find(r => r.from === rowIndex && r.to === colIndex);
            const td = tr.append('td');

            if (relationship) {
                td.attr('class', relationship.category)
                  .attr('title', relationship.desc);
            }
        });
    });

    // === 6. ENHANCED TOOLTIP (Optional – uses native title + hover effect) ===
    container.selectAll('td[title]')
        .on('mouseenter', function () {
            d3.select(this)
                .style('opacity', 0.8)
                .style('transform', 'scale(1.1)')
                .style('z-index', 10);
        })
        .on('mouseleave', function () {
            d3.select(this)
                .style('opacity', 1)
                .style('transform', 'scale(1)')
                .style('z-index', 1);
        });

    // === 7. OPTIONAL: D3 Tooltip (Uncomment to use) ===
    /*
    const tooltip = d3.select(".tooltip");
    container.selectAll('td[title]')
        .on('mouseover', function (event, d) {
            const desc = d3.select(this).attr('title');
            tooltip.transition().duration(200).style('opacity', 0.9);
            tooltip.html(desc)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function () {
            tooltip.transition().duration(500).style('opacity', 0);
        });
    */

})();
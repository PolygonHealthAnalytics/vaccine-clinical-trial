// Load the JSON data
d3.json("nested_study_types_designs.json").then(function(data) {
    const width = 1200;
    const height = 500;
    const radius = Math.min(width, height) / 2;

    // Set up the SVG canvas
    const svg = d3.select("#nested-pie-chart-study-designs")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Set up color scales
    const studyTypeColor = d3.scaleOrdinal()
        .domain(data.inner_circle.map(d => d.label))
        .range(["#8da0cb", "#a6d854"]); // Colors for "Interventional" and "Observational"

    const modeColor = d3.scaleOrdinal()
        .domain(data.outer_circle.map(d => d.label))
        .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#9467bd", "#d62728", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf", "#ffbb78", "#17becf", "#bcbd22", "#ffbb78", "#d62728"]); // Colors for modes

    // Tooltip setup
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "#f9f9f9")
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("border-radius", "5px")
        .style("display", "none");

    // Function to lighten color
    function lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16),
            amt = Math.round(2.55 * percent),
            R = (num >> 16) + amt,
            G = (num >> 8 & 0x00FF) + amt,
            B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    // Inner circle pie chart
    const innerPie = d3.pie()
        .sort(null)
        .value(d => d.size);

    const innerArc = d3.arc()
        .innerRadius(radius * 0.4)
        .outerRadius(radius * 0.6);

    svg.selectAll(".innerArc")
        .data(innerPie(data.inner_circle))
        .enter().append("path")
        .attr("class", "innerArc")
        .attr("d", innerArc)
        .attr("fill", d => studyTypeColor(d.data.label))
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", lightenColor(studyTypeColor(d.data.label), 20));
            tooltip.style("display", "block")
                .html(`<strong>${d.data.label}</strong><br>Number: ${d.data.size}<br>Percentage: ${d.data.percentage}%`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 25) + "px");
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 25) + "px");
        })
        .on("mouseout", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", studyTypeColor(d.data.label));
            tooltip.style("display", "none");
        });

    // Outer circle pie chart
    const outerArc = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius * 0.8);

    svg.selectAll(".outerArc")
        .data(innerPie(data.outer_circle))
        .enter().append("path")
        .attr("class", "outerArc")
        .attr("d", outerArc)
        .attr("fill", d => modeColor(d.data.label))
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", lightenColor(modeColor(d.data.label), 20));
            tooltip.style("display", "block")
                .html(`<strong>${d.data.label}</strong><br>Number: ${d.data.size}<br>Percentage: ${d.data.percentage}%`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 25) + "px");
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 25) + "px");
        })
        .on("mouseout", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", modeColor(d.data.label));
            tooltip.style("display", "none");
        });

    // Add a center circle to make it a donut
    svg.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", radius * 0.4)
        .attr("fill", "white");

    // Add the title
    svg.append("text")
        .attr("x", 0)
        .attr("y", -height / 2 + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Study Types and Experimental Designs for Vaccine Trials: 2005-2024");

    // Add legend
    const legendData = [
        {label: 'Interventional', color: '#8da0cb'},
        {label: 'Observational', color: '#a6d854'},
        {label: 'Parallel Assignment', color: '#1f77b4'},
        {label: 'Single Group\nAssignment', color: '#ff7f0e'},
        {label: 'Sequential\nAssignment', color: '#2ca02c'},
        {label: 'Factorial Assignment', color: '#9467bd'},
        {label: 'Crossover Assignment', color: '#d62728'},
        {label: 'Cohort', color: '#e377c2'},
        {label: 'Case-Control', color: '#7f7f7f'},
        {label: 'Case-Only', color: '#bcbd22'},
        {label: 'Other', color: '#000000'},
        {label: 'Ecologic or Community', color: '#ffbb78'},
        {label: 'Family-Based', color: '#17becf'},
        {label: 'Case-Crossover', color: '#ffbb78'},
        {label: 'Defined Population', color: '#bcbd22'}
    ];

    const legend = svg.append("g")
        .attr("transform", `translate(${radius * 1.2}, ${-radius * 0.8})`);

    legend.selectAll("rect")
        .data(legendData)
        .enter().append("rect")
        .attr("x", 0)
        .attr("y", (d, i) => i * 20)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", d => d.color);

    legend.selectAll("text")
        .data(legendData)
        .enter().append("text")
        .attr("x", 24)
        .attr("y", (d, i) => i * 20 + 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .style("font-size", "12px")
        .text(d => d.label);
});


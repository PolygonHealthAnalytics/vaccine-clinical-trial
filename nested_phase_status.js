// Load the JSON data
d3.json("nested_phase_status.json").then(function(data) {
    const width = 1200;
    const height = 500;
    const radius = Math.min(width, height) / 2;

    // Set up the SVG canvas
    const svg = d3.select("#nested-pie-chart-phase-status")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Set up color scales
    const phaseColor = d3.scaleOrdinal()
        .domain(data.inner_circle.map(d => d.label))
        .range(["#cce6ff", "#3399ff", "#0039e6", "#0000cc", "#708090"]); // Colors for each phase

    const statusColor = d3.scaleOrdinal()
        .domain(["Completed", "Recruiting", "Not yet recruiting", "Terminated/Withdrawn", "Others", "Unknown"])
        .range(["#3366cc", "#7094db", "#adc2eb", "#999999", "#050a14", "#bfbfbf"]); // Colors for each status

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

    // Create inner pie chart
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
        .attr("fill", d => phaseColor(d.data.label))
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", lightenColor(phaseColor(d.data.label), 20));
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
                .attr("fill", phaseColor(d.data.label));
            tooltip.style("display", "none");
        });

    // Create outer pie chart
    const outerArc = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius * 0.8);

    const outerPie = d3.pie()
        .sort(null)
        .value(d => d.size);

    svg.selectAll(".outerArc")
        .data(outerPie(data.outer_circle))
        .enter().append("path")
        .attr("class", "outerArc")
        .attr("d", outerArc)
        .attr("fill", d => statusColor(d.data.label))
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", lightenColor(statusColor(d.data.label), 20));
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
                .attr("fill", statusColor(d.data.label));
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
        .text("Distribution of Vaccine Trials by Phase and Status: 2005-2024");

    // Add legend
    const legendData = [
        {label: 'Phase 1', color: '#cce6ff'},
        {label: 'Phase 2', color: '#3399ff'},
        {label: 'Phase 3', color: '#0039e6'},
        {label: 'Phase 4', color: '#0000cc'},
        {label: 'Other Phases', color: '#708090'},
        {label: 'Completed', color: '#3366cc'},
        {label: 'Recruiting', color: '#7094db'},
        {label: 'Not yet recruiting', color: '#adc2eb'},
        {label: 'Terminated/Withdrawn', color: '#999999'},
        {label: 'Others', color: '#050a14'},
        {label: 'Unknown', color: '#bfbfbf'}
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


 

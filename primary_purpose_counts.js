// Load the data
d3.json("primary_purpose_counts.json").then(function(data) {

    // Set up dimensions and margins
    const width = 800;
    const height = 400;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    // Append the SVG object to the body
    const svg = d3.select("#pie-primary-purpose-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Set up color scale
    const color = d3.scaleOrdinal()
        .domain(["Prevention", "Diagnostic", "Treatment", "Supportive Care", "Basic Science", "Other", "Health Services\nResearch"])
        .range(d3.schemeCategory10);

    // Compute the position of each group on the pie
    const pie = d3.pie()
        .value(d => d.count)
        .sort(null);

    const data_ready = pie(data);

    // Shape helper to build arcs:
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    // Build the pie chart
    svg.selectAll('slices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.primary_purpose))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .on("mouseover", function(event, d) {
            d3.select(this).attr("opacity", 0.7);
            tooltip.style("visibility", "visible")
                .html(
                  `<strong>${d.data.primary_purpose}</strong><br>` +
                  `Count: ${d.data.count}<br>` +
                  `Percentage: ${((d.data.count / d3.sum(data, d => d.count)) * 100).toFixed(1)}%`
                )
                .style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })
        .on("mousemove", function(event) {
            tooltip.style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).attr("opacity", 1);
            tooltip.style("visibility", "hidden");
        });

    // Add the tooltip
    const tooltip = d3.select("#tooltip")
        .style("visibility", "hidden");

    // Add the title
    svg.append("text")
        .attr("x", 0)             
        .attr("y", 0 - (height / 2) + 20)
        .attr("text-anchor", "middle")  
        .style("font-size", "20px") 
        .style("text-decoration", "none")  
        .text("Distribution of Primary Purposes for Vaccine Trials: 2005-2024");
    
    // Add the legend
    const legend = svg.append("g")
        .attr("transform", `translate(${radius + 50}, ${-radius + 10})`)
        .selectAll("g")
        .data(color.domain())
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legend.append("rect")
        .attr("x", 0)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", color);

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", "0.35em")
        .style("font-size", "14px")
        .text(d => d);
});


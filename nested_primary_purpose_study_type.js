// Load the JSON data
d3.json("nested_primary_purpose_study_type.json").then(function(data) {
    const width = 1200;
    const height = 500;
    const radius = Math.min(width, height) / 2;

    // Set up the SVG canvas
    const svg = d3.select("#nested-pie-chart-purpose-study")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Set up color scales
    const innerColor = d3.scaleOrdinal(["#8da0cb", "#e78ac3", "#a6d854"]);
    const outerColor = d3.scaleOrdinal()
        .domain(["Interventional", "Observational"])
        .range(["#66c2a5", "#fc8d62"]);

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
    const pie = d3.pie()
        .sort(null)
        .value(d => d.size);

    const arc = d3.arc()
        .innerRadius(radius * 0.4)
        .outerRadius(radius * 0.6);

    const innerArcs = svg.selectAll(".innerArc")
        .data(pie(data.inner_circle))
        .enter().append("path")
        .attr("class", "innerArc")
        .attr("d", arc)
        .attr("fill", (d, i) => innerColor(i))
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", lightenColor(innerColor(d.index), 20));
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
                .attr("fill", innerColor(d.index));
            tooltip.style("display", "none");
        });

    // Outer circle pie chart
    const outerArc = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius * 0.8);

    // Create a data structure to match the outer arcs with the inner arcs
    let outerData = [];
    pie(data.inner_circle).forEach((inner, i) => {
        let startAngle = inner.startAngle;
        let endAngle = inner.endAngle;
        let filteredOuter = data.outer_circle.filter(outer => outer.label.includes(inner.data.label));
        let totalSize = d3.sum(filteredOuter, d => d.size);

        filteredOuter.forEach((outer, index) => {
            let sizeFraction = totalSize > 0 ? outer.size / totalSize : 1 / filteredOuter.length;
            outerData.push({
                ...outer,
                startAngle: startAngle,
                endAngle: index === filteredOuter.length - 1 ? endAngle : startAngle + sizeFraction * (endAngle - startAngle),
                color: outerColor(outer.label.includes("Interventional") ? "Interventional" : "Observational")
            });
            startAngle += sizeFraction * (endAngle - startAngle);
        });
    });

    svg.selectAll(".outerArc")
        .data(outerData)
        .enter().append("path")
        .attr("class", "outerArc")
        .attr("d", d3.arc()
            .innerRadius(radius * 0.6)
            .outerRadius(radius * 0.8)
            .startAngle(d => d.startAngle)
            .endAngle(d => d.endAngle))
        .attr("fill", d => d.color)
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", lightenColor(d.color, 20));
            tooltip.style("display", "block")
                .html(`<strong>${d.label}</strong><br>Number: ${d.size}<br>Percentage: ${d.percentage}%`)
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
                .attr("fill", d.color);
            tooltip.style("display", "none");
        });

    // Add a center circle for the donut effect
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
        .text("Primary Purpose and Study Type Combined Nested Pie Chart: 2005-2024");

    // Add legend
    const legendData = [
        {label: 'Primary Purpose - Prevention', color: '#8da0cb'},
        {label: 'Primary Purpose - Treatment', color: '#e78ac3'},
        {label: 'Primary Purpose - Others', color: '#a6d854'},
        {label: 'Study Type - Interventional', color: '#66c2a5'},
        {label: 'Study Type - Observational', color: '#fc8d62'}
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


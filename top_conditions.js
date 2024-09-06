
// Load the JSON data
d3.json("top_conditions.json").then(data => {

    // Set the dimensions and margins of the graph
    const margin = {top: 60, right: 50, bottom: 70, left: 250},
          width = 960 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;

    // Append the SVG object to the body of the page
    const svg = d3.select("#top-conditions-chart")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count)])
      .range([0, width]);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5))
      .attr("class", "axis-label")
      .append("text")
      .attr("y", margin.bottom - 10)
      .attr("x", width / 2)
      .attr("text-anchor", "middle")
      .text("Number of Vaccine Trials");

    // Y axis
    const y = d3.scaleBand()
      .range([height, 0])
      .domain(data.map(d => d.condition))
      .padding(0.1);

    svg.append("g")
      .call(d3.axisLeft(y))
      .attr("class", "axis-label");

    // Tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid 1px black")
        .style("padding", "5px")
        .style("border-radius", "5px")
        .style("pointer-events", "none");

    // Function to lighten color
    function lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16),
            amt = Math.round(2.55 * percent),
            R = (num >> 16) + amt,
            G = (num >> 8 & 0x00FF) + amt,
            B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    // Bars
    svg.selectAll(".bar")
      .data(data)
      .join("rect")
        .attr("class", "bar")
        .attr("x", x(0))
        .attr("y", d => y(d.condition))
        .attr("width", d => x(d.count))
        .attr("height", y.bandwidth())
        .attr("fill", "#4682B4")  // Original color
        .on("mouseover", function(event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("fill", lightenColor("#4682B4", 20));  // Lighten color on hover
          tooltip.transition()
              .duration(200)
              .style("opacity", .9);
          tooltip.html(`<strong>${d.condition}</strong><br/>${d.count} trials`)
              .style("left", (event.pageX + 5) + "px")
              .style("top", (event.pageY - 28) + "px");
        })
        .on("mousemove", (event) => {
          tooltip.style("left", (event.pageX + 5) + "px")
                 .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("fill", "#4682B4");  // Revert to original color
          tooltip.transition()
              .duration(500)
              .style("opacity", 0);
        });

    // Title
    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("text-decoration", "none")
      .text("Number of Vaccine Trials per Indication (Top 20)");

    // X axis label
    svg.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
      .style("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Number of Vaccine Trials");

    // Y axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Indications");
});

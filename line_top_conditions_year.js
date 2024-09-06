// Load the JSON data
d3.json("line_top_conditions_year.json").then(data => {

    // Set the dimensions and margins of the graph
    const margin = {top: 60, right: 200, bottom: 70, left: 100},
          width = 960 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;

    // Append the SVG object to the body of the page
    const svg = d3.select("#line-conditions-year")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Get the list of years and conditions
    const years = data.map(d => d.start_year);
    const conditions = Object.keys(data[0]).filter(key => key !== "start_year");

    // X axis
    const x = d3.scaleLinear()
      .domain([d3.min(years), d3.max(years)])
      .range([0, width]);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    // Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d3.max(conditions.map(condition => d[condition])))])
      .range([height, 0]);

    svg.append("g")
      .call(d3.axisLeft(y));

    // Color scale
    const color = d3.scaleOrdinal()
      .domain(conditions)
      .range(d3.schemeCategory10);

    // Tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px");

    // Draw lines and add interactivity
    conditions.forEach(condition => {
        const line = d3.line()
          .x(d => x(d.start_year))
          .y(d => y(d[condition]));

        svg.append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", color(condition))
          .attr("stroke-width", 1.5)
          .attr("d", line)
          .on("mouseover", function(event, d) {
              d3.select(this)
                  .transition()
                  .duration(100)
                  .attr("stroke-width", 3);

              tooltip.transition()
                  .duration(200)
                  .style("opacity", .9);
              tooltip.html(`<strong>${condition}</strong><br>Total trials: ${d3.sum(d.map(dd => dd[condition]))}`)
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
                  .duration(100)
                  .attr("stroke-width", 1.5);

              tooltip.transition()
                  .duration(500)
                  .style("opacity", 0);
          });

        // Add scatter points
        svg.selectAll("dot")
          .data(data)
          .enter().append("circle")
          .attr("r", 4)
          .attr("cx", d => x(d.start_year))
          .attr("cy", d => y(d[condition]))
          .attr("fill", color(condition))
          .on("mouseover", (event, d) => {
              d3.select(this)
                  .transition()
                  .duration(100)
                  .attr("r", 6);

              tooltip.transition()
                  .duration(200)
                  .style("opacity", .9);
              tooltip.html(`${condition}<br>Year: ${d.start_year}<br>Trials: ${d[condition]}`)
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
                  .duration(100)
                  .attr("r", 4);

              tooltip.transition()
                  .duration(500)
                  .style("opacity", 0);
          });
    });

    // Title
    svg.append("text")
      .attr("x", width / 2)             
      .attr("y", -20)
      .attr("text-anchor", "middle")  
      .style("font-size", "24px") 
      .text("Number of Vaccine Trials per Year for Top Conditions: 2005-2024");

    // X axis label
    svg.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
      .style("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Year");

    // Y axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 20)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Number of Trials");

    // Add a legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width + 20}, 0)`)
      .selectAll("g")
      .data(conditions)
      .enter().append("g")
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


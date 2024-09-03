// Load the data from the JSON file
d3.json("vaccine_trials_by_year.json").then(function(data) {

    // Set up dimensions and margins
    const margin = {top: 60, right: 40, bottom: 70, left: 100},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    // Append the SVG object to the body of the page
    const svg = d3.select("#by-year-hbar")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis: scale and draw
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count)])
      .range([0, width]);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(0,10)")
      .style("text-anchor", "middle");

    // Y axis: scale and draw
    const y = d3.scaleBand()
      .range([height, 0])
      .domain(data.map(d => d.start_year))
      .padding(.1);

    svg.append("g")
      .call(d3.axisLeft(y));

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

    // Bars
    svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
        .attr("class", "bar")
        .attr("x", x(0))
        .attr("y", d => y(d.start_year))
        .attr("width", d => x(d.count))
        .attr("height", y.bandwidth())
        .attr("fill", "#4682B4")  // Use blue color for bars
        .on("mouseover", function(event, d) {
          d3.select(this)
              .transition()
              .duration(200)
              .attr("fill", d3.color("#4682B4").brighter(0.5));  // Lighten color on hover
          tooltip.transition()
              .duration(200)
              .style("opacity", .9);
          tooltip.html(`Year: ${d.start_year}<br>Trials: ${d.count}`)
              .style("left", (event.pageX + 5) + "px")
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
      .text("Distribution of Vaccine Trials by Start Year: 2005-2024");

    // X-axis label
    svg.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 20})`)
      .style("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Number of Trials");

    // Y-axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 20)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Start Year");

});


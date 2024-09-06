// Set the dimensions and margins of the graph
const margin = {top: 60, right: 50, bottom: 70, left: 100},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

// Append the svg object to the body of the page
const svg = d3.select("#top-20-country-chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load the JSON data
d3.json("top_20_country_counts.json").then(data => {

    data.sort((a, b) => a.count - b.count);

    // X axis
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count)])
      .range([0, width]);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5))
      .attr("class", "axis-label");

    // Y axis
    const y = d3.scaleBand()
      .range([height, 0])
      .domain(data.map(d => d.countries))
      .padding(.1);

    svg.append("g")
      .call(d3.axisLeft(y))
      .attr("class", "axis-label");

    // Define the tooltip element
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid 1px black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("pointer-events", "none");

    // Bars with Mouse Events
    svg.selectAll(".bar")
      .data(data)
      .join("rect")
        .attr("class", "bar")
        .attr("x", x(0))
        .attr("y", d => y(d.countries))
        .attr("width", d => x(d.count))
        .attr("height", y.bandwidth())
        .attr("fill", "steelblue")  // Set the bar color to blue
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", d3.color("steelblue").brighter(0.5));  // Lighten color on hover
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("Country: " + d.countries + "<br/>" + "Count: " + d.count)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", "steelblue");  // Revert to original color
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
      .text("Distribution of Vaccine Trials by Country/Region: 2005-2024");

    // X axis label
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Vaccine Trial Counts");

    // Y axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Countries / Regions");
});




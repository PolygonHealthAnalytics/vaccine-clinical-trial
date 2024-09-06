// Load the data
d3.json("phase_counts.json").then(function(data) {
    // Set up dimensions and margins
    const margin = {top: 40, right: 200, bottom: 60, left: 70},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3.select("#stacked-bar-chart")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);

    // Process data
    const keys = Object.keys(data[0]).filter(key => key !== 'start_year');
    const phases = keys.map(key => ({ key, values: data.map(d => ({ year: d.start_year, value: d[key] })) }));

    // Set up scales
    const x = d3.scaleBand()
                .domain(data.map(d => d.start_year))
                .range([0, width])
                .padding(0.1);

    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => keys.reduce((acc, key) => acc + d[key], 0))])
                .nice()
                .range([height, 0]);

    const color = d3.scaleOrdinal()
                    .domain(keys)
                    .range(['#A9A9A9','#ADD8E6', '#00cccc', '#4682B4', '#a366ff', '#0000FF', '#00008B']);

    // Add X axis
    svg.append("g")
       .attr("transform", `translate(0,${height})`)
       .call(d3.axisBottom(x).tickSize(0))
       .selectAll("text")
       .attr("transform", "rotate(-45)")
       .style("text-anchor", "end");

    // Add Y axis
    svg.append("g")
       .call(d3.axisLeft(y));

    // Create the stacked bars
    svg.selectAll("g.layer")
       .data(d3.stack().keys(keys)(data))
       .enter()
       .append("g")
       .attr("class", "layer")
       .attr("fill", d => color(d.key))
       .selectAll("rect")
       .data(d => d)
       .enter()
       .append("rect")
       .attr("x", d => x(d.data.start_year))
       .attr("width", x.bandwidth())
       .attr("y", d => y(d[1]))
       .attr("height", d => y(d[0]) - y(d[1]))
       .on("mouseover", function(event, d) {
           const key = d3.select(this.parentNode).datum().key;
           const count = d.data[key];
           const total = keys.reduce((acc, k) => acc + d.data[k], 0);
           const percentage = ((count / total) * 100).toFixed(1);

           d3.select(this).attr("opacity", 0.7);
           tooltip.style("visibility", "visible")
                  .html(`Year: ${d.data.start_year}<br>Phase: ${key}<br>Trials: ${count}<br>Percentage: ${percentage}%`)
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

    // Add a title to the graph
    svg.append("text")
       .attr("x", (width / 2))             
       .attr("y",-20)
       .attr("text-anchor", "middle")  
       .style("font-size", "24px")  
       .text("Distribution of Vaccine Trials by Start Year and Phase: 2005-2024");

    // Add x-axis label
    svg.append("text")
       .attr("transform", `translate(${width / 2}, ${height + margin.bottom-5})`)
       .style("text-anchor", "middle")
       .style("font-size", "20px")
       .text("Start Year");

    // Add y-axis label
    svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0 - margin.left )
       .attr("x", 0 - (height / 2))
       .attr("dy", "1em")
       .style("text-anchor", "middle")
       .style("font-size", "20px")
       .text("Number of Vaccine Trials");


    // Add the tooltip
    const tooltip = d3.select("body").append("div")
       .attr("id", "tooltip")
       .style("position", "absolute")
       .style("visibility", "hidden")
       .style("background-color", "white")
       .style("border", "1px solid black")
       .style("padding", "5px");

    // Add the legend
    const legend = svg.append("g")
                      .attr("transform", `translate(${width + 20}, 0)`)
                      .selectAll("g")
                      .data(keys)
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
          .text(d => d);
});


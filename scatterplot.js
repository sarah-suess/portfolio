// **** Your JavaScript code goes here ****

// Load the data
d3.csv('PokemonExtended.csv').then(function(data) {

    var tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('background-color', 'white')
    .style('border', '1px solid black')
    .style('padding', '5px')
    .style('border-radius', '5px')
    .style('opacity', 0); // Start with opacity 0 to keep it hidden

    // Convert attack, defense, and speed values to numbers
    data.forEach(d => {
        d.attack = +d.Attack;
        d.defense = +d.Defense;
        d.speed = +d.Speed;
    });

    // **** Functions to call for scaled values ****

    function scaleAttack(attack) {
        return attackScale(attack);
    }

    function scaleDefense(defense) {
        return defenseScale(defense);
    }

    function scaleSpeed(speed) {
        return speedScale(speed);
    }
    

    // **** Start of Code for creating scales for axes and data plotting****

    var attackScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.attack))
        .range([60, 700]);

    var defenseScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.defense))
        .range([340, 20]);

    // Scale for the speed attribute, mapping to a radius range
    var speedScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.speed))
        .range([3, 10]);

    var svg = d3.select('svg');

    // **** End of Code for creating scales for axes and data plotting****



    // X-axis - Append to svg (axis and label)
    var xAxis = d3.axisBottom(attackScale);
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0,340)")
        .call(xAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("x", 350)
        .attr("y", 40)
        .text("Attack");
    

    // Y-axis - Append to svg (axis and label)
    var yAxis = d3.axisLeft(defenseScale);
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(60,0)")
        .call(yAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("x", -170)
        .attr("y", -40)
        .attr("transform", "rotate(-90)")
        .text("Defense");


    // Title - Append to svg
    svg.append("text")
        .attr("x", 350)
        .attr("y", 34)
        .attr("class", "title")
        .text("Pokemon Attack vs. Defense");
    

    // Plot the points & scale radius by speed - Enter and append
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => scaleAttack(d.attack))
        .attr("cy", d => scaleDefense(d.defense))
        .attr("r", d => scaleSpeed(d.speed))
        .style("fill", "steelblue")
        .style("opacity", 0.7)
        .on('mouseover', function(event, i) {
            const d = data[i]; // Use 'i' as an index to access the correct object
            
            const cx = d3.event.pageX;
            const cy = d3.event.pageY;
            console.log(cx);
            console.log(cy);
            
            // TO-DO: Style the tooltip correctly.
            tooltip.transition().duration(200).style('opacity', 1);
            tooltip.html(`
                <b>${d.Name}</b><br>
                Type 1: ${d["Type 1"]}<br>
                ${d["Type 2"] ? `Type 2: ${d["Type 2"]}` : ""}
            `)
            tooltip.style('left', cx + 'px')
            tooltip.style('top', cy + 'px');

            // extra credit
            svg.selectAll('circle')
                .style('opacity', 0.1)
                .filter(pokemon => {
                    return pokemon["Type 1"] === d["Type 1"] || pokemon["Type 2"] === d["Type 2"];
                })
                .style('opacity', 1);
        })
        .on('mouseout', function() {
            // TO-DO: Hide the tooltip when not hovering
            tooltip.transition().duration(200).style('opacity', 0);

            // extra credit pt 2
            svg.selectAll('circle')
                .style('opacity', 0.7);
        }); 

    // seperate to make only these circles yellow
    svg.selectAll("circle")
        .filter(d => d.speed > 100)
        .style("fill", "#ffd32d");
    
});

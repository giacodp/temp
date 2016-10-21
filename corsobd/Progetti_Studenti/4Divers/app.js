var width = 850
var height = 500

var svg = d3.select('svg')
    .attr('width', width)
    .attr('height', height)


d3.csv('dataset/athletes_sochi.csv', function(data){

    var labels = ["<22", "22-24", "25-27", "28-31", ">31"]
    
    
    byAge = d3.nest()
                .key(function(d,i){
                    var fascia;
                    if(d.age < 22){
                        fascia = 0                  
                    }
                    if(d.age >= 22 && d.age < 25 )
                        fascia = 1
                    if(d.age >= 25 && d.age < 28 )
                        fascia = 2
                    if(d.age >= 28 && d.age < 32 )
                        fascia = 3
                    if(d.age >= 32  )
                        fascia = 4
                    return fascia                    
                })
                .key(function(d,i){                
                    return d.gender;                    
                })
                .sortKeys(d3.ascending)
                .rollup(function(d){
                    return { 
                             tot: d3.sum(d, function(d,i){ return 1 }), 
                             gold: d3.sum(d, function(d,i){ return d.gold_medals}), 
                             silver: d3.sum(d, function(d,i){ return d.silver_medals}), 
                             bronze: d3.sum(d, function(d,i){ return d.bronze_medals}) 
                    };
                })    
                .entries(data)
    
    var maxMF = 450
    var maxMED = 70

    var MFscaleY = d3.scale.linear()
                    .domain([0, maxMF])
                    .range([450, 50])

    var MEDscaleY = d3.scale.linear()
                    .domain([0, maxMED])
                    .range([450, 50])
    
    var axg = d3.select('svg').append('g').attr('transform','translate(50,0) ')

    var asse = d3.svg.axis().orient('left').scale(MFscaleY)
    
    axg.call(asse)
    
    function drawMF (data, scala, opacity){
        // creiamo un gruppo per ogni fascia d'età
    var groups = svg.append('g')
        .selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
//            dt.push(d.key);
            return 'translate(' + (i+1) * 130 + ', 0)' // traslazione di ogni gruppo a destra
        })
    
    groups.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', 50)
        .attr('y', 480)
        .text(function(d,i){ return labels[d.key]} )

    var rects = groups.selectAll('rect')
        .data(function (d) {
            
            return d.values // per ogni gruppo entra nella distinzione maschi/femmine
        })
        .enter()
        .append('rect')
        .attr('opacity', opacity)
        .attr('height', 0)
        .attr('y', scala(0))
        .attr('stroke','black')
        .attr('width', 50)    
        .attr('x', function(d,i){ return i*50 }) // traslo le due colonne maschi/femmine
        .attr('fill', function(d,i){ if(d.key == 'Male') 
                                        return 'blue'
                                     else
                                        return 'pink'
            } )
        .transition()
        .duration(1000)
        .ease('elastic')
        .attr('height', function(d, i){
            return scala(0) - scala(d.values.tot)
        })
        .attr('y', function(d,i){ return  scala(d.values.tot)  }) // traslo le due colonne maschi/femmine        

        
    }


    function drawMedals(data, scala){
        
        var groups2 = svg.append('g')
            .selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .attr('transform', function (d, i) {
    //            dt.push(d.key);
                return 'translate(' + (i+1) * 130 + ', 0)' // traslazione di ogni gruppo a destra
            })


        var rects2 = groups2.selectAll('rect')
            .data(function (d) {

                return d.values // per ogni gruppo entra nella distinzione maschi/femmine
            })
            .enter()
            .append('rect')
            .attr('stroke','black')
            .attr('width', 50)    
            .attr('height', 0)
            .attr('y', scala(0))
            .attr('x', function(d,i){ return i*50 }) // traslo le due colonne maschi/femmine
            .attr('fill', 'yellow')
            .transition()
            .duration(1000)
            .ease('elastic')
            .delay(1000)
            .attr('y', function(d,i){ return scala(d.values.gold + d.values.silver + d.values.bronze)  }) // modifica la y delle due colonne maschi/femmine per partire dal basso
            .attr('height', function(d, i){
                return scala(0) -  scala(d.values.gold + d.values.silver + d.values.bronze)
            })


    } 

    drawMF(byAge, MFscaleY, 1)
    
    drawMedals(byAge, MFscaleY)
    
        
    d3.select('svg').on('click', function(){
        d3.select(this)
            .selectAll('rect')
            .remove()
        
        var asse = d3.svg.axis().orient('left').scale(MEDscaleY)
        axg.transition().duration(1000).call(asse)
        drawMF(byAge, MEDscaleY, 0.2)
        drawMedals(byAge, MEDscaleY)    
    } )
    
    
}) // chiusura del CVS
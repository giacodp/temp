var width = 850
var height = 500

var svg = d3.select('svg')
    .attr('width', width)
    .attr('height', height)

                
 function vowel_count(str1)  
{  
  var vowel_list = 'aeiouAEIOU';  
  var vcount = 0;  
    
  for(var x = 0; x < str1.length ; x++)  
  {  
    if (vowel_list.indexOf(str1[x]) !== -1)  
    {  
      vcount += 1;  
    }  
    
  }  
  return vcount;  
}  
                         
d3.csv("dataset/athletes_sochi_lat.csv", function(d){
            d.impronunciability = vowel_count(d.name)/d.name.length
                return d 
       }, 
  function(data)  {
    
                var minh = d3.min(data, function(d, i){
                    return d.height  
                })
                
                var maxh = d3.max(data, function(d, i){
                    return d.height
                })
                
                var minw = d3.min(data, function(d, i){
                    return d.impronunciability  
                })
                
                var maxw = d3.max(data, function(d, i){
                    return d.impronunciability
                })
                
                
                var bar_width = 300 / data.length
                
                var myScaleh = d3.scale.linear()
                    .domain([minh, maxh])
                    .range([0, 150])
                
                var myScalew = d3.scale.linear()
                    .domain([minw, maxw])
                    .range([0, 300])
           

                d3.select('svg').append('g')
                    .attr('transform', 'translate(0,300)')
                
                d3.select('svg').append('text')
                    .text("Grafico altezza verso impronunciabilità")
                    .attr('y', 280)
                    
                var punti = d3.select('svg').select('g')
                    .selectAll('circle')
                    .data(data)
                    .enter()
                    .append('circle')
                    .attr('r', 5)
                    .attr('opacity', function(d,i){
                        if (d.height) {return 0.3 } else return 0
                    })
                     .attr('cy', function(d,i){
                         return myScaleh(d.height)
                     })
                    .attr('cx', function(d,i){
                         return myScalew(d.impronunciability)
                     })

    // conta i vari tipi di medaglie, per ciascuna latitudine
    function contaMedaglie(array, n) {
        var somma = d3.sum(array, function(d,i){
            // conta tutti
            if (n=='athletes') return  1
            if (n=='gold') return (d.gold_medals > 0) ? 1 : 0
            if (n=='silver') return (d.silver_medals > 0) ? 1 : 0
            if (n=='bronze') return (d.bronze_medals > 0) ? 1 : 0
            if (n=='any') return (d.total_medals > 0) ? 1 : 0
            if (n=='none') return (d.total_medals == 0) ? 1 : 0
        })
        return somma
    }

    var newdata = d3.nest()
        .key(function(d){
            return d.latitude
        })
        .rollup(function(d){
            return {
                partecipanti: contaMedaglie(d, 'athletes'),
                ori: contaMedaglie(d, 'gold'),
                argenti: contaMedaglie(d, 'silver'),
                bronzi: contaMedaglie(d, 'bronze'),
                nessuna: contaMedaglie(d, 'none'),
                almenouna: contaMedaglie(d, 'any')
            }
        })
        .entries(data)
    
    console.log(newdata)
    
    var maxGold = d3.max(newdata, function(d,i){
        return d.values.ori
    })
    var maxSilver = d3.max(newdata, function(d,i){
        return d.values.argenti
    })
    var maxBronze = d3.max(newdata, function(d,i){
        return d.values.bronzi
    })
    var maxNone = d3.max(newdata, function(d,i){
        return d.values.nessuna
    })
    var maxAL1 = d3.max(newdata, function(d,i){
        return d.values.almenouna
    })
    
    var maxGoldRatio = d3.max(newdata, function(d,i){
        return (d.values.ori/d.values.partecipanti)
    })
    var maxSilverRatio = d3.max(newdata, function(d,i){
        return (d.values.argenti/d.values.partecipanti)
    })
    var maxBronzeRatio = d3.max(newdata, function(d,i){
        return (d.values.bronzi/d.values.partecipanti)
    })
    var maxNoneRatio = d3.max(newdata, function(d,i){
        return (d.values.nessuna/d.values.partecipanti)
    })
    var maxAL1Ratio = d3.max(newdata, function(d,i){
        return (d.values.almenouna/d.values.partecipanti)
    })

    var maxRadius = 25
    var clickedMedals = false
    
    var mapNumeroOri = d3.scale.linear()
        .domain([0, maxGold])
        .range([3, maxRadius*0.9])
    var mapFrazioneOri = d3.scale.linear()
        .domain([0, maxGoldRatio])
        .range([3, maxRadius*0.9])
    
    var mapNumeroArg = d3.scale.linear()
        .domain([0, maxSilver])
        .range([3, maxRadius*0.9])
    var mapFrazioneArg = d3.scale.linear()
        .domain([0, maxSilverRatio])
        .range([3, maxRadius*0.9])
    
    var mapNumeroBro = d3.scale.linear()
        .domain([0, maxBronze])
        .range([3, maxRadius*0.9])
    var mapFrazioneBro = d3.scale.linear()
        .domain([0, maxBronzeRatio])
        .range([3, maxRadius*0.9])

    var mapNumeroNes = d3.scale.linear()
        .domain([0, maxNone])
        .range([3, maxRadius*0.9])
    var mapFrazioneNes = d3.scale.linear()
        .domain([0, maxNoneRatio])
        .range([3, maxRadius*0.9])

    var mapNumeroAL1 = d3.scale.linear()
        .domain([0, maxAL1])
        .range([3, maxRadius*0.9])
    var mapFrazioneAL1 = d3.scale.linear()
        .domain([0, maxAL1Ratio])
        .range([3, maxRadius*0.9])

    // questo è un gruppo che contiene le medaglie d'oro
    var gGold = d3.select('svg')
        .append('g')
        .attr('class', 'gold')
        .attr('transform', 'translate(' + 0 +',20)')
    
    gGold.append('text')
            .text("ORI")
            .attr('y', -5)
            .attr('stroke','black')
    
    var gSilver = d3.select('svg')
        .append('g')
        .attr('class', 'silver')
        .attr('transform', 'translate(' + (maxRadius*7) +',20)')
    gSilver.append('text')
            .text("ARGENTI")
            .attr('y', -5)
            .attr('stroke','black')

    var gBronze = d3.select('svg')
        .append('g')
        .attr('class', 'bronze')
        .attr('transform', 'translate(' + (maxRadius*7)*2 +',20)')
    gBronze.append('text')
            .text("BRONZI")
            .attr('y', -5)
            .attr('stroke','black')

    var gNone = d3.select('svg')
        .append('g')
        .attr('class', 'none')
        .attr('transform', 'translate(' + (maxRadius*3) +','+(maxRadius*3+20)+')')
    gNone.append('text')
            .text("NESSUNA")
            .attr('y', 95)
            .attr('stroke','black')
    
    var gAL1 = d3.select('svg')
        .append('g')
        .attr('class', 'al1')
        .attr('transform', 'translate(' + (maxRadius*3)*3.5 +','+(maxRadius*3+20)+')')
    gAL1.append('text')
            .text("ALMENO 1")
            .attr('y', 95)
            .attr('stroke','black')

    function drawCircles(grp, numero, set) {
        
        grp.selectAll('circle')
            .attr('r', function(d,i){
                if (numero) {
                    if (set=='gold') return mapNumeroOri(d.values.ori)
                    if (set=='silver') return mapNumeroArg(d.values.argenti)
                    if (set=='bronze') return mapNumeroBro(d.values.bronzi)
                    if (set=='none') return mapNumeroNes(d.values.nessuna)
                    if (set=='AL1') return mapNumeroAL1(d.values.almenouna)
                } else {
                    if (set=='gold') return mapFrazioneOri(d.values.ori / d.values.partecipanti)
                    if (set=='silver') return mapFrazioneArg(d.values.argenti / d.values.partecipanti)
                    if (set=='bronze') return mapFrazioneBro(d.values.bronzi / d.values.partecipanti)
                    if (set=='none') return mapFrazioneNes(d.values.nessuna / d.values.partecipanti)
                    if (set=='AL1') return mapFrazioneAL1(d.values.almenouna / d.values.partecipanti)
                }
            })
            .attr('fill', function(d,i){
                if (set=='gold') return 'gold' 
                if (set=='silver') return 'silver' 
                if (set=='bronze') return 'orange' 
                if (set=='none') return 'brown'
                if (set=='AL1') return 'yellow' 
            })
            .attr('opacity',function(d,i){
                if (numero) {
                    return 0.5 
                } else {
                    return 0.8
                }
            })
    }

    function drawAllCircles(x) {
        drawCircles(gGold, x, 'gold')
        drawCircles(gSilver, x, 'silver')
        drawCircles(gBronze, x, 'bronze')
        drawCircles(gNone, x, 'none')
        drawCircles(gAL1, x, 'AL1')
    }
    function addCircles(g) {
        g.selectAll('circle')
            .data(newdata)
            .enter()
            .append('circle')
            .attr('cx', function(d,i){
                return (d.key == "2" || d.key == "4") ? ((i+1)*maxRadius) : ((i+1)*maxRadius)
            })
            .attr('cy', function(d,i){
                return (d.key == "2" || d.key == "4") ? maxRadius*2 : maxRadius
            })
            .attr('fill', 'gold')
            .attr('r', 5)
            .on('click', function(d,i){
                if (clickedMedals) {
                    drawAllCircles(true)
                    clickedMedals = false
                } else {
                    drawAllCircles(false)
                    clickedMedals = true
                }
            })        
    }
    
    addCircles(gGold)
    addCircles(gSilver)
    addCircles(gBronze)
    addCircles(gNone)
    addCircles(gAL1)
    drawAllCircles(true) 
        
    
}) // chiusura del CVS
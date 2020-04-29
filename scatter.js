(function() {
    const cols = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928','#bebada','#fb8072','#80b1d3','#fdb462']

    const syms = {
        'FFP1': 'diamond',
        'FFP2': 'triangle',
        'FFP3': 'circle'
    }
    let url = './'
    if (window.location.hostname !== 'localhost') {
        url = 'https://data.irozhlas.cz/respir-nakupy/'
    }

    

    fetch(url + 'data.json')
        .then((response) => response.json())
        .then((data) => {
            const srs = []
            Object.keys(data).forEach( (resort, i) => {
                Object.keys(data[resort]).forEach(typ => {
                    srs.push({
                        name: resort + ' - ' + typ,
                        marker: {
                            symbol: syms[typ]
                        },
                        color: cols[i],
                        data: data[resort][typ].map(val => [ Date.parse(val[0]), val[1] ])
                    })                    
                })
            })
            function drw(topic) {
                let tit = ' - ministerstva'
                let fltr = true
                if (topic !== 'min') {
                    tit = ' - kraje'
                    fltr = false
                }
            
                Highcharts.chart('resp_nakupy_' + topic, {
                    chart: {
                        type: 'scatter',
                        zoomType: 'xy'
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: 'Nákupy respirátorů' + tit
                    },
                    subtitle: {
                        text: 'data: <a target="_blank" href="https://www.hlidacstatu.cz/texty/divoky-trh-s-respiratory/">Hlídač státu</a> a jednotlivé resorty',
                        useHTML: true
                    },
                    xAxis: {
                        type: 'datetime',
                        endOnTick: true,
                        showLastLabel: true,
                        startOnTick: true,
                        labels:{
                            formatter: function(){
                                return Highcharts.dateFormat('%d. %m.', this.value)
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'jednotková cena, s DPH'
                        }
                    },
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom',
                        backgroundColor: Highcharts.defaultOptions.chart.backgroundColor,
                    },
                    tooltip: {
                        formatter: function() {
                            return `<b>${this.series.name}</b>
                            <br>${Highcharts.dateFormat('%d. %m.', this.x)} - ${Math.round(this.y * 100) / 100} Kč`
                        }
                    },
                    plotOptions: {
                        scatter: {
                            marker: {
                                radius: 5,
                                states: {
                                    hover: {
                                        enabled: true,
                                        lineColor: 'rgb(100,100,100)'
                                    }
                                }
                            },
                            states: {
                                hover: {
                                    marker: {
                                        enabled: false
                                    }
                                }
                            },
                        }
                    },
                    series: srs.filter(s => s.name.includes('Ministerstvo') === fltr)
                })
            }
            drw('min')
        })
})()
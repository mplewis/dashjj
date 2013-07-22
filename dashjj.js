var muniDataSrc = "data.json"

var muniColorClasses = {
    'KT': 'MuniK',
    'L':  'MuniL',
    'M':  'MuniM'
};

function isInboundMuni(stopData) {
    return (stopData.direction == "inbound" &&
            (stopData.route_id == "KT" ||
             stopData.route_id == "L"  ||
             stopData.route_id == "M"));
}

$.getJSON(muniDataSrc, function(data) {
    var stops = data.stops;
    var inboundSubwayStops = [];
    var otherStops = [];
    
    // sort stops into inbound subway stops and non-(inbound subway) stops
    for (var i = 0; i < stops.length; i++) {
        var stop = stops[i];
        if (isInboundMuni(stop)) {
            inboundSubwayStops.push(stop);
        } else {
            otherStops.push(stop);
        }
    }
    
    // write inbound subway stops to their own div
    var inboundSubwayConciseStops = [];
    for (var i = 0; i < inboundSubwayStops.length; i++) {
        var stop = inboundSubwayStops[i];
        for (var j = 0; j < stop.possible_departure_times.length; j++) {
            var time = stop.possible_departure_times[j];
            inboundSubwayConciseStops.push({"line": stop.route_id, "time": time});
        }
    }
    inboundSubwayConciseStops.sort(function(a, b) {
        if (a.time < b.time) {
            return -1;
        } else if (a.time > b.time) {
            return 1;
        } else {
            return 0;
        }
    });
    var out = "";
    for (var i = 0; i < inboundSubwayConciseStops.length; i++) {
        stop = inboundSubwayConciseStops[i];
        colorClass = muniColorClasses[stop.line];
        $('<span>').addClass(colorClass).text(stop.time).appendTo('.inbound-subway');
        if (i != inboundSubwayConciseStops.length - 1) {
            $('.inbound-subway').append(', ');
        }
    }
    
});
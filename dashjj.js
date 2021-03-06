var muniDataSrc = "http://jsonp.jit.su/?url=http%3A%2F%2Fjj-muni.aws.af.cm%2F"

var muniColorClasses = {
    'J':  'MuniJ',
    'KT': 'MuniK',
    'K':  'MuniK',
    'L':  'MuniL',
    'M':  'MuniM',
    'N':  'MuniN',
    'T':  'MuniT'
};

var noArrivalsText = 'no upcoming arrivals';

function isInbound(stopData) {
    return (stopData.direction == "inbound");
}

function isMetro(stopData) {
    return (stopData.route_id == "J"  ||
            stopData.route_id == "KT" ||
            stopData.route_id == "L"  ||
            stopData.route_id == "M"  ||
            stopData.route_id == "N");
}

function getRouteIdAndFixKT(stopData) {
    if (stopData.route_id == "KT") {
        if (isInbound(stopData)) {
            return "T";
	} else {
            return "K";
	}
    }
    return stopData.route_id;
}

$.getJSON(muniDataSrc, function(data) {
    var stops = data.stops;
    var inboundSubwayStops = [];
    var otherStops = [];
    
    // sort stops into inbound subway stops and non-(inbound subway) stops
    for (var i = 0; i < stops.length; i++) {
        var stop = stops[i];
        if (isInbound(stop) && isMetro(stop)) {
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
            inboundSubwayConciseStops.push({"line": getRouteIdAndFixKT(stop), "time": time});
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
    if (inboundSubwayConciseStops.length == 0) {
        var divOut = $('<div>').addClass('inactive-line').text(noArrivalsText);
        $('.inbound-subway').append(divOut);
    } else {
        for (var i = 0; i < inboundSubwayConciseStops.length; i++) {
            stop = inboundSubwayConciseStops[i];
            colorClass = muniColorClasses[stop.line];
            console.log(stop.time);
            if (stop.time == 0) {
                timeText = "now";
            } else {
                timeText = stop.time;
            }
            $('<span>').addClass(colorClass).text(timeText).appendTo('.inbound-subway');
            if (i != inboundSubwayConciseStops.length - 1) {
                $('.inbound-subway').append(', ');
            }
        }
    }

    // write other subway stops programatically
    console.log(otherStops);
    for (var i = 0; i < otherStops.length; i++) {
        stop = otherStops[i];
        lineName = stop.desc;
        lineTimes = stop.possible_departure_times;
        if (lineTimes[0] == 0) {
            lineTimes[0] = "now";
        }
        var container = $('<div>').addClass('line-display');
        $('<div>').addClass('line-name').text(lineName + ':').appendTo(container);
        var times;
        var noArrivals = false;
        if (lineTimes.length == 0) {
            times = noArrivalsText
            noArrivals = true;
        } else {
            times = lineTimes.join(', ');
        }
        lineData = $('<div>').addClass('line-data').text(times).appendTo(container);
        if (noArrivals) {
            lineData.addClass('inactive-line');
        }
        $('.muni-lines').append(container);
    }

    $('.muni-lines').fadeIn();
});

var muniDataSrc = "http://jsonp.jit.su/?url=http%3A%2F%2Fjj-muni.aws.af.cm%2F"

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
        var times = lineTimes.join(', ');
        $('<div>').addClass('line-data').text(times).appendTo(container);
        $('.muni-lines').append(container);
    }

    $('.muni-lines').fadeIn();
});
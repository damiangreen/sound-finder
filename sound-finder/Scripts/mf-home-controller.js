var myApp = angular.module('soundFinderApp', []);

myApp.controller('HomeController', ['$scope', function ($scope) {
    $scope.effects = true;

    //set up standard filters
    $scope.setup = function(defs) {
        var shadowFilter = defs.append('filter')
            .attr('id', 'shadow')
            .attr('x', '-20%')
            .attr('y', '-20%')
            .attr('width', '140%')
            .attr('height', '140%');

        shadowFilter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", '2 2')
            .attr("result", "shadow");

        shadowFilter.append("feOffset")
            //.attr("in", "blur")
            .attr("dx", 2)
            .attr("dy", 2);
    };

    $scope.appendDropShadowText = function(bar) {
        bar.append("text")
            .attr("transform", function(d, i) { return "translate(5,10)"; })
            .text(function(d) { return d.name; })
            .style("filter", "url(#shadow)");
        bar.append("text")
            .attr("transform", function(d, i) { return "translate(5,10)"; })
            .text(function(d) { return d.name; });
    };

    $scope.drawChart = function () {
     
        var width = 960,
            height = 500;

        var color = d3.scale.category20();

        var force = d3.layout.force()
            .linkDistance(30)
            .linkStrength(2)
            .size([width, height]);

        var svg = d3.select("#resultspanel")
                    .append("svg")
                        .attr("width", width)
                        .attr("height", height);
        var defs = svg.append("defs");
        $scope.setup(defs);
        // black drop shadow

        //var filter = defs.append("filter")
        //    .attr("id", "drop-shadow");

        //filter.append("feGaussianBlur")
        //    .attr("in", "SourceAlpha")
        //    .attr("stdDeviation", .8)
        //    .attr("result", "blur");

        //filter.append("feFlood")
        //    .attr("flood-color", "rgba(1,1,0,0.5)");

        //filter.append("feMerge")
        //   .append("feMergeNode")
        //   .append("feMergeNode").attr("in", "SourceGraphic");

        //filter.append("feOffset")
        //    .attr("in", "blur")
        //    .attr("dx", 2)
        //    .attr("dy", 2)
        //    .attr("result", "offsetBlur");


        d3.json(document.location.href + "/Content/miserables.json", function (error, graph) {
            var nodes = graph.nodes.slice(),
                links = [],
                bilinks = [];

            graph.links.forEach(function (link) {
                var s = nodes[link.source],
                    t = nodes[link.target],
                    i = {}; // intermediate node
                nodes.push(i);
                links.push({ source: s, target: i }, { source: i, target: t });
                bilinks.push([s, i, t]);
            });

            force
                .nodes(nodes)
                .links(links)
                .start();

            var link = svg.selectAll(".link")
                .data(bilinks)
                .enter().append("path")
                .attr("class", "link");

            var bar = svg.selectAll(".node")
                      .data(graph.nodes)
                      .enter()
                      .append("g")
                          .attr("class", "node-container")
                      .call(force.drag)
            ;

            var node = bar.append("rect")
                 .attr("rx", 3)
                 .attr("ry", 3)
                 .attr("class", "node")
                 .attr("width", 65)
                 .attr("height", 25)
                .style("fill", function(d) {
                     return color(d.group);
                })
            ;

            $scope.appendDropShadowText(bar);

            force.on("tick", function () {
                link.attr("d", function (d) {
                    return "M" + d[0].x + "," + d[0].y
                        + "S" + d[1].x + "," + d[1].y
                        + " " + d[2].x + "," + d[2].y;
                });
                bar.attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });
            });
        });
    };

    // constructor
    $scope.greeting = 'Hola!';
    $scope.drawChart();
}]);
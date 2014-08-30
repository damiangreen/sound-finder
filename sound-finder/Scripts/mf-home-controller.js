var myApp = angular.module('soundFinderApp', []);

myApp.controller('HomeController', ['$scope', function ($scope) {

    $scope.drawChart = function () {

        var width = 960,
            height = 500;

        var color = d3.scale.category20();

        var force = d3.layout.force()
            .linkDistance(10)
            .linkStrength(2)
            .size([width, height]);

        var svg = d3.select("#resultspanel").append("svg")
            .attr("width", width)
            .attr("height", height);

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
            debugger;
            var bar = svg.selectAll(".node")
                      .data(graph.nodes)
                      .enter()
                      .append("g")
                      .call(force.drag)
            ;

            var node = bar.append("circle")
                .attr("class", "node")
                .attr("r", 15)
                .style("fill", function (d) { return color(d.group); })
            ;

            bar.append("text")
                .attr("transform", function (d, i) { return "translate(-30,0)"; })
               .text(function (d) { return d.name; });

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

    $scope.greeting = 'Hola!';
    $scope.drawChart();
}]);
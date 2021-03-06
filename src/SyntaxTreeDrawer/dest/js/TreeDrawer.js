"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TreeDrawer = function () {
    function TreeDrawer(json) {
        _classCallCheck(this, TreeDrawer);

        this.json = json;
    }

    _createClass(TreeDrawer, [{
        key: "draw",
        value: function draw() {
            var margin = {
                top: 10,
                right: 10,
                bottom: 10,
                left: 10
            },
                width = 840,
                height = 600;
            var kx = function kx(d) {
                return d.x - 10;
            };
            var ky = function ky(d) {
                return d.y - 10;
            };

            var kx_ellipse = function kx_ellipse(d) {
                return d.x;
            };
            var ky_ellipse = function ky_ellipse(d) {
                return d.y;
            };

            //thie place the text x axis adjust this to center align the text
            var tx = function tx(d) {
                return d.x - 3;
            };
            var tx_ellipse = function tx_ellipse(d) {
                return d.x - 15;
            };
            //thie place the text y axis adjust this to center align the text
            var ty = function ty(d) {
                return d.y + 3;
            };
            var ty_ellipse = function ty_ellipse(d) {
                return d.y + 3;
            };
            //make an SVG
            var svg = d3.select("#graph").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).call(d3.behavior.zoom().on("zoom", function () {
                svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
            })).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            //My JSON note the
            //no_parent: true this ensures that the node will not be linked to its parent
            //hidden: true ensures that the nodes is not visible.
            var preprocessor = new JsonPreprocessor(this.json);
            preprocessor.preprocess();

            var root = preprocessor.getSyntaxTree();
            var allNodes = flatten(root);
            //This maps the siblings together mapping uses the ID using the blue line
            var siblings = preprocessor.getSiblingsArray();

            // Compute the layout.
            var tree = d3.layout.tree().size([width, height]),
                nodes = tree.nodes(root),
                links = tree.links(nodes);

            // Create the link lines.
            svg.selectAll(".link").data(links).enter().append("path").attr("class", "link").attr("d", elbow);

            var nodes = svg.selectAll(".node").data(nodes).enter();
            var rectNodes = svg.selectAll(".node").data(tree.nodes(root).filter(function (n) {
                return n.container === containers.rectangle;
            })).enter();
            var ellipseNodes = svg.selectAll(".node").data(tree.nodes(root).filter(function (n) {
                return n.container === containers.ellipse;
            })).enter();

            //First draw sibling line with blue line
            svg.selectAll(".sibling").data(siblings).enter().append("path").attr("class", "sibling").attr("d", sblingLine);

            // Create the node rectangles.
            rectNodes.append("rect").attr("class", "node").attr("height", 20).attr("width", 40).attr("id", function (d) {
                return d.id;
            }).attr("display", function (d) {
                if (d.hidden) {
                    return "none";
                } else {
                    return "";
                };
            }).attr("x", kx).attr("y", ky);

            ellipseNodes.append("ellipse").attr("class", "node").attr("rx", 25).attr("ry", 10).attr("id", function (d) {
                return d.id;
            }).attr("display", function (d) {
                if (d.hidden) {
                    return "none";
                } else {
                    return "";
                };
            }).attr("cx", kx_ellipse).attr("cy", ky_ellipse);

            // Create the node text label.
            rectNodes.append("text").text(function (d) {
                return d.name;
            }).attr("x", tx).attr("y", ty);

            ellipseNodes.append("text").text(function (d) {
                return d.name;
            }).attr("x", tx_ellipse).attr("y", ty);

            /**
             This defines teh line between siblings.
             **/
            function sblingLine(d, i) {
                //start point
                var start = allNodes.filter(function (v) {
                    if (d.source.id == v.id) {
                        return true;
                    } else {
                        return false;
                    }
                });
                //end point
                var end = allNodes.filter(function (v) {
                    if (d.target.id == v.id) {
                        return true;
                    } else {
                        return false;
                    }
                });
                //define teh start coordinate and end co-ordinate
                var linedata = [{
                    x: start[0].x,
                    y: start[0].y
                }, {
                    x: end[0].x,
                    y: end[0].y
                }];
                var fun = d3.svg.line().x(function (d) {
                    return d.x;
                }).y(function (d) {
                    return d.y;
                }).interpolate("linear");
                return fun(linedata);
            }

            /*To make the nodes in flat mode.
            This gets all teh nodes in same level*/
            function flatten(root) {
                var n = [],
                    i = 0;

                function recurse(node) {
                    if (node.children) node.children.forEach(recurse);
                    if (!node.id) node.id = ++i;
                    n.push(node);
                }
                recurse(root);
                return n;
            }
            /**
             This draws the lines between nodes.
             **/
            function elbow(d, i) {
                if (d.target.no_parent) {
                    return "M0,0L0,0";
                }
                var diff = d.source.y - d.target.y;
                //0.40 defines the point from where you need the line to break out change is as per your choice.
                var ny = d.target.y + diff * 0.40;

                var linedata = [{
                    x: d.target.x,
                    y: d.target.y
                }, {
                    x: d.target.x,
                    y: ny
                }, {
                    x: d.source.x,
                    y: d.source.y
                }];

                var fun = d3.svg.line().x(function (d) {
                    return d.x;
                }).y(function (d) {
                    return d.y;
                }).interpolate("step-after");
                return fun(linedata);
            }
        }
    }]);

    return TreeDrawer;
}();
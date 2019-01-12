var margin = {top: 0, right: 0, bottom: 0, left: 0},
width = screen.width - margin.left - margin.right,
height = screen.height - margin.top - margin.bottom - 200;
 
var rect = [50,50, width - 50, height - 50];
 
var n = 10,
m = 2,
padding = 6,
maxSpeed = 3,
radius = d3.scale.sqrt().range([20, 20]),
color = d3.scale.category10().domain(d3.range(m));
var nodes = [];
color1=4;


colorc=0;
for (i in d3.range(n)){
if (i>=color1) { colorc=1}
nodes.push({radius: radius(1 + Math.floor(Math.random() * 4)),
id: i,            
color: color(colorc),
originalColor: color(colorc),            
x: rect[0] + (Math.random() * (rect[2] - rect[0])),
y:rect[1] + (Math.random() * (rect[3] - rect[1])),
speedX: (Math.random() - 0.3) * 2 *maxSpeed,
speedY: (Math.random() - 0.3) * 2 *maxSpeed});
}
 
setTimeout(freeze, 4000)
setTimeout(hideColor, 2000)

function freeze() {
console.log(nodes)
   for (i in d3.range(n)){
        nodes[i].speedX=0;
        nodes[i].speedY=0;
          }    
}
 
function hideColor() {
console.log("hideColors", nodes)
   for (i in d3.range(n)){
        nodes[i].color= color(0);
          }    
}
 

var force = d3.layout.force()
.nodes(nodes)
.size([width, height])
.gravity(0)
.charge(0)
.on("tick", tick)
.start();
 
var svg = d3.select("body").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
svg.append("svg:rect")
.attr("width", rect[2] - rect[0])
.attr("height", rect[3] - rect[1])
.attr("x", rect[0])
.attr("y", rect[1])
.style("fill", "None")
.style("stroke", "#FFF");
 
var circle = svg.selectAll("circle")
.data(nodes)
.enter().append("circle")
.attr("id", function(d) { return d.id; })
.attr("r", function(d) { return d.radius; })
.attr("cx", function(d) { return d.x; })
.attr("cy", function(d) { return d.y; })
.style("fill", function(d) { return d.color; })
.on("click", function(d){
		// Determine if current line is visible
		console.log(d.id,d.speedX);
    
    var c = document.getElementById("rCanvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.rect(40*d.id, 0, 40, 40);
    if (d.id>=color1) {
    ctx.fillStyle = "red"; }
     else {
        ctx.fillStyle = "blue"; 
     }
    ctx.fill();

    
   // ctx.stroke();
    
	})

//.call(force.drag);
 
var flag = false;
function tick(e) {
force.alpha(0.1)
circle
.style("fill", function(d) { return d.color; })
.each(gravity(e.alpha))
.each(collide(.5))
.attr("cx", function(d) { return d.x; })
.attr("cy", function(d) { return d.y; });
}
 
 
// Move nodes toward cluster focus.
function gravity(alpha) {
return function(d) {
if ((d.x - d.radius - 2) < rect[0]) d.speedX = Math.abs(d.speedX);
if ((d.x + d.radius + 2) > rect[2]) d.speedX = -1 * Math.abs(d.speedX);
if ((d.y - d.radius - 2) < rect[1]) d.speedY = -1 * Math.abs(d.speedY);
if ((d.y + d.radius + 2) > rect[3]) d.speedY = Math.abs(d.speedY);
 
d.x = d.x + (d.speedX * alpha);
d.y = d.y + (-1 * d.speedY * alpha);
 
};
}
 
// Resolve collisions between nodes.
function collide(alpha) {
var quadtree = d3.geom.quadtree(nodes);
return function(d) {
var r = d.radius + radius.domain()[1] + padding,
nx1 = d.x - r,
nx2 = d.x + r,
ny1 = d.y - r,
ny2 = d.y + r;
quadtree.visit(function(quad, x1, y1, x2, y2) {
if (quad.point && (quad.point !== d)) {
var x = d.x - quad.point.x,
y = d.y - quad.point.y,
l = Math.sqrt(x * x + y * y),
r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
if (l < r) {
l = (l - r) / l * alpha;
d.x -= x *= l;
d.y -= y *= l;
quad.point.x += x;
quad.point.y += y;
}
}
return x1 > nx2
|| x2 < nx1
|| y1 > ny2
|| y2 < ny1;
});
};
}
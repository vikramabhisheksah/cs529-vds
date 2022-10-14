var data = [];

// bounds of the data
const bounds = {};
var xydata = [];
var svg = d3.select(".slice").append("svg").attr("id", "circle-plane");
var plane,
  group,
  col,
  z = -5.2,
  angle = 0;

const createOnScreenLegends = () => {
  bounds.minC, 0.01, 0.05, 0.1, 0.5, 1, 10, 20, 100, bounds.maxC;
//colored legends
  var colorList = [
    { color: "#ffeda0", val: 0.01 },
    { color: "#fed976", val: 0.05 },
    { color: "#feb24c", val: 0.1 },
    { color: "#fd8d3c", val: 0.5 },
    { color: "#fc4e2a", val: 1 },
    { color: "#e31a1c", val: 10 },
    { color: "#bd0026", val: 20 },
    { color: "#800026", val: 100 },
    { color: "#8B0000", val: bounds.maxC },
  ];
//grayscale legends
  var grayList = [
    { color: "#555555", val: 0.01 },
    { color: "#666666", val: 0.05 },
    { color: "#777777", val: 0.1 },
    { color: "#888888", val: 0.5 },
    { color: "#999999", val: 1 },
    { color: "#aaaaaa", val: 10 },
    { color: "#bbbbbb", val: 20 },
    { color: "#cccccc", val: 100 },
    { color: "#dddddd", val: bounds.maxC },
  ];
//outer svg
  var legends = d3
    .select(".legends")
    .append("svg")
    .attr("width", 105)
    .attr("height", 200);
  var j = 0;
//gray legend
  grayList.forEach((i) => {
    legends
      .append("rect")
      .attr("x", 0)
      .attr("y", j)
      .attr("width", 20)
      .attr("height", 20)
      .attr("stroke", "black")
      .attr("fill", i.color);

    j += 20;
  });
//color legend
  j = 0;
  colorList.forEach((i) => {
    legends
      .append("rect")
      .attr("x", 25)
      .attr("y", j)
      .attr("width", 20)
      .attr("height", 20)
      .attr("stroke", "black")
      .attr("fill", i.color);

    legends
      .append("text")
      .attr("x", 55)
      .attr("y", j + 13)
      .attr("font-size", 12)
      .text("< " + i.val);

    j += 20;
  });
//add info
  d3.select(".info")
    .append("p")
    .text(
      "Press Left/Right arrow keys to rotate the sphere and Up/Down to move the 2D Plane"
    )
    .attr("padding", 5);
};

//rotate function
function rotateObject(object, degreeX = 0, degreeY = 0, degreeZ = 0) {
  object.rotateX(THREE.Math.degToRad(degreeX));
  object.rotateY(THREE.Math.degToRad(degreeY));
  object.rotateZ(THREE.Math.degToRad(degreeZ));
}

//mapping keypresses
document.onkeydown = function (e) {
  e = e || window.event;

  if (e.key == "ArrowUp") {
    z += 0.05;
    svg.selectAll("*").remove();
    update2DPlane();
    xydata = [];
    createSlice();
  } else if (e.key == "ArrowDown") {
    z -= 0.05;
    svg.selectAll("*").remove();
    update2DPlane();
    xydata = [];
    createSlice();
  } else if (e.key == "ArrowRight") {
    rotateObject(group, 0, +1, 0);
    var point = document.getElementById("circle-plane");
    angle -= 1;
    point.style.transform = "rotate(" + angle + "deg)";
  } else if (e.key == "ArrowLeft") {
    rotateObject(group, 0, -1, 0);
    var point = document.getElementById("circle-plane");
    angle += 1;
    point.style.transform = "rotate(" + angle + "deg)";
  }
};

//create 2d svg of slice
const createSlice = () => {
  var i = 0;

  data.forEach((d) => {
    //sampling data
    if (i % 5 !== 0) {
      i++;
      return;
    }
    i++;

    //include only data in xy plane
    if (d.Z - 5 >= z && d.Z - 5 <= z + 0.1)
      xydata.push({
        X: d.X,
        Y: d.Y,
        C: d.concentration,
      });
  });

  const width = 300,
    height = 300;

  const x_scale = d3.scaleLinear().range([0, width]);
  const y_scale = d3.scaleLinear().range([0, height]);

  x_scale.domain([d3.min(xydata, (d) => d.X), d3.max(xydata, (d) => d.X)]);
  y_scale.domain([d3.min(xydata, (d) => d.Y), d3.max(xydata, (d) => d.Y)]);

  svg.attr("width", width + 50).attr("height", height + 50);

  //create inner circle
  svg
    .selectAll("circle")
    .data(xydata)
    .join("circle")
    .attr("class", "point")
    .attr("cx", (d) => x_scale(d.X) + 25)
    .attr("cy", (d) => y_scale(d.Y) + 25)
    .attr("r", 4)
    .attr("fill", (d) => col(d.C))
    .attr("stroke", "black")
    .attr("position", "absolute");

  //create outer circle
  svg
    .append("circle")
    .style("stroke", "black")
    .attr("r", 175)
    .attr("cx", 175)
    .attr("cy", 175)
    .style("fill", "none")
    .attr("class", "outer-circle");
};

col = d3
  .scaleThreshold()
  .domain([bounds.minC, 0.01, 0.05, 0.1, 0.5, 1, 10, 20, 100, bounds.maxC])
  .range([
    "#ffffcc",
    "#ffffcc",
    "#ffeda0",
    "#fed976",
    "#feb24c",
    "#fd8d3c",
    "#fc4e2a",
    "#e31a1c",
    "#bd0026",
    "#800026",
    "#8B0000",
    "#800020",
    "#800020",
  ]);

const grayscale = d3
  .scaleThreshold()
  .domain([bounds.minC, 0.01, 0.05, 0.1, 0.5, 1, 10, 20, 100, bounds.maxC])
  .range([
    "#444444",
    "#555555",
    "#666666",
    "#777777",
    "#888888",
    "#999999",
    "#aaaaaa",
    "#bbbbbb",
    "#cccccc",
    "#dddddd",
    "eeeeee",
  ]);

// creates the particle system
const createParticleSystem = (data) => {
  var i = 0;
  //creating a group
  group = new THREE.Group();

  data.forEach((d) => {
    //sampling data
    if (i % 5 !== 0) {
      i++;
      return;
    }
    i++;

    var colors_hex;
    colors_hex = new THREE.Color(col(d.concentration));
    const vertices = [];
    vertices.push(d.X, d.Z - 5, d.Y);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    const material = new THREE.PointsMaterial({
      color: colors_hex,
      size: 1,
      sizeAttenuation: false,
    });
    var point = new THREE.Points(geometry, material);
    point.concentration = d.concentration;

    //adding pts to the group
    group.add(point);
  });

  //adding group to the scene
  scene.add(group);
};

//update 2d plane whenever up or down arrows are pressed
const update2DPlane = () => {
  var colors_hex;

  plane.position.set(0, z, 0);
  //if z is within the bounds make the points grey
  if (z >= bounds.minZ - 5 && z <= bounds.maxZ - 5) {
    group.children.forEach((p) => {
      colors_hex = grayscale(p.concentration);
      p.material.color = new THREE.Color(colors_hex);
    });
  } //if z is outside the bounds make the points colorful
  else {
    group.children.forEach((p) => {
      colors_hex = col(p.concentration);
      p.material.color = new THREE.Color(colors_hex);
    });
  }
  //color only points on the 2d plane
  group.children.forEach((p) => {
    p_z = p.geometry.attributes.position.array[1]
    if (p_z<=z && p_z >= z - 0.1) {
      colors_hex = col(p.concentration);
      p.material.color = new THREE.Color(colors_hex);
    }
  });
};

//create the 2d sqauare plane
const create2DPlane = (z) => {
  const geometry = new THREE.PlaneGeometry(10, 10);
  const material = new THREE.MeshBasicMaterial({
    color: "rgb(106,47,122)",
    side: THREE.DoubleSide,
    opacity: 0.5,
    transparent: true,
  });

  plane = new THREE.Mesh(geometry, material);
  plane.position.set(0, z, 0);
  rotateObject(plane, 90, 0, 0);
  scene.add(plane);
};

//load all the data
const loadData = (file) => {
  // read the csv file
  d3.csv(file).then(function (
    fileData // iterate over the rows of the csv file
  ) {
    fileData.forEach((d) => {
      // get the min bounds
      bounds.minX = Math.min(bounds.minX || Infinity, d.Points0);
      bounds.minY = Math.min(bounds.minY || Infinity, d.Points1);
      bounds.minZ = Math.min(bounds.minZ || Infinity, d.Points2);
      bounds.minC = Math.min(bounds.minC || Infinity, d.concentration);

      // get the max bounds
      bounds.maxX = Math.max(bounds.maxX || -Infinity, d.Points0);
      bounds.maxY = Math.max(bounds.maxY || -Infinity, d.Points1);
      bounds.maxZ = Math.max(bounds.maxY || -Infinity, d.Points2);
      bounds.maxC = Math.max(bounds.maxC || -Infinity, d.concentration);

      // add the element to the data collection
      data.push({
        // concentration density
        concentration: Number(d.concentration),
        // Position
        X: Number(d.Points0),
        Y: Number(d.Points1),
        Z: Number(d.Points2),
        // Velocity
        U: Number(d.velocity0),
        V: Number(d.velocity1),
        W: Number(d.velocity2),
      });
    });
    console.log(bounds);
    createParticleSystem(data);

    create2DPlane(z);
    createSlice();
    createOnScreenLegends();
  });
};

loadData("data/058.csv");

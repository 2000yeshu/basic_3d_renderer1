var Vertex = function (x, y, z) {
  this.x = parseFloat(x);
  this.y = parseFloat(y);
  this.z = parseFloat(z);
};

var Vertex2D = function (x, y) {
  this.x = parseFloat(x);
  this.y = parseFloat(y);
};

var Cube = function (center, size) {
  var d = size / 2;

  this.vertices = [
    new Vertex(center.x - d, center.y - d, center.z + d),
    new Vertex(center.x - d, center.y - d, center.z - d),
    new Vertex(center.x + d, center.y - d, center.z - d),
    new Vertex(center.x + d, center.y - d, center.z + d),
    new Vertex(center.x + d, center.y + d, center.z + d),
    new Vertex(center.x + d, center.y + d, center.z - d),
    new Vertex(center.x - d, center.y + d, center.z - d),
    new Vertex(center.x - d, center.y + d, center.z + d)
  ];

  this.faces = [
    [this.vertices[0], this.vertices[1], this.vertices[2], this.vertices[3]],
    [this.vertices[3], this.vertices[2], this.vertices[5], this.vertices[4]],
    [this.vertices[4], this.vertices[5], this.vertices[6], this.vertices[7]],
    [this.vertices[7], this.vertices[6], this.vertices[1], this.vertices[0]],
    [this.vertices[7], this.vertices[0], this.vertices[3], this.vertices[4]],
    [this.vertices[1], this.vertices[6], this.vertices[5], this.vertices[2]]
  ];
};

function project(M) {
  return new Vertex2D(M.x, M.z);
}

function render(objects, ctx, dx, dy) {
  var canvas = document.getElementById("viewer");
  let context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  // For each object
  for (var i = 0; i < objects.length; ++i) {
    // For each face
    for (var j = 0; j < objects[i].faces.length; ++j) {
      // Current face
      var face = objects[i].faces[j];

      // Draw the first vertex
      var P = project(face[0]);
      ctx.beginPath();
      ctx.moveTo(P.x + dx, -P.y + dy);

      // Draw the other vertices
      for (var k = 1; k < objects[i].faces[j].length; ++k) {
        P = project(face[k]);
        ctx.lineTo(P.x + dx, -P.y + dy);
      }

      // Close the path and draw the face
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }
  }
}

(function () {
  var canvas = document.getElementById("viewer");

  canvas.height = canvas.offsetHeight;
  canvas.width = canvas.offsetWidth;
  var dx = canvas.width / 2;
  var dy = canvas.height / 2;
  let ctx = canvas.getContext("2d");
  ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
  ctx.fillStyle = "rgba(0, 150, 255, 0.3)";
  var cube_center = new Vertex(10, 0, 0);
  var cube = new Cube(cube_center, 2 * dy);
  var objects = [cube];

  render(objects, ctx, dx, dy);
  setInterval(() => {
    for (var i = 0; i < 8; ++i)
      rotate(cube.vertices[i], cube_center, Math.PI / 800, Math.PI / 800);
    render(objects, ctx, dx, dy);
  }, 50);

  var mousedown = false;
  var mx = 0;
  var my = 0;

  canvas.addEventListener("mousedown", initMove);
  document.addEventListener("keyup", shiftOrZoom);
  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", stopMove);

  // Rotate a vertice
  function rotate(M, center, theta, phi) {
    // Rotation matrix coefficients
    var ct = Math.cos(theta);
    var st = Math.sin(theta);
    var cp = Math.cos(phi);
    var sp = Math.sin(phi);

    // Rotation
    var x = M.x - center.x;
    var y = M.y - center.y;
    var z = M.z - center.z;

    M.x = ct * x - st * cp * y + st * sp * z + center.x;
    M.y = st * x + ct * cp * y - ct * sp * z + center.y;
    M.z = sp * y + cp * z + center.z;
  }
  // Initialize the movement
  function initMove(evt) {
    //clearTimeout(autorotate_timeout);
    mousedown = true;
    //mouse click coordinates
    mx = evt.clientX;
    my = evt.clientY;
  }

  function move(evt) {
    if (mousedown) {
      var theta = ((evt.clientX - mx) * Math.PI) / 500;
      var phi = ((evt.clientY - my) * Math.PI) / 500;

      for (var i = 0; i < 8; ++i)
        rotate(cube.vertices[i], cube_center, theta, phi);

      mx = evt.clientX;
      my = evt.clientY;

      render(objects, ctx, dx, dy);
    }
  }

  function shiftOrZoom(e) {
    //console.log("zoom", e.keyCode);
    if (e.keyCode === 38) {
      for (let i = 0; i < 8; i++) {
        //cube.vertices[i] = new Vertex(
        cube.vertices[i].x = cube.vertices[i].x * 1.2;
        cube.vertices[i].y = cube.vertices[i].y * 1.2;
        cube.vertices[i].z = cube.vertices[i].z * 1.2;
        //);
      }

      render(objects, ctx, dx, dy);
    }
    //zoomin
    else if (e.keyCode === 40) {
      for (let i = 0; i < 8; i++) {
        //cube.vertices[i] = new Vertex(
        cube.vertices[i].x = cube.vertices[i].x / 1.2;
        cube.vertices[i].y = cube.vertices[i].y / 1.2;
        cube.vertices[i].z = cube.vertices[i].z / 1.2;
        //);
      }

      render(objects, ctx, dx, dy);
    }
    //zoom out
    else if (e.keyCode === 39) {
      for (let i = 0; i < 8; i++) {
        //cube.vertices[i] = new Vertex(
        cube.vertices[i].x = cube.vertices[i].x + 10;
        //cube.vertices[i].y = cube.vertices[i].y / 1;
        //cube.vertices[i].z = cube.vertices[i].z / 1;
        //);
      }

      render(objects, ctx, dx, dy);
    }
    //shift right
    else if (e.keyCode === 37) {
      for (let i = 0; i < 8; i++) {
        //cube.vertices[i] = new Vertex(
        cube.vertices[i].x = cube.vertices[i].x - 10;
        //cube.vertices[i].y = cube.vertices[i].y / 1;
        //cube.vertices[i].z = cube.vertices[i].z / 1;
        //);
      }

      render(objects, ctx, dx, dy);
    }
    //shift left
  }

  function stopMove() {
    mousedown = false;
  }
})();

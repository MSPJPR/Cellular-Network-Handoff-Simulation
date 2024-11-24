const canvas = document.getElementById("networkCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

let cells = [];
let users = [];
let simulationRunning = false;
let speed = 2;

// Initialize Cells
function initCells() {
  cells = [
    { x: 150, y: 200, radius: 100, color: "#ffcccb", label: "Cell 1" },
    { x: 400, y: 200, radius: 100, color: "#ccffcb", label: "Cell 2" },
    { x: 650, y: 200, radius: 100, color: "#cbccff", label: "Cell 3" },
  ];
}

// Draw Cells
function drawCells() {
  cells.forEach(cell => {
    ctx.beginPath();
    ctx.arc(cell.x, cell.y, cell.radius, 0, 2 * Math.PI);
    ctx.fillStyle = cell.color;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#000";
    ctx.fillText(cell.label, cell.x - 20, cell.y + 5);
  });
}

// Initialize Users
function initUsers() {
  users = [
    { x: 50, y: 200, dx: speed, dy: 0, color: "#0000ff", connectedTo: null },
  ];
}

// Draw Users
function drawUsers() {
  users.forEach(user => {
    ctx.beginPath();
    ctx.arc(user.x, user.y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = user.color;
    ctx.fill();
  });
}

// Update User Position
function updateUsers() {
  users.forEach(user => {
    user.x += user.dx;

    cells.forEach(cell => {
      const distance = Math.hypot(user.x - cell.x, user.y - cell.y);
      if (distance < cell.radius && user.connectedTo !== cell.label) {
        user.connectedTo = cell.label;
        user.color = cell.color;
        logHandoff(user, cell);
      }
    });
  });
}

// Log Handoff Event
function logHandoff(user, cell) {
  const logBody = document.getElementById("logBody");
  const row = document.createElement("tr");

  const timestamp = new Date().toLocaleTimeString();
  const position = `(${Math.round(user.x)}, ${Math.round(user.y)})`;

  row.innerHTML = `
    <td>${timestamp}</td>
    <td>${position}</td>
    <td>${cell.label}</td>
  `;
  logBody.appendChild(row);
}

// Animation Loop
function animate() {
  if (!simulationRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCells();
  updateUsers();
  drawUsers();
  requestAnimationFrame(animate);
}

// Start Simulation
document.getElementById("startSimulation").addEventListener("click", () => {
  simulationRunning = true;
  initCells();
  initUsers();
  animate();
});

// Reset Simulation
document.getElementById("resetSimulation").addEventListener("click", () => {
  simulationRunning = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById("logBody").innerHTML = "";
});

// Add Cell
document.getElementById("addCell").addEventListener("click", () => {
  const newCell = {
    x: Math.random() * 700 + 50,
    y: Math.random() * 300 + 50,
    radius: 100,
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    label: `Cell ${cells.length + 1}`,
  };
  cells.push(newCell);
});

// Remove Cell
document.getElementById("removeCell").addEventListener("click", () => {
  cells.pop();
});

// Adjust Speed
document.getElementById("speedControl").addEventListener("input", (e) => {
  speed = Number(e.target.value);
  users.forEach(user => user.dx = speed);
});

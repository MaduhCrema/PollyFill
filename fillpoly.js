const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");
const selectPolygonElement = document.getElementById("selectTriangle");

const vertices = [];
const polygons = [];
var selectedPolygonIndex = 0;

//estrutura vertice
function Vertex(x, y, color) {
  console.log(x, y, color);
  this.x = x;
  this.y = y;
  this.color = color;
}

//estrutura poligono
function Polygon(vertexs, edgeColor) {
  this.vertices = vertexs;
  this.edgeColor = edgeColor;
}

// função add vertice
function addVertex(x, y, color) {
  const vertex = new Vertex(x, y, color);
  vertices.push(vertex);
}

//função add um polígono na lista
function addPolygon() {
  const edgecolorInput = document.getElementById("edgeColor");
  const edgecolor = hexToRgb(edgecolorInput.value);

  // Copia a lista de vértices antes de limpar
  const verticesCopy = [...vertices];

  const polygon = new Polygon(verticesCopy, edgecolor);
  polygons.push(polygon);

  createPolygonList();
  // Limpa a lista de vértices para o próximo polígono
  vertices.length = 0;
  updateCanvas();
}

//pega as coordenadas por click
function handleCanvasClick(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  addVertex(x, y, [0, 0, 0]);
  updateCanvas();
}

function updateCanvas() {
  getcolor();
  polygons.forEach((polygon) => {
    const vertice = polygon.vertices;
    rasterizePolygon(context, vertice);
    drawEdges(polygon, polygon.edgeColor);
  });
}

function update() {
  getcolor();
  polygons.forEach((Polygon) => {
    const vertice = Polygon.vertices;
    rasterizePolygon(context, vertice);
    drawEdges(Polygon, Polygon.edgeColor);
  });
}

function cleanAll() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  selectPolygonElement.innerHTML = "";
  polygons.length = 0;
  console.log("POLYGON all");
  console.log(polygons);
}

function cleanOne() {
  if (polygons.length > 1) {
    if (selectedPolygonIndex >= 0 && selectedPolygonIndex < Polygon.length) {
      polygons.splice(selectedPolygonIndex, 1);
      selectPolygonElement.remove(selectedPolygonIndex);
      context.clearRect(0, 0, canvas.width, canvas.height);
      update();
    }
  } else if (polygons.length == 1) {
    cleanAll();
    updateCanvas();
  }
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function getcolor() {
  const color0Input = document.getElementById("color0");
  vertices.color = hexToRgb(color0Input.value);
}

function selectPolygon() {
  selectedPolygonIndex = selectPolygonElement.selectedIndex;
}

function createPolygonList() {
  const polygonIndex = polygons.length - 1; // Índice correto do último polígono
  const option = document.createElement("option");
  option.value = polygonIndex;
  option.text = `Polígono ${polygonIndex + 1}`;
  selectPolygonElement.add(option);
}

function drawLine(x1, y1, x2, y2, color, thickness) {
  //console.log(thickness);
  let dx = Math.abs(x2 - x1); //Diferença absoluta
  let dy = Math.abs(y2 - y1);
  //incrementa ou decrementa na direção
  let dirx = x1 < x2 ? 1 : -1;
  let diry = y1 < y2 ? 1 : -1;
  let err_hv = dx - dy; // proximo ponto horizontal ou vertical

  while (true) {
    for (
      let i = -Math.floor(thickness / 2);
      i <= Math.floor(thickness / 2);
      i++
    ) {
      for (
        let j = -Math.floor(thickness / 2);
        j <= Math.floor(thickness / 2);
        j++
      ) {
        drawPixel(x1 + i, y1 + j, color); //depende da espessura
      }
    }

    if (x1 === x2 && y1 === y2) break;
    let e2 = 2 * err_hv; //decide onde
    if (e2 > -dy) {
      err_hv -= dy;
      x1 += dirx; //horizontal
    }
    if (e2 < dx) {
      err_hv += dx;
      y1 += diry; //vertical
    }
  }
}
function changecolor() {
  const colorInput = document.getElementById("color0");
  const edgeColorInput = document.getElementById("edgeColor");

  // nova cor dos vertices
  const newVertexColor = hexToRgb(colorInput.value);

  //polígono selecionado
  const selectedPolygon = polygons[selectedPolygonIndex];

  // Altera a cor
  selectedPolygon.vertices.forEach((vertex) => {
    vertex.color = newVertexColor;
  });

  // Altera a cor das bordas
  selectedPolygon.edgeColor = hexToRgb(edgeColorInput.value);

  context.clearRect(0, 0, canvas.width, canvas.height);

  polygons.forEach((polygon) => {
    const vertices = polygon.vertices;
    rasterizePolygon(context, vertices);
    drawEdges(polygon, polygon.edgeColor);
  });
}

function drawPixel(x, y, color) {
  context.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  context.fillRect(x, y, 1, 1);
}

function drawEdges(polygon, color) {
  const vertices = polygon.vertices;
  const thickness = polygon.edgethickness;

  for (let i = 0; i < vertices.length; i++) {
    const v1 = vertices[i];
    const v2 = vertices[(i + 1) % vertices.length];
    drawLine(v1.x, v1.y, v2.x, v2.y, color, 2);
  }
}

function rasterizePolygon(context, vertices) {
  const minY = Math.min(...vertices.map((v) => v.y));
  const maxY = Math.max(...vertices.map((v) => v.y));
  const intersections = {};

  vertices.forEach((v_start, i) => {
    let v_end = vertices[(i + 1) % vertices.length]; //cirular
    if (v_start.y === v_end.y) return;

    if (v_start.y > v_end.y) [v_start, v_end] = [v_end, v_start];

    const dy = v_end.y - v_start.y;
    const dx = v_end.x - v_start.x;
    const taxa_inversa = dx / dy; //TAXA DE VARIAÇÃO QUE PERCORRE DE UM EM UM EM Y
    let x = v_start.x;

    let r = v_start.color[0],
      g = v_start.color[1],
      b = v_start.color[2];

    //taxa das cores
    const dr = (v_end.color[0] - v_start.color[0]) / dy;
    const dg = (v_end.color[1] - v_start.color[1]) / dy;
    const db = (v_end.color[2] - v_start.color[2]) / dy;

    for (let y = Math.round(v_start.y); y < Math.round(v_end.y); y++) {
      if (!intersections[y]) {
        intersections[y] = [];
      }
      intersections[y].push({ x, color: [r, g, b] });
      //incrementa x e as cores
      x += taxa_inversa;
      r += dr;
      g += dg;
      b += db;
    }
  });

  for (let y = Math.round(minY); y <= Math.round(maxY); y++) {
    if (!intersections[y]) continue; //caso nao tenha intersecções

    intersections[y].sort((a, b) => a.x - b.x);

    for (let i = 0; i < intersections[y].length - 1; i += 2) {
      const { x: xStart, color: colorStart } = intersections[y][i];
      const { x: xEnd, color: colorEnd } = intersections[y][i + 1];

      const pixels = xEnd - xStart;
      const dr = (colorEnd[0] - colorStart[0]) / pixels;
      const dg = (colorEnd[1] - colorStart[1]) / pixels;
      const db = (colorEnd[2] - colorStart[2]) / pixels;
      let r = colorStart[0],
        g = colorStart[1],
        b = colorStart[2];

      //pinta cada intersecção
      for (let x = Math.ceil(xStart); x <= Math.floor(xEnd); x++) {
        drawPixel(x, y, [Math.round(r), Math.round(g), Math.round(b)]);
        r += dr;
        g += dg;
        b += db;
      }
    }
  }
}

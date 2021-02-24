import {
  Application,
  Graphics,
  InteractionEvent,
  Point,
  Polygon,
  Text,
  Container,
} from "pixi.js";
import { Bezier } from "bezier-js";

import "./styles.css";

const app = new Application({
  antialias: true,
});

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoDensity = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

const edgesContainer = new Container();
const nodesContainer = new Container();

app.stage.addChild(edgesContainer);
app.stage.addChild(nodesContainer);

document.body.appendChild(app.view);

const taskMouseoverHandler = (e: InteractionEvent) => {
  const rect = e.currentTarget as Graphics;
  rect.clear();
  rect.beginFill(0x66ccff);
  rect.lineStyle(4, 0xff3300, 1);
  rect.drawRect(0, 0, 100, 50);
  rect.endFill();
};

const taskMouseoutHandler = (e: InteractionEvent) => {
  const rect = e.currentTarget as Graphics;
  rect.clear();
  rect.beginFill(0x66ccff);
  rect.drawRect(0, 0, 100, 50);
  rect.endFill();
};

const rectangleGraphic1 = new Graphics();
rectangleGraphic1.beginFill(0x66ccff);
rectangleGraphic1.drawRect(0, 0, 100, 50);
rectangleGraphic1.endFill();
rectangleGraphic1.interactive = true;
rectangleGraphic1.buttonMode = true;
rectangleGraphic1.position.set(0, 200);
rectangleGraphic1.addListener("mouseover", taskMouseoverHandler);
rectangleGraphic1.addListener("mouseout", taskMouseoutHandler);
nodesContainer.addChild(rectangleGraphic1);

const rectangleGraphic2 = new Graphics();
rectangleGraphic2.beginFill(0x66ccff);
rectangleGraphic2.drawRect(0, 0, 100, 50);
rectangleGraphic2.endFill();
rectangleGraphic2.interactive = true;
rectangleGraphic2.buttonMode = true;
rectangleGraphic2.position.set(400, 300);
rectangleGraphic2.addListener("mouseover", taskMouseoverHandler);
rectangleGraphic2.addListener("mouseout", taskMouseoutHandler);
nodesContainer.addChild(rectangleGraphic2);

const textMaskGraphic = new Graphics();
textMaskGraphic.beginFill(0x229922, 0.4);
textMaskGraphic.drawRect(0, 0, 100, 50);
textMaskGraphic.position.set(0, 200);
nodesContainer.addChild(textMaskGraphic);

const task1TitleText = new Text("Text1");
task1TitleText.position.set(0, 200);
task1TitleText.mask = textMaskGraphic;
nodesContainer.addChild(task1TitleText);

const task2TitleText = new Text("Text2");
task2TitleText.position.set(400, 300);
nodesContainer.addChild(task2TitleText);

const rect1ConnectionPoint = {
  x: 100,
  y: 225,
};

const rect2ConnectionPoint = {
  x: 400,
  y: 325,
};

const edgeGraphic = new Graphics();
edgeGraphic.lineStyle(4, 0xffffff, 1);
edgeGraphic.moveTo(rect1ConnectionPoint.x, rect1ConnectionPoint.y);
edgeGraphic.bezierCurveTo(
  (rect2ConnectionPoint.x - rect1ConnectionPoint.x) * 0.2 +
    rect1ConnectionPoint.x,
  rect1ConnectionPoint.y,
  (rect2ConnectionPoint.x - rect1ConnectionPoint.x) * 0.8 +
    rect1ConnectionPoint.x,
  rect2ConnectionPoint.y,
  rect2ConnectionPoint.x,
  rect2ConnectionPoint.y
);
edgeGraphic.interactive = true;
edgeGraphic.buttonMode = true;
edgeGraphic.addListener("mouseover", () => {
  console.log("Over graphic");
});
edgesContainer.addChild(edgeGraphic);

console.log(edgeGraphic);

const polygonGraphic = new Graphics();
polygonGraphic.beginFill(0x55aa66);
polygonGraphic.drawPolygon([-32, 64, 32, 64, 0, 0]);
polygonGraphic.endFill();
// polygonGraphic.position.set(180, 22);
edgesContainer.addChild(polygonGraphic);
edgeGraphic.hitArea = new Polygon([-32, 64, 32, 64, 0, 0]);

//
// Bezier with line
//

const line = new Graphics();
line.lineStyle(4, 0xffffff, 1);
// line.moveTo(0, 0);
const bLine = new Bezier(100, 25, 10, 90, 110, 100, 150, 195);
const points = bLine.getLUT();
line.moveTo(points[0].x, points[0].y);
points.forEach((point) => {
  line.lineTo(point.x, point.y);
});
line.x = 0;
line.y = 100;
edgesContainer.addChild(line);

console.log(bLine.outline(5));

bLine.outline(5).curves.forEach((curve) => {
  const outlineGraphic = new Graphics();
  outlineGraphic.lineStyle(2, 0xff4444, 1);
  outlineGraphic.moveTo(0, 0);
  const points = curve.getLUT();
  outlineGraphic.moveTo(points[0].x, points[0].y);
  points.forEach((point) => {
    outlineGraphic.lineTo(point.x, point.y);
  });
  outlineGraphic.position.set(32, 32);
  edgesContainer.addChild(outlineGraphic);
});

// bLine
//   .outline(5)
//   .curves.map((curve) => curve.getLUT())
//   .flat();

const edgeMouseoverHandler = (e: InteractionEvent) => {
  const edge = e.currentTarget as Graphics;
  edge.clear();
  edge.lineStyle(4, 0x33aa44, 1);
  // line.moveTo(0, 0);
  const bLine = new Bezier(100, 25, 10, 90, 110, 100, 150, 195);
  const points = bLine.getLUT();
  edge.moveTo(points[0].x, points[0].y);
  points.forEach((point) => {
    edge.lineTo(point.x, point.y);
  });
};

const edgeMouseoutHandler = (e: InteractionEvent) => {
  const edge = e.currentTarget as Graphics;
  edge.clear();
  edge.lineStyle(4, 0xffffff, 1);
  const bLine = new Bezier(100, 25, 10, 90, 110, 100, 150, 195);
  const points = bLine.getLUT();
  edge.moveTo(points[0].x, points[0].y);
  points.forEach((point) => {
    edge.lineTo(point.x, point.y);
  });
};

line.interactive = true;
line.buttonMode = true;
line.hitArea = new Polygon(
  bLine
    .outline(5)
    .curves.map((curve) => curve.getLUT())
    .flat()
    .map((point) => new Point(point.x, point.y))
);
line.addListener("mouseover", edgeMouseoverHandler);
line.addListener("mouseout", edgeMouseoutHandler);
line.addListener("mousedown", (e) => {
  console.log(e);
  console.log(e.currentTarget);
});

//
// Circle connectors
//

const circleAtRect1ConnectionPointGraphic = new Graphics();
circleAtRect1ConnectionPointGraphic.beginFill(0x9966ff);
circleAtRect1ConnectionPointGraphic.drawCircle(
  rect1ConnectionPoint.x,
  rect1ConnectionPoint.y,
  4
);
circleAtRect1ConnectionPointGraphic.endFill();
nodesContainer.addChild(circleAtRect1ConnectionPointGraphic);

const circleAtRect2ConnectionPointGraphic = new Graphics();
circleAtRect2ConnectionPointGraphic.beginFill(0x9966ff);
circleAtRect2ConnectionPointGraphic.drawCircle(
  rect2ConnectionPoint.x,
  rect2ConnectionPoint.y,
  4
);
circleAtRect2ConnectionPointGraphic.endFill();
nodesContainer.addChild(circleAtRect2ConnectionPointGraphic);

const zoom = (s: number, x: number, y: number) => {
  s = s > 0 ? 0.95 : 1.05;
  const worldPos = {
    x: (x - app.stage.x) / app.stage.scale.x,
    y: (y - app.stage.y) / app.stage.scale.y,
  };
  const newScale = { x: app.stage.scale.x * s, y: app.stage.scale.y * s };

  const newScreenPos = {
    x: worldPos.x * newScale.x + app.stage.x,
    y: worldPos.y * newScale.y + app.stage.y,
  };

  app.stage.x -= newScreenPos.x - x;
  app.stage.y -= newScreenPos.y - y;
  app.stage.scale.x = newScale.x;
  app.stage.scale.y = newScale.y;
};

let lastPos: { x: number; y: number } | null = null;
window.addEventListener("wheel", (e) => {
  zoom(e.deltaY, e.offsetX, e.offsetY);
});
window.addEventListener("mousedown", (e) => {
  lastPos = { x: e.offsetX, y: e.offsetY };
});
window.addEventListener("mouseup", () => {
  lastPos = null;
});
window.addEventListener("mousemove", (e) => {
  if (lastPos) {
    app.stage.x += e.offsetX - lastPos.x;
    app.stage.y += e.offsetY - lastPos.y;
    lastPos = { x: e.offsetX, y: e.offsetY };
  }
});

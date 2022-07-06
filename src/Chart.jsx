import * as d3 from "d3";
import { useState } from "react";

export function ChartTest() {
  const [data, setData] = useState(null);

  if (data === null) {
    setData([
      {
        name: "Medusa",
        items: [
          {
            name: "Diff",
            winDiff: 0.8,
            useRate: 0.9,
          },
          {
            name: "BKB",
            winDiff: -0.1,
            useRate: 0.7,
          },
        ],
      },
      {
        name: "Ursa",
        items: [
          {
            name: "Diff",
            winDiff: 0.3,
            useRate: 0.1,
          },
          {
            name: "BKB",
            winDiff: -0.3,
            useRate: 0.7,
          },
        ],
      },
    ]);
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Chart width={800} height={800} data={data} />
    </div>
  );
}

export default function Chart(props) {
  const padding = { x: 100, y: 200 };
  const itemSize = 25,
    textPadding = 5;
  const scale = {
    x: d3
      .scaleLinear()
      .domain([0, 1])
      .range([padding.x, padding.x + itemSize * 1])
      .nice(),
    y: d3
      .scaleLinear()
      .domain([0, 1])
      .range([padding.y, padding.y + itemSize * 1])
      .nice(),
    color: d3
      .scaleLinear()
      .domain([-1, 0, 1])
      .range(["blue", "white", "red"])
      .nice(),
  };
  return (
    <svg viewBox={`0 0 ${props.width} ${props.height}`}>
      <BackGround width={props.width} height={props.height} />
      <XAxis
        data={props.data}
        scale={scale}
        padding={padding}
        textPadding={textPadding}
        itemSize={itemSize}
      />
      <YAxis
        data={props.data}
        scale={scale}
        padding={padding}
        textPadding={textPadding}
        itemSize={itemSize}
      />
      <Content data={props.data} scale={scale} itemSize={itemSize} />
      <Legend />
    </svg>
  );
}

function BackGround(props) {
  return (
    <g>
      <rect
        x={0}
        y={0}
        width={props.width}
        height={props.height}
        fill="#dddddd"
      />
    </g>
  );
}

function XAxis(props) {
  return (
    <g>
      {props.data[0].items.map((item, index) => {
        const x = props.scale.x(index + 0.5),
          y = props.padding.y;
        return (
          <text
            key={item.name}
            x={x + props.textPadding}
            y={y + 2}
            textAnchor="start"
            dominantBaseline="middle"
            transform={`rotate(-90, ${x}, ${y})`}
          >
            {item.name}
          </text>
        );
      })}
    </g>
  );
}

function YAxis(props) {
  return (
    <g>
      {props.data.map((item, index) => {
        const x = props.padding.x,
          y = props.scale.y(index + 0.5);
        return (
          <text
            key={item.name}
            x={x - props.textPadding}
            y={y + 2}
            textAnchor="end"
            dominantBaseline="middle"
          >
            {item.name}
          </text>
        );
      })}
    </g>
  );
}

function Content(props) {
  return (
    <g>
      {props.data.map((hero, heroIndex) => {
        return (
          <g key={heroIndex}>
            {hero.items.map((item, itemIndex) => {
              return (
                <rect
                  key={itemIndex}
                  x={props.scale.x(itemIndex)}
                  y={props.scale.y(heroIndex)}
                  width={props.itemSize}
                  height={props.itemSize}
                  fill={props.scale.color(item.winDiff)}
                >
                  <title>
                    {hero.name} * {item.name} ({item.winDiff})
                  </title>
                </rect>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

function Legend(props) {
  const x = 50,
    y = 50,
    w = 200,
    h = 50;
  return (
    <g>
      <defs>
        <linearGradient id="legend" x1={0} x2={1} y1={0} y2={0}>
          <stop offset={0} stop-color="blue" />
          <stop offset={0.5} stop-color="white" />
          <stop offset={1} stop-color="red" />
        </linearGradient>
      </defs>
      <text x={x} y={y - 5} fill="black" textAnchor="middle">
        -1
      </text>
      <text x={x + w / 2} y={y - 5} fill="black" textAnchor="middle">
        0
      </text>
      <text x={x + w} y={y - 5} fill="black" textAnchor="middle">
        1
      </text>
      <rect x={x} y={y} width={w} height={h} fill="url(#legend)" />
    </g>
  );
}

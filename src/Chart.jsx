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
  const xPadding = 100,
    yPadding = 100,
    itemSize = 25,
    textPadding = 5;
  const xScale = d3
    .scaleLinear()
    .domain([0, 1])
    .range([xPadding, xPadding + itemSize * 1])
    .nice();
  const yScale = d3
    .scaleLinear()
    .domain([0, 1])
    .range([yPadding, yPadding + itemSize * 1])
    .nice();
  const colorScale = d3
    .scaleLinear()
    .domain([-1, 0, 1])
    .range(["blue", "white", "red"])
    .nice();
  return (
    <svg viewBox={`0 0 ${props.width} ${props.height}`}>
      <BackGround width={props.width} height={props.height} />
      <XAxis
        xPadding={xPadding}
        yPadding={yPadding}
        textPadding={textPadding}
        itemSize={itemSize}
        data={props.data}
      />
      <YAxis
        xPadding={xPadding}
        yPadding={yPadding}
        itemSize={itemSize}
        textPadding={textPadding}
        data={props.data}
      />
      <Content
        data={props.data}
        xScale={xScale}
        yScale={yScale}
        colorScale={colorScale}
      />
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
      {props.data.map((item, index) => {
        const x = props.xPadding,
          y = props.itemSize * (index + 1 - 0.5) + props.yPadding;
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

function YAxis(props) {
  return (
    <g>
      {props.data[0].items.map((item, index) => {
        const x = props.itemSize * (index + 1 - 0.5) + props.xPadding,
          y = props.yPadding;
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

function Content(props) {
  console.log(props.data);
  return (
    <g>
      {props.data.map((hero, heroIndex) => {
        return (
          <g key={heroIndex}>
            {hero.items.map((item, itemIndex) => {
              return (
                <rect
                  key={itemIndex}
                  x={props.xScale(itemIndex)}
                  y={props.yScale(heroIndex)}
                  width={25}
                  height={25}
                  fill={props.colorScale(item.winDiff)}
                />
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

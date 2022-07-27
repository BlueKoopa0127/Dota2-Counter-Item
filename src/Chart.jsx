import * as d3 from "d3";
import { useEffect, useState, useRef } from "react";

export function ChartTest() {
  const [data, setData] = useState(null);

  if (data === null) {
    setData([
      {
        id: 0,
        name: "Medusa",
        items: [
          {
            id: 0,
            name: "Diff",
            winRateDiff: 0.8,
            useRate: 0.9,
          },
          {
            id: 1,
            name: "BKB",
            winRateDiff: -0.1,
            useRate: 0.7,
          },
        ],
      },
      {
        id: 1,
        name: "Ursa",
        items: [
          {
            id: 0,
            name: "Diff",
            winRateDiff: 0.3,
            useRate: 0.1,
          },
          {
            id: 1,
            name: "BKB",
            winRateDiff: -0.3,
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

export default function Chart({ width, height, data }) {
  return (
    <ZoomableSVG width={width} height={height}>
      <ChartContent width={width} height={height} data={data} />
    </ZoomableSVG>
  );
}

function ZoomableSVG({ children, width, height }) {
  console.log("ZoomableSVG");
  const svgRef = useRef();
  const [k, setK] = useState(1);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  useEffect(() => {
    const zoom = d3.zoom().on("zoom", (event) => {
      const { x, y, k } = event.transform;
      setK(k);
      setX(x);
      setY(y);
    });
    d3.select(svgRef.current).call(zoom);
  }, []);
  return (
    <svg ref={svgRef} width={width} height={height}>
      <BackGround width={width} height={height} />
      <g transform={`translate(${x},${y})scale(${k})`}>{children}</g>
      <text x="10" y="50">
        fixed content
      </text>
    </svg>
  );
}

function ChartContent({ width, height, data }) {
  console.log("ChartContent");

  const padding = { x: 100, y: 200 };
  const itemSize = 18,
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
    <g transform={`translate(${100},${100})`}>
      <XAxis
        data={data}
        scale={scale}
        padding={padding}
        textPadding={textPadding}
        itemSize={itemSize}
      />
      <YAxis
        data={data}
        scale={scale}
        padding={padding}
        textPadding={textPadding}
        itemSize={itemSize}
      />
      <Content data={data} scale={scale} itemSize={itemSize} />
      <Legend />
    </g>
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
            key={item.id}
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
    <g key={"YAxis"}>
      {props.data.map((hero, index) => {
        const x = props.padding.x,
          y = props.scale.y(index + 0.5);
        return (
          <text
            key={index}
            x={x - props.textPadding}
            y={y + 2}
            textAnchor="end"
            dominantBaseline="middle"
          >
            {hero.name}
          </text>
        );
      })}
    </g>
  );
}

function Content(props) {
  const space = 0.5;
  return (
    <g key={"Content"}>
      {props.data.map((hero, heroIndex) => {
        return (
          <g key={heroIndex}>
            {hero.items.map((item, itemIndex) => {
              return (
                <rect
                  key={itemIndex}
                  x={props.scale.x(itemIndex) + space}
                  y={props.scale.y(heroIndex) + space}
                  width={props.itemSize - space * 2}
                  height={props.itemSize - space * 2}
                  fill={props.scale.color(item.winRateDiff)}
                >
                  <title>
                    {hero.name} * {item.name} ({item.winRateDiff})
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
    h = 50,
    textY = y - 5;
  function LegendText(props) {
    return (
      <text
        x={props.x}
        y={props.y}
        fill="black"
        textAnchor="middle"
        style={{ userSelect: "none" }}
      >
        {props.n}
      </text>
    );
  }
  return (
    <g>
      <defs>
        <linearGradient id="legend" x1={0} x2={1} y1={0} y2={0}>
          <stop offset={0} stopColor="blue" />
          <stop offset={0.5} stopColor="white" />
          <stop offset={1} stopColor="red" />
        </linearGradient>
      </defs>
      <LegendText x={x} y={textY} n={-1} />
      <LegendText x={x + w / 2} y={textY} n={0} />
      <LegendText x={x + w} y={textY} n={1} />
      <rect x={x} y={y} width={w} height={h} fill="url(#legend)" />
    </g>
  );
}

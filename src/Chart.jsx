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

export default function Chart({
  width,
  height,
  data,
  xAxis,
  setXAxis,
  yAxis,
  setYAxis,
  findBox,
}) {
  return (
    <div>
      <ZoomableSVG width={width} height={height}>
        <ChartContent
          data={data}
          xAxis={xAxis}
          setXAxis={setXAxis}
          yAxis={yAxis}
          setYAxis={setYAxis}
          findBox={findBox}
        />
      </ZoomableSVG>
    </div>
  );
}

function ZoomableSVG({ children, width, height }) {
  //console.log("ZoomableSVG");
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
    <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`}>
      <BackGround width={width} height={height} />
      <g transform={`translate(${x},${y})scale(${k})`}>{children}</g>
    </svg>
  );
}

function ChartContent({ data, xAxis, setXAxis, yAxis, setYAxis, findBox }) {
  //console.log("ChartContent");

  const padding = { x: 50, y: 150 };
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
        xAxis={xAxis}
        setYAxis={setYAxis}
        scale={scale}
        padding={padding}
        textPadding={textPadding}
      />
      <YAxis
        data={data}
        yAxis={yAxis}
        setXAxis={setXAxis}
        scale={scale}
        padding={padding}
        textPadding={textPadding}
      />
      <Content
        data={data}
        scale={scale}
        itemSize={itemSize}
        xAxis={xAxis}
        yAxis={yAxis}
        findBox={findBox}
      />
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

function XAxis({ data, xAxis, setYAxis, scale, padding, textPadding }) {
  return (
    <g>
      {xAxis.map((item, index) => {
        const x = scale.x(index + 0.5),
          y = padding.y;
        const col = item.highlight ? "red" : "black";
        return (
          <text
            key={item.name}
            x={x + textPadding}
            y={y + 2}
            textAnchor="start"
            dominantBaseline="middle"
            transform={`rotate(-90, ${x}, ${y})`}
            fill={col}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setYAxis(
                d3.sort(data, (a, b) =>
                  d3.descending(
                    a.items[item.index].value,
                    b.items[item.index].value
                  )
                )
              );
            }}
          >
            {item.name}
          </text>
        );
      })}
    </g>
  );
}

function YAxis({ data, yAxis, setXAxis, scale, padding, textPadding }) {
  return (
    <g key={"YAxis"}>
      {yAxis.map((hero, index) => {
        const x = padding.x,
          y = scale.y(index + 0.5);
        const col = hero.highlight ? "red" : "black";
        return (
          <text
            key={hero.name}
            x={x - textPadding}
            y={y + 2}
            textAnchor="end"
            dominantBaseline="middle"
            fill={col}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setXAxis(
                d3.sort(data[hero.index].items, (a, b) =>
                  d3.descending(a.value, b.value)
                )
              );
            }}
          >
            {hero.name}
          </text>
        );
      })}
    </g>
  );
}

function Content({ data, scale, itemSize, xAxis, yAxis, findBox }) {
  const space = 0.5;
  return (
    <g key={"Content"}>
      {yAxis.map((h, heroIndex) => {
        const hero = data[h.index];
        return (
          <g key={h.index}>
            {xAxis.map((i, itemIndex) => {
              const item = hero.items[i.index];
              const opa =
                findBox === ""
                  ? 1
                  : h.highlight === false && i.highlight === false
                  ? 0.1
                  : 1;
              return (
                <rect
                  key={i.index}
                  x={scale.x(itemIndex) + space}
                  y={scale.y(heroIndex) + space}
                  width={itemSize - space * 2}
                  height={itemSize - space * 2}
                  fill={scale.color(item.value)}
                  opacity={opa}
                >
                  <title>
                    {hero.name} * {item.name} ({item.value})
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

import { useEffect, useState } from "react";
import Chart from "./Chart";
import Form from "./Form";
import { getHeros } from "./Model";
import "bulma/css/bulma.css";

export default function App() {
  const [heros, setHeros] = useState(null);
  const [heroAxis, setHeroAxis] = useState(null);
  const [itemAxis, setItemAxis] = useState(null);
  getHeros(setHeros);

  useEffect(() => {
    if (heros != null && heroAxis === null && itemAxis === null) {
      setHeroAxis(
        Array.from(new Set(heros.map((h) => h.name))).map((e) => {
          return {
            name: e,
            highlight: false,
          };
        })
      );
      setItemAxis(
        Array.from(new Set(heros[0].items.map((i) => i.name))).map((e) => {
          return {
            name: e,
            highlight: false,
          };
        })
      );
    }
  }, [heros]);

  console.log(heros);
  console.log(heroAxis);
  console.log(itemAxis);

  if (heros === null) {
    return <div>Loading...</div>;
  }
  if (heros.err != null) {
    return <div>Error</div>;
  }
  if (heroAxis === null || itemAxis === null) {
    return <div>Loading...</div>;
  }

  function ChangeShowValue(value) {
    setHeros(
      heros.map((h) => {
        return {
          id: h.id,
          name: h.name,
          items: h.items.map((i) => {
            if (value === "勝率差") {
              i.value = i.winRateDiff;
            } else if (value === "使用率") {
              i.value = i.useRate;
            } else if (value === "勝率差 * 使用率") {
              i.value = i.winRateDiff * i.useRate;
            }
            return i;
          }),
        };
      })
    );
  }
  function FindPattern(pattern) {
    const p = pattern.toLowerCase();
    setHeroAxis(
      heroAxis.map((h) => {
        h.highlight = h.name.toLowerCase().indexOf(p) > -1;
        return h;
      })
    );
    setItemAxis(
      itemAxis.map((i) => {
        i.highlight = i.name.toLowerCase().indexOf(p) > -1;
        return i;
      })
    );
  }
  return (
    <div className="container">
      <div className="is-vcentered">
        <Form ChangeShowValue={ChangeShowValue} FindPattern={FindPattern} />
        <Chart
          width={3200}
          height={2600}
          data={heros}
          xAxis={itemAxis}
          yAxis={heroAxis}
        />
      </div>
    </div>
  );
}

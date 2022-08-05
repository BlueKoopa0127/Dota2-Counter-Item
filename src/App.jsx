import { useEffect, useState } from "react";
import Chart from "./Chart";
import Form from "./Form";
import { getHeros } from "./Model";
import "bulma/css/bulma.css";

export default function App() {
  const [heros, setHeros] = useState(null);
  getHeros(setHeros);
  console.log(heros);

  if (heros === null) {
    return <div>Loading...</div>;
  }
  if (heros.err != null) {
    return <div>Error</div>;
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
    setHeros(
      heros.map((h) => {
        return {
          id: h.id,
          name: h.name,
          items: h.items.map((i) => {
            hl = true;
            [...pattern].map((e) => console.log(e));
            return i;
          }),
        };
      })
    );
  }
  return (
    <div className="container">
      <div className="is-vcentered">
        <Form ChangeShowValue={ChangeShowValue} />
        <Chart width={3200} height={2600} data={heros} />
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import Chart from "./Chart";
import Form from "./Form";
import { getHeros } from "./Model";
import "bulma/css/bulma.css";

export default function App() {
  const [heros, setHeros] = useState(null);
  const [heroAxis, setHeroAxis] = useState(null);
  const [itemAxis, setItemAxis] = useState(null);
  const [findBox, setFindBox] = useState("");
  const createHeroAxis = (array) => {
    createAxis(array, setHeroAxis);
  };
  const createItemAxis = (array) => {
    createAxis(array, setItemAxis);
  };

  getHeros(setHeros);

  useEffect(() => {
    if (heros != null && heroAxis === null && itemAxis === null) {
      createHeroAxis(heros);
      createItemAxis(heros[0].items);
      updateHighlight();
    }
  }, [heros]);

  useEffect(() => {
    if (heroAxis === null || itemAxis === null) {
      return;
    }
    updateHighlight();
  }, [findBox]);

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
  function createAxis(array, setFunc) {
    setFunc(
      Array.from(
        new Set(
          array.map((h) => {
            return {
              name: h.name,
              id: h.id,
            };
          })
        )
      ).map((e) => {
        return {
          name: e.name,
          index: e.id,
          highlight:
            findBox === "" ? false : e.name.toLowerCase().indexOf(findBox) > -1,
        };
      })
    );
  }
  function updateHighlight() {
    if (heroAxis === null || itemAxis === null) {
      return;
    }
    //検索文字列が空なら全てのハイライトを消す
    if (findBox === "") {
      setHeroAxis(
        heroAxis.map((h) => {
          h.highlight = false;
          return h;
        })
      );
      setItemAxis(
        itemAxis.map((i) => {
          i.highlight = false;
          return i;
        })
      );
      return;
    }

    setHeroAxis(
      heroAxis.map((h) => {
        h.highlight = h.name.toLowerCase().indexOf(findBox) > -1;
        return h;
      })
    );
    setItemAxis(
      itemAxis.map((i) => {
        i.highlight = i.name.toLowerCase().indexOf(findBox) > -1;
        return i;
      })
    );
  }

  return (
    <div className="container">
      <div className="is-vcentered">
        <Form ChangeShowValue={ChangeShowValue} setFindBox={setFindBox} />
        <Chart
          width={3200}
          height={2600}
          data={heros}
          xAxis={itemAxis}
          setXAxis={createItemAxis}
          yAxis={heroAxis}
          setYAxis={createHeroAxis}
          findBox={findBox}
        />
      </div>
    </div>
  );
}

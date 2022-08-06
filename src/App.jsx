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
      if (!("err" in heros)) {
        createHeroAxis(heros);
        createItemAxis(heros[0].items);
        updateHighlight();
      }
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

  function Message({ m, b }) {
    return (
      <div className="box has-text-centered">
        <div>{m}</div>
        <div>{b}</div>
      </div>
    );
  }

  if (heros === null) {
    return <Message m={"読み込み中..."} />;
  }
  if ("err" in heros) {
    return (
      <Message
        m={"接続がタイムアウトしました"}
        b={
          <button className="button" onClick={() => window.location.reload()}>
            再読み込み
          </button>
        }
      />
    );
  }
  if (heroAxis === null || itemAxis === null) {
    return <Message m={"計算中..."} />;
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
    <div>
      <Title titleName={"Dota2 Counter Item"} />
      <div className="container">
        <div className="is-vcentered">
          <HowTo />
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
    </div>
  );
}

function Title({ titleName }) {
  return (
    <section className="hero is-light">
      <div className="hero-body">
        <div className="container is-max-desktop">
          <p className="title">{titleName}</p>
        </div>
      </div>
    </section>
  );
}

function HowTo() {
  return (
    <div className="content box">
      <h2>使用したデータ</h2>
      Dota2のプロが出場している最新パッチのリーグの試合1000件
      <h2>表の見方</h2>
      <ul>
        <li>Y軸がヒーロー、X軸がアイテムを示している。</li>
        <li>ヒーローに対するアイテムの勝率、使用率が色となって表示される。</li>
        <li>赤色が強い程、ヒーローに対してアイテムが有効である。</li>
        <li>
          例：左上のマスだとAnti-Mageに対してブリンクダガーを買ったチームは1%程度いつもより勝っている。
        </li>
      </ul>
      <h2>使い方</h2>
      <ul>
        <li>フォームの使い方</li>
        <ul>
          <li>
            「表示したいデータ」で使用率などの表示したいデータを選択すると色として表示されるデータが選択されたものに変更される。
          </li>
          <li>
            「ヒーロー、アイテムの検索」に知りたいヒーロー、アイテムの名前を入力すると部分一致するヒーロー、アイテムが強調される
          </li>
          <li>
            例：spiと入力すると「Spirit Vessel」や「Storm
            Spirit」などの「spi」を含むものが強調される
          </li>
        </ul>
        <li>表の使い方</li>
        <ul>
          <li>
            表のヒーロー、アイテム名をクリックするとそれを基準に降順ソートされる。
          </li>
          <li>
            表の色がついている要素にカーソルを当てていると具体的な数値が表示される。
          </li>
        </ul>
      </ul>
    </div>
  );
}

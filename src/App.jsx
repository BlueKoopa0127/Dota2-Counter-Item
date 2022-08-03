import { useEffect, useState } from "react";
import Chart from "./Chart";
import { getHeros } from "./Model";

export default function App() {
  const [heros, setHeros] = useState(null);
  getHeros(setHeros);
  console.log(heros);

  if (heros === null) {
    return <div>Loading...</div>;
  }
  if ("err" in heros) {
    if (heros.err != null) {
      return <div>Error</div>;
    }
  }
  return (
    <div>
      <Chart width={800} height={800} data={heros} />
    </div>
  );
}

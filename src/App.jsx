import { useEffect, useState } from "react";
import Chart from "./Chart";
import { getHeros } from "./Model";

export default function App() {
  const [heros, setHeros] = useState(null);
  getHeros(setHeros);

  if (heros === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Chart width={300} height={300} data={heros} />;
    </div>
  );
}

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

  }
  return (
    <div className="container">
      <div className="is-vcentered">
        <Form />
        <Chart width={3200} height={2600} data={heros} />
      </div>
    </div>
  );
}

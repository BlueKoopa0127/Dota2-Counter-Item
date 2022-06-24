import { useEffect, useState } from "react";

export function Test() {
  const data = Model("https://api.opendota.com/api/players/80710588");
  console.log(data);
  return <div>test</div>;
}

export default function Model(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchDataJson((j) => {
      setData(j);
    }, url);
  }, []);
  return data;
}

async function fetchDataJson(callback, url) {
  const response = await fetch(url);
  const json = await response.json();
  callback(json);
}

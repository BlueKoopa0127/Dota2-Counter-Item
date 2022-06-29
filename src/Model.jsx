import { useEffect, useState } from "react";

export function Test() {
  const sql = "https://api.opendota.com/api/explorer?sql=";
  const tables = [
    "player_matches",
    "matches",
    "heroes",
    "items",

    "picks_bans",
    "public_matches",
    "match_logs",
    "match_patch",
  ];
  const [columns, setColumns] = useState(null);
  const [items, setItems] = useState(null);
  const [datas, setDatas] = useState(null);

  const hero_id = 1;

  useEffect(() => {
    fetchDataJson(
      `${sql}
      select ${tables[0]}.match_id,player_slot,radiant_win,${tables[2]}.localized_name,
      (select localized_name from ${tables[3]} where id=item_0) as item_0,
      (select localized_name from ${tables[3]} where id=item_1) as item_1,
      (select localized_name from ${tables[3]} where id=item_2) as item_2,
      (select localized_name from ${tables[3]} where id=item_3) as item_3,
      (select localized_name from ${tables[3]} where id=item_4) as item_4,
      (select localized_name from ${tables[3]} where id=item_5) as item_5,
      (select localized_name from ${tables[3]} where id=item_neutral) as item_neutral
      from ${tables[0]}
      right outer join (select match_id from ${tables[0]} where hero_id=${hero_id} order by ${tables[0]}.match_id desc limit 100) as hero_matches
      on ${tables[0]}.match_id = hero_matches.match_id
      inner join ${tables[1]} on ${tables[0]}.match_id = ${tables[1]}.match_id 
      inner join ${tables[2]} on ${tables[0]}.hero_id = ${tables[2]}.id
      ;`,
      setDatas
    );
  }, []);

  useEffect(() => {
    fetchDataJson(
      `${sql}select * from ${tables[0]} where hero_id=${hero_id} limit 100`,
      setDatas
    );
  }, []);

  /*useEffect(() => {
    fetchDataJson(
      `${sql}select * from (select player_slot,item_0,item_1,item_2,item_3,item_4,item_5,item_neutral from ${tables[0]} where match_id=6639618471) as itemlist;`,
      setDatas
    );
  }, []);
  /*useEffect(() => {
    fetchDataJson(
      `${sql}select case when player_slot < 128 then 'Radiant' else 'Dire' end from ${tables[0]} where match_id=6639618471 limit 10;`,
      setDatas
    );
  }, []);
  /*
  useEffect(() => {
    fetchDataJson(
      `${sql}select item_0 from ${tables[0]} where match_id=6639618471 limit 10;`,
      setDatas
    );
  }, []);

  /*useEffect(() => {
    fetchDataJson(
      `${sql}select * from ${tables[0]} where hero_id=60 order by match_id desc limit 100;`,
      setDatas
    );
  }, []);*/

  return <div>test</div>;
}

async function fetchDataJson(url, setData) {
  const response = await fetch(url);
  const json = await response.json();
  console.log(json);
  setData(json);
}

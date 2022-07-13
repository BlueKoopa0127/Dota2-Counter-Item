import { useEffect, useState } from "react";

export function ModelTest() {
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
  const [heros, setHeros] = useState(null);
  const [items, setItems] = useState(null);
  const [datas, setDatas] = useState(null);

  const hero_id = 1;
  const match_id = 6641112390;

  useEffect(() => {
    fetchDataJson(
      `${sql}
      select ${tables[2]}.id, ${tables[2]}.localized_name as hero, ${tables[3]}.localized_name as item, 0 as win_rate_diff, 0 as use_rate
      from ${tables[2]}
      right outer join ${tables[3]} on true
      where ${tables[3]}.localized_name not like 'Recipe:%25'
      order by id asc
      ;`,
      setHeros
    );
  }, []);

  useEffect(() => {
    const query = encodeURI(`select id, localized_name
    from ${tables[3]}
    where localized_name not like 'Recipe:%'
    order by id asc
    ;`);

    fetchDataJson(`${sql}${query}`, setItems);
  }, []);

  /*
  select hero, item, win_rate, use_rate 
  select match_id, hero_id, item_id, win, use
  */

  /*useEffect(() => {
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
      `${sql}
      select *
      from(
        select
        match_id,
        case
        when player_slot in(0,1,2,3,4)
        then true
        when player_slot in(128,129,130,131,132)
        then false
        else null
        end as is_radiant,
        hero_id
        from ${tables[0]}
      ) as t where match_id=${match_id} and 
      case
      when (select count(hero_id=${hero_id} or null) from ${tables[0]} where match_id=${match_id} and player_slot in(0,1,2,3,4)) = 1
      then is_radiant=false
      when (select count(hero_id=${hero_id} or null) from ${tables[0]} where match_id=${match_id} and player_slot in(128,129,130,131,132)) = 1
      then is_radiant=true
      else null
      end
      ;
      `,
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

export function getHeros(setHeros) {
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

  useEffect(() => {
    fetchDataJson(
      `${sql}
      select ${tables[2]}.id as id, ${tables[3]}.id as item_id, ${tables[2]}.localized_name as hero, ${tables[3]}.localized_name as item, 0.3 as win_rate_diff, 0 as use_rate
      from ${tables[2]}
      right outer join ${tables[3]} on true
      where ${tables[3]}.localized_name not like 'Recipe:%25'
      order by id asc
      ;`,
      convert,
      setHeros
    );
  }, []);
}

function convert(json, setData) {
  const heros = Array.from(new Set(json.rows.map(({ hero }) => hero)));
  const test = heros.map((hero) => {
    return {
      id: json.rows.find((element) => element.hero === hero).id,
      name: hero,
      items: json.rows
        .filter((element) => element.hero === hero)
        .map((element) => {
          return {
            id: element.item_id,
            name: element.item,
            winRateDiff: element.win_rate_diff,
            useRate: element.use_rate,
          };
        }),
    };
  });
  console.log(test);
  setData(test);
}

async function fetchDataJson(url, convert, setData) {
  const response = await fetch(url);
  const json = await response.json();
  console.log(json);
  convert(json, setData);
}

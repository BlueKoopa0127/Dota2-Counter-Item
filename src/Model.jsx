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
  const match_id = 6661221608;
  const match_count = 6000;
  const hero_items_table = `
    (
      select
        ${tables[1]}.match_id,
        hero_id,
        ARRAY[item_0, item_1, item_2, item_3, item_4, item_5, item_neutral] as items,
        case
          when player_slot in(0,1,2,3,4)
            then radiant_win
          when player_slot in(128,129,130,131,132)
            then not radiant_win
          else null
        end as win
      from ${tables[1]}
        inner join ${tables[7]} on ${tables[1]}.match_id=${tables[7]}.match_id
        right outer join ${tables[0]} on ${tables[1]}.match_id=${
    tables[0]
  }.match_id
      where patch='7.31'
      order by ${tables[1]}.match_id desc limit ${match_count * 10}
  ) as hero_items`;
  const match_items_table = `
  (
    select match_id, win, array_agg(item) as item_list
    from(
      select distinct
        match_id,
        win,
        unnest(items) as item 
      from ${hero_items_table}
    ) as item_table
    where item!=0
    group by match_id, win
  ) as match_items`;
  const hero_enemyitems = `
  (
    select
      hero_items.hero_id,
      hero_items.win,
      match_items.item_list as enemy_items
    from ${hero_items_table}
      left outer join ${match_items_table}
        on hero_items.match_id=match_items.match_id 
          and hero_items.win=not match_items.win
  ) as hero_enemyitems`;
  const hero_enemyitem_win_lose = `
  (
    select 
      hero_id,
      enemy_item,
      count(win=true or null) as win,
      count(win=false or null) as lose
    from 
      (select hero_id, win, unnest(enemy_items) as enemy_item from ${hero_enemyitems}) as hero_enemyitems
    group by hero_id, enemy_item
  ) as hero_enemyitem_win_lose`;
  const localized_name_table = `
  (
    select
      ${tables[2]}.id as hero_id,
      ${tables[3]}.id as item_id,
      ${tables[2]}.localized_name as hero,
      ${tables[3]}.localized_name as enemy_item,
      win,
      lose
    from ${hero_enemyitem_win_lose}
      left outer join ${tables[2]} on hero_enemyitem_win_lose.hero_id = ${tables[2]}.id
      left outer join ${tables[3]} on hero_enemyitem_win_lose.enemy_item = ${tables[3]}.id
  ) as localized_name_table`;
  const hero_win_lose = `
  (
    select
      hero_id,
      count(win=true or null) as hero_win,
      count(win=false or null) as hero_lose 
    from ${hero_items_table}
    group by hero_id
    order by hero_id
  ) as hero_win_lose`;

  useEffect(() => {
    fetchDataJson(
      `${sql}
      select
        localized_name_table.hero_id,
        item_id,
        hero,
        enemy_item,
        ( (1.0 * lose / (win %2B lose)) - (1.0 * hero_lose / (hero_win %2B hero_lose)) ) as win_rate_diff,
        ( 1.0 * (win %2B lose) / (hero_win %2B hero_lose) ) as use_rate,
        win,
        lose,
        hero_win,
        hero_lose
      from ${localized_name_table}
        left outer join ${hero_win_lose}
          on localized_name_table.hero_id=hero_win_lose.hero_id
      order by localized_name_table.hero_id, item_id
      ;`,
      setDatas
    );
  }, []);

  /*useEffect(() => {
    fetchDataJson(
      `${sql}
      select * from ${tables[3]} where id = 1466
      ;`,
      setDatas
    );
  }, []);

  /*useEffect(() => {
    fetchDataJson(
      `${sql}
      select * from ${hero_items_table}
      ;`,
      setDatas
    );
  }, []);

  useEffect(() => {
    fetchDataJson(
      `${sql}
      select * from ${tables[2]} where id=48
      ;`,
      setDatas
    );
  }, []);

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

  function convertSet(json) {
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
    setHeros(test);
  }

  const match_count = 1000;
  const hero_items_table = `
    (
      select
        ${tables[1]}.match_id,
        hero_id,
        ARRAY[item_0, item_1, item_2, item_3, item_4, item_5, item_neutral] as items,
        case
          when player_slot in(0,1,2,3,4)
            then radiant_win
          when player_slot in(128,129,130,131,132)
            then not radiant_win
          else null
        end as win
      from ${tables[1]}
        inner join ${tables[7]} on ${tables[1]}.match_id=${tables[7]}.match_id
        right outer join ${tables[0]} on ${tables[1]}.match_id=${
    tables[0]
  }.match_id
      where patch='7.31'
      order by ${tables[1]}.match_id desc limit ${match_count * 10}
  ) as hero_items`;
  const match_items_table = `
  (
    select match_id, win, array_agg(item) as item_list
    from(
      select distinct
        match_id,
        win,
        unnest(items) as item 
      from ${hero_items_table}
    ) as item_table
    where item!=0
    group by match_id, win
  ) as match_items`;
  const hero_enemyitems = `
  (
    select
      hero_items.hero_id,
      hero_items.win,
      match_items.item_list as enemy_items
    from ${hero_items_table}
      left outer join ${match_items_table}
        on hero_items.match_id=match_items.match_id 
          and hero_items.win=not match_items.win
  ) as hero_enemyitems`;
  const hero_enemyitem_win_lose = `
  (
    select 
      hero_id,
      enemy_item,
      count(win=true or null) as win,
      count(win=false or null) as lose
    from 
      (select hero_id, win, unnest(enemy_items) as enemy_item from ${hero_enemyitems}) as hero_enemyitems
    group by hero_id, enemy_item
  ) as hero_enemyitem_win_lose`;
  const hero_win_lose = `
  (
    select
      hero_id,
      count(win=true or null) as hero_win,
      count(win=false or null) as hero_lose 
    from ${hero_items_table}
    group by hero_id
    order by hero_id
  ) as hero_win_lose`;
  const hero_item_windiff = `(
    select
      hero_enemyitem_win_lose.hero_id,
      hero_enemyitem_win_lose.enemy_item,
      ( (1.0 * lose / (win %2B lose)) - (1.0 * hero_lose / (hero_win %2B hero_lose)) ) as win_rate_diff,
      ( 1.0 * (win %2B lose) / (hero_win %2B hero_lose) ) as use_rate,
      win,
      lose,
      hero_win,
      hero_lose
    from ${hero_enemyitem_win_lose}
      left outer join ${hero_win_lose}
        on hero_enemyitem_win_lose.hero_id=hero_win_lose.hero_id
    order by hero_enemyitem_win_lose.hero_id, hero_enemyitem_win_lose.enemy_item
  ) as hero_item_windiff`;

  useEffect(() => {
    fetchDataJson(
      `${sql}
      select 
        ${tables[2]}.id as id,
        ${tables[3]}.id as item_id,
        ${tables[2]}.localized_name as hero,
        ${tables[3]}.localized_name as item,
        coalesce(win_rate_diff, 0) as win_rate_diff,
        coalesce(use_rate, 0) as use_rate
      from ${tables[2]}
        right outer join ${tables[3]} on true
        left outer join ${hero_item_windiff}
          on hero_item_windiff.hero_id = ${tables[2]}.id
          and hero_item_windiff.enemy_item = ${tables[3]}.id
      where ${tables[3]}.localized_name not like 'Recipe:%25'
      order by id asc
      ;`,
      convertSet
    );
  }, []);
}

async function fetchDataJson(url, setData) {
  const response = await fetch(url);
  const json = await response.json();
  console.log(json);
  setData(json);
}

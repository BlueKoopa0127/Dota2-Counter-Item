export default function Form({ ChangeShowValue, FindPattern }) {
  return (
    <div>
      <DropBox ChangeShowValue={ChangeShowValue} />
      <FindBox FindPattern={FindPattern} />
    </div>
  );
}

function DropBox({ ChangeShowValue }) {
  return (
    <div className="field">
      <label className="label">表示したいデータ</label>
      <div className="select">
        <select onChange={(e) => ChangeShowValue(e.target.value)}>
          <option>勝率差</option>
          <option>使用率</option>
          <option>勝率差 * 使用率</option>
        </select>
      </div>
    </div>
  );
}

function FindBox({ FindPattern }) {
  return (
    <div className="field">
      <label className="label">ヒーロー、アイテムの検索</label>
      <div className="control">
        <input
          className="input"
          type="text"
          placeholder="探したいヒーロー名、アイテム名を入力してください"
          onChange={(e) => FindPattern(e.target.value)}
        ></input>
      </div>
    </div>
  );
}
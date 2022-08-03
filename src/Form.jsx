export default function Form() {
  return (
    <div>
      <DropBox />
      <FindBox />
    </div>
  );
}

function DropBox() {
  return (
    <div className="field">
      <label className="label">表示したいデータ</label>
      <div className="select">
        <select>
          <option>勝率</option>
          <option>使用率</option>
          <option>勝率 * 使用率</option>
        </select>
      </div>
    </div>
  );
}

function FindBox() {
  return (
    <div className="field">
      <label className="label">ヒーロー、アイテムの検索</label>
      <div className="control">
        <input
          className="input"
          type="text"
          placeholder="探したいヒーロー名、アイテム名を入力してください"
        ></input>
      </div>
    </div>
  );
}

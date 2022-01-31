function myFunction() {
    // 対象のカレンダーを取得
    const CALENDAR_ID = "xxx"
    const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
    // 取得対象のイベント名
    const targetTitle = "xxx"

    // 取得範囲設定
    const startTime = new Date('2022/01/01 00:00:00');
    const endTime = new Date('2022/02/01 00:00:00');

    // 範囲内のイベント取得
    const events = calendar.getEvents(startTime, endTime);

    const recordList = [];
    for (const event of events) {
        // イベント名取得
        const title = event.getTitle();
        // target以外のイベントは無視
        if (!title.includes(targetTitle)) continue;
        // 差分で勤務時間を計算
        const diff = (event.getEndTime() - event.getStartTime()) / 60 / 60 / 1000;
        const dateStr = Utilities.formatDate(event.getStartTime(), "JST", "yyyy/MM/dd");

        // 取得結果をリストに追加
        const record = [
            dateStr,
            diff,
            diff - 1,
            title
        ];
        recordList.push(record);
    }

    // 現在のspreadsheetを取得
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    // 新規シート作成
    let newSheet = spreadsheet.insertSheet();
    // 年月の名前をつける
    newSheet.setName(Utilities.formatDate(startTime, "JST", "yyyy/MM"));

    // 取得内容を書き込む
    newSheet.appendRow(["日付", "勤務時間(休憩含む)", "精算時間", "イベント名"]);
    for (const record of recordList) {
        newSheet.appendRow(record);
    }

    // データが存在する範囲を取得
    const range = newSheet.getDataRange();
    // 末尾に精算時間合計を計算して追加
    const lastRow = range.getLastRow();
    newSheet.getRange(lastRow + 1, 3).setFormula("=sum(C2:C" + lastRow + ")")
    // 罫線をかける
    range.setBorder(true, true, true, true, true, true);
}

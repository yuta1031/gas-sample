//Constant
var ACCESS_TOKEN = "xxx";
var ENDPOINT = "https://api.github.com/graphql";

//GitHubからissue一覧取得
function getGitHubIssues() {
  var query = '{\
    repository(owner: "yuta1031", name: "vue-sample") { \
      name,\
      description,\
      issues(first: 10, states: OPEN){\
        totalCount,\
        nodes{\
          title,\
          createdAt,\
          bodyText, \
          milestone { \
           dueOn } \
        }\
      }\
    }\
  }';
  var options = {
    'method' : 'post',
    'contentType' : 'application/json',
    'headers' : {
      'Authorization' : 'Bearer ' +  ACCESS_TOKEN
     },
    'payload' : JSON.stringify({query:query})
  };
  var response = UrlFetchApp.fetch(ENDPOINT, options);
  var json = JSON.parse(response.getContentText());

  outputToSheet(json.data.repository.issues.nodes)
  Logger.log(json.data.repository.issues.nodes)

  return ContentService.createTextOutput(JSON.stringify(json)).setMimeType(ContentService.MimeType.JSON);
}

//スプレッドシートに出力
function outputToSheet(issues) {
var sheet = SpreadsheetApp.getActiveSheet();
  
  //ヘッダ行出力と着色
  headers = ['issue', 'createdAt', 'due', 'description']
  for(var i in headers) {
    var range = sheet.getRange(1,parseInt(i) + 1); 
    range.setValue(headers[i]);
    range.setBackground("#def4ff")
  }
  
  //取得した値をパース
  for(var index in issues) {
    var range = sheet.getRange(parseInt(index) + 2,1); 
    range.setValue(issues[index].title);
    var range = sheet.getRange(parseInt(index) + 2,2); 
    range.setValue(issues[index].createdAt);
    var range = sheet.getRange(parseInt(index) + 2,3); 
    range.setValue(issues[index].milestone.dueOn);
    var range = sheet.getRange(parseInt(index) + 2,4); 
    range.setValue(issues[index].bodyText);
  }

}
const Calendar = CalendarApp.getCalendarById("scsmiccalendar@gmail.com");
const calendar_room = CalendarApp.getCalendarById("0j1igo348r131bsutjnisfq0g0@group.calendar.google.com");
const spreadsheet = SpreadsheetApp.openById("1S-eAqBUfv5UodrOyt3JmyVQek1dvHNe_fdk7HIpgAvA")
const GROUP_ID_ROOM = spreadsheet.getActiveSheet().getRange("B3").getValue();
const GROUP_ID_WEEK=spreadsheet.getActiveSheet().getRange("B4").getValue()
const CHANNEL_ACCESS_TOKEN = spreadsheet.getActiveSheet().getRange("B2").getValue();

const ToAdress="scsmiccalendar@gmail.com";  //予定出しを送るEmailアドレス
const SenderName={name:"予定出し"};

const Timeset=0; //タイムゾーンを調整
const DayOfWeekStr=["月","火","水","木","金","土","日"];
const HourWords=["朝限:","①","②","昼限：","③","④","⑤","⑥","⑦",];
const HourWordsPrint=["朝","①","②","昼","③","④","⑤","⑥","⑦"];


// 音響員への予定だし用
function MikeManagement(){
  var day_array=[];
  var week_practice=[];
  var week_practice_room=[];

  // 7(日数) × 9(時限分)の配列にマイク練を格納
  for(let i=0;i<7;i++){
    var day_practice=[];
    var day_practice_room=[];

    var date = new Date();
    var event_date = new Date(date.getFullYear(),date.getMonth(),date.getDate()+1,0,0,0);
    var start_time=new Date(Date.parse(event_date) + (i * 60 * 60 * 24 * 1000)+Timeset*60*60*1000);
    var end_time = new Date(Date.parse(event_date) + (((i+1) * 60 * 60 * 24 -1 )* 1000)+Timeset*60*60*1000);
    console.log(Utilities.formatDate( start_time, 'Asia/Tokyo', 'yyyyMMdd: hh時mm分ss'));
    console.log(Utilities.formatDate( end_time, 'Asia/Tokyo', 'yyyyMMdd: hh時mm分ss'));

    day_array.push(String((start_time.getMonth()+1))+"月"+start_time.getDate()+"日("+DayOfWeekStr[i]+")");
    console.log(start_time);
    console.log(day_array);

    var events = Calendar.getEvents(start_time, end_time);

    for(const event of events){
      day_practice.push(event.getTitle());
      day_practice_room.push(event.getLocation());
    }

    console.log(day_practice_room);

    hour_devide_practice=[];
    hour_devide_practice_room=[];

    for(let j=0;j<HourWords.length;j++){
      hour_practice=[];
      hour_practice_room=[];
      hour_practice=day_practice.filter(
        function(value,index){
          if(value.indexOf(HourWords[j]) !== -1) {
            hour_practice_room.push(day_practice_room[index]);
            return true
          }else{
            return false
          }
        }
      )
      hour_devide_practice.push(hour_practice);
      hour_devide_practice_room.push(hour_practice_room);
    }
    week_practice.push(hour_devide_practice);
    week_practice_room.push(hour_devide_practice_room);
  }

  console.log(week_practice)

  // 予定出し用の文字列を作成
  var schedule_member="";
  for(let i=0;i<7;i++){
    data_before=[];
    for(let j=0;j<HourWordsPrint.length;j++){
      if(week_practice[i][j].length!==0){
        console.log(week_practice[i][j]);
        data_before=data_before+"\n"+HourWordsPrint[j];
        schedule_mix="";
        for(let k=0;k<week_practice[i][j].length;k++){
            schedule_mix=schedule_mix+week_practice[i][j][k];
        }
        if(schedule_mix.indexOf("【PA欠席】")!=-1){
          data_before=data_before+"【PA欠席】"
        }
        if(schedule_mix.indexOf("【PA未定】")!=-1){
          data_before=data_before+"【PA未定】"
        }
        if(schedule_mix.indexOf("【企画】")!=-1){
          data_before=data_before+"【企画】"
        }
      }
    }
    if(data_before.length!==0){
      schedule_member=schedule_member+day_array[i]+data_before;
      schedule_member=schedule_member+"\n";
    }
  }
  if(schedule_member==""){
    schedule_member = "今週のマイク練の予定出しはありません"
  } else{
    schedule_member = "今週の予定だし"+"\n"+schedule_member;
  }

  // 送信をする
  subject=day_array[0]+"の週の予定出し";
  GmailApp.sendEmail(ToAdress,subject,schedule_member,SenderName)
  console.log(GROUP_ID_WEEK)
  Push(schedule_member,GROUP_ID_WEEK)
}


// 毎朝部屋のお知らせ
function AnnounceRoom() {
  // 今日のマイク練部屋を整理
  var date = new Date();
  var event_date = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);
  var start_time=new Date(Date.parse(event_date));
  var end_time = new Date(Date.parse(event_date) + ((1 * 60 * 60 * 24 -1)* 1000)+Timeset*60*60*1000);

  var events = Calendar.getEvents(start_time, end_time);

  var day_practice=[];
  var day_practice_room=[];
  for(const event of events){
    day_practice.push(event.getTitle());
    day_practice_room.push(event.getLocation());
  }

  hour_devide_practice=[];
  hour_devide_practice_room=[];
  for(let j=0;j<HourWords.length;j++){
    hour_practice=[];
    hour_practice_room=[];
    hour_practice=day_practice.filter(
      function(value,index){
        if(value.indexOf(HourWords[j]) !== -1) {
          hour_practice_room.push(day_practice_room[index]);
          return true
        }else{
          return false
        }
      }
    )
    hour_devide_practice.push(hour_practice);
    hour_devide_practice_room.push(hour_practice_room);
  }

  console.log(hour_devide_practice);
  console.log(hour_devide_practice_room);

  print_announce_room="今日のマイク練部屋情報\n";
  for (let j=0;j<HourWords.length;j++) {
    if(hour_devide_practice_room[j].length!=0){
      print_announce_room=print_announce_room+HourWords[j]+"："+hour_devide_practice_room[j][0]+"\n";
    }
  }
  print_announce_room=print_announce_room+"\n"+"今日の不要の部屋情報(マイク練だけを考慮してます。サークル行事が入っていない場合キャンセルしてください)\n"

  // 今日の不要な部屋情報を整理
  var date = new Date();
  var event_date = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);
  var start_time=new Date(Date.parse(event_date));
  var end_time = new Date(Date.parse(event_date) + ((1 * 60 * 60 * 24 -1)* 1000)+Timeset*60*60*1000);
  var events_room = calendar_room.getEvents(start_time, end_time); // 部屋情報を取得

  var no_use_room=""

  day_room=[];
  for(const event of events_room){
    day_room.push(event);
  }
  for(let j=0;j<HourWords.length;j++) {
    hour_room=[];
    hour_room=day_room.filter(
      function(value,index){
        if(value.getTitle().indexOf(HourWords[j]) !== -1) {
          return true
        }else{
          return false
        }
      }
    )

    if(hour_room.length!=0) {
      var events = Calendar.getEvents(hour_room[0].getStartTime(), hour_room[0].getEndTime());　// hour_roomの時間情報を使うことが適切か？
      console.log(events)
      if (events.length==0){
        no_use_room=no_use_room+HourWords[j]
      }
    }
  }

  print_announce_room=print_announce_room+no_use_room
  subject="の週の予定出し";
  GmailApp.sendEmail(ToAdress,subject,print_announce_room,SenderName)
  console.log(print_announce_room);
  Push(print_announce_room,GROUP_ID_ROOM)
}

// LineにPush送信する関数
function Push(message,send_id) {
    var headers = {
        "Content-Type" : "application/json; charset=UTF-8",
        "Authorization" : "Bearer " + CHANNEL_ACCESS_TOKEN
    };
    var postData = {
        "to" : send_id,
        "messages" : [
            {
                "type" : "text",
                "text" : message
            }
        ]
    };
    var options = {
        "method" : "POST",
        "headers" : headers,
        "payload" : JSON.stringify(postData)
    };
    return UrlFetchApp.fetch("https://api.line.me/v2/bot/message/push", options);
}

// Lineのサーバーから入って最初に入るプログラム
function doPost(e) {
  var contents = e.postData.contents;
  var obj = JSON.parse(contents);
  var events = obj["events"];
  for (var i = 0; i < events.length; i++) {
    if (events[i].type == "message" && events[i].message.text=="予定出しグループ変更") {
      ReplyMessageGroupChange(events[i],"check_schedule");
    }
    if(events[i].type == "message" && events[i].message.text=="部屋アナウンスグループ変更"){
      ReplyMessageGroupChange(events[i],"announce_room");
    }
  }
}

// Messageを受け取るクラス
function ReplyMessageGroupChange(e, type) {
  var sheet = spreadsheet.getActiveSheet();
  var user_id = e.source.userId;
  var group_id = e.source.groupId;
  var room_id = e.source.roomId;
  var input_text = e.message.text

  var ids = [];
  if(group_id==null){
    ids = ["グループに","送ってください"];
  }else{
    if(type=="check_schedule"){
      ids = ["予定だしグループを",group_id,"に変更しました"];
      spreadsheet.getActiveSheet().getRange("B4").setValue(group_id);
    }else if(type=="announce_room"){
      ids = ["部屋アナウンスグループを",group_id,"に変更しました"];
      spreadsheet.getActiveSheet().getRange("B3").setValue(group_id);
    }
  }

  if(ids!==[]) {
    var postData = {
      "replyToken" : e.replyToken,
      "messages" : [
        {
          "type" : "text",
          "text" : ids.join("")
        }
      ]
    };

    var options = {
      "method" : "post",
      "headers" : {
        "Content-Type" : "application/json",
        "Authorization" : "Bearer " + CHANNEL_ACCESS_TOKEN
      },
      "payload" : JSON.stringify(postData)
    };
    UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", options);
  }
}

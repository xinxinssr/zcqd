
 function nowTimes(){
  this.timeFormate(new Date());
  setInterval(this.nowTimes,1000);
  //this.clear()
}
//显示当前时间（年月日时分秒）
  function timeFormate(timeStamp) {
  let year = new Date(timeStamp).getFullYear();
  let month =new Date(timeStamp).getMonth() + 1 < 10? "0" + (new Date(timeStamp).getMonth() + 1): new Date(timeStamp).getMonth() + 1;
  let date =new Date(timeStamp).getDate() < 10? "0" + new Date(timeStamp).getDate(): new Date(timeStamp).getDate();
  let hh =new Date(timeStamp).getHours() < 10? "0" + new Date(timeStamp).getHours(): new Date(timeStamp).getHours();
  let mm =new Date(timeStamp).getMinutes() < 10? "0" + new Date(timeStamp).getMinutes(): new Date(timeStamp).getMinutes();
  let ss =new Date(timeStamp).getSeconds() < 10? "0" + new Date(timeStamp).getSeconds(): new Date(timeStamp).getSeconds();
  let week = new Date(timeStamp).getDay();
  let weeks = ["日","一","二","三","四","五","六"];
  let getWeek = "星期" + weeks[week];
  this.nowTime = year + "年" + month + "月" + date +"日"+" "+hh+":"+mm+':'+ss+getWeek  ;
}

//clear(){
// clearInterval(this.nowTimes)
// this.nowTimes = null;
//},
export  default {nowTimes,timeFormate}


const NewSRTDownload = (dialogues, sub_time) => {
  var srt = "";
  for (var i = 1; i <= sub_time.length; i++) {
    var dial_number = `${i}`;
    var time_s = `${sub_time[i - 1][0]}`;
    time_s = time_s.trim();
    time_s = setCharAt(time_s, 8, ",");
    var time_e = `${sub_time[i - 1][1]}`;
    time_e = time_e.trim();
    time_e = setCharAt(time_e, 8, ",");
    var dialogue = `${dialogues[i - 1]}`;
    var cluster =
      dial_number +
      "\n" +
      time_s +
      " --> " +
      time_e +
      "\n" +
      dialogue +
      "\n" +
      "" +
      "\n";
    srt = srt + cluster;
  }

  var data = "text;charset=utf-8,";
  var a = document.createElement("a");
  a.href = "data:text/plain," + encodeURI(srt);
  a.target = "_blank";
  a.download = "NEW_SRT.srt";
  a.innerHTML = "";
  var container = document.getElementById("container");
  container.appendChild(a);
  a.click();
  container.removeChild(a);
};

function setCharAt(str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
}

exports.NewSRTDownload = NewSRTDownload;

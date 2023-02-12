var raw_lines = [];
var time = [];
var dialogue = [];
var currentTime, dial_number, rythmo_position;
export const loadFile = async (file) => 
{
  time.length = 0;
  dialogue.length = 0;
  raw_lines.length = 0;

  let text = await file.text();
  raw_lines = text.split(/\r\n|\n/);
  raw_lines = raw_lines.filter((e) => e != "");
  raw_lines = raw_lines.filter((x) => isNaN(x));

  for (var i = 0; i < raw_lines.length; i++) 
  {
    raw_lines[i] = raw_lines[i].trim();
  }

  for (var i = 0; i < raw_lines.length - 1; i++) 
  {
    let check_d1 = raw_lines[i].search("-->");
    let check_d2 = raw_lines[i+1].search("-->");
      // if(isNaN(raw_lines[i][0]) && isNaN(raw_lines[i+1][0]))
      // {
      //  raw_lines[i] = raw_lines[i] +" "+ raw_lines[i+1];
      //  raw_lines.splice(i+1,1);
      // }
    if(check_d1 == -1 && check_d2 == -1 )
    {
      raw_lines[i] = raw_lines[i] +" "+ raw_lines[i+1];
      raw_lines.splice(i+1,1);
      i=0;
    }
  }

  for (var i = 0; i < raw_lines.length; i++) {
    if (i % 2 == 0) {
      time.push(raw_lines[i]);
    } else {
      dialogue.push(raw_lines[i]);
    }
  }

  raw_lines.length = 0;

  for (var i = 0; i < time.length; i++) 
  {
    time[i] = time[i].split("-->");
    // console.log(time[i]);
    time[i][0] = time[i][0].replace(",", ":");
    time[i][1] = time[i][1].replace(",", ":");
  }
  return { time, dialogue };
};

export const makeSubs = () => {
  for (var i = 0; i < time.length; i++) {
    document.getElementById("output").innerHTML +=
      time[i] + "\n" + dialogue[i] + "\n";
  }
};
export const getSub_Seconds = (param) => {
  /*
		Pass this function the string format of time parameter and it will return you the 
		time converted to seconds in integer format
		*/
  param = param.split(":");
  var hours = parseInt(param[0]);
  var minutes = parseInt(param[1]);
  var seconds = parseInt(param[2]);
  var millis = parseInt(param[3]);

  var total_seconds = hours * 3600 + minutes * 60 + seconds + millis / 1000;
  return total_seconds;
};

export const getSub_Millis = (param) => {
  /*
		Pass this function the string format of time parameter and it will return you the 
		time converted to milliseconds in integer format
		*/
  param = param.split(":");
  var hours = parseInt(param[0]);
  var minutes = parseInt(param[1]);
  var seconds = parseInt(param[2]);
  var millis = parseInt(param[3]);

  var total_millis =
    hours * 3600000 + minutes * 60000 + seconds * 1000 + millis;
  return total_millis;
};

export const loadJson = async (file) => {
  var loaded_Json_data = await file.text();
  var decoded = JSON.parse(loaded_Json_data);
  currentTime = decoded["currentTime"];
  dial_number = decoded["number"];
  rythmo_position = decoded["position"];
  return { currentTime, dial_number, rythmo_position };
};

export const PrintJson = () => {
  document.getElementById("output").innerHTML =
    " " + currentTime + " " + dial_number + " " + rythmo_position;
};

export const MakeJson = (currentTime, dial_number, rythmo_position) => {
  var dict = {
    currentTime: currentTime,
    number: dial_number,
    position: rythmo_position,
  };

  var data =
    "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dict));

  var a = document.createElement("a");
  a.href = "data:" + data;
  a.download = "data.json";
  a.innerHTML = "";

  var container = document.getElementById("container");
  container.appendChild(a);
  a.click();
  container.removeChild(a);
};
var hours,
  mins,
  secs,
  mills,
  d = 0;

export const ToSrtTime = (value) => {
  if (Number.isInteger(value)) {
    d = value;
  } else {
    var decimalStr = value.toString().split(".")[1];
    var dec = Number(decimalStr);
  }

  d = Number(value);
  hours = Math.floor(d / 3600);
  mins = Math.floor((d % 3600) / 60);
  secs = Math.floor((d % 3600) % 60);
  if (getlength(dec) == 1) {
    mills = dec * 100;
  } else if (getlength(dec) == 2) {
    mills = dec * 10;
  } else {
    mills = dec;
  }
  return `${hours}:${mins}:${secs}:${mills}`;
};
export const getlength = (number) => {
  return number.toString().length;
};

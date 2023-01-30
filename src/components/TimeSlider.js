import React, { useState, useEffect, useContext, useRef } from "react";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import moment from "moment";
import "./TimeSlider.css";
import Button from "@mui/material/Button";
import { mainContext } from "../App";
function TimeSlider(props) {
  const {
    player,
    onSeekbarChange,
    seeker,
    play,
    pause,
    changePlaybackRateRate,
    jsonArray,
  } = props;
  const {
    recordingData,
    setRecordingData,
    jsonData,
    setJsonData,
    recordings,
    setRecordings,
  } = useContext(mainContext);
  const [sliderWidth, setSliderWidth] = useState(1200);
  const [marks, setMarks] = useState([]);
  const [sliderValue, setSliderValue] = useState(player.currentTime);
  const [toggleSlider, setToggleSlider] = useState();
  const [cMargin, setCMargin] = useState(0);
  const [width, setWidth] = useState(0);
  const [sliderFontSize, setsliderFontSize] = useState(14);
  const [segments, setSegments] = useState([
    {
      color: "blue",
      width: "100%",
      widthFrom: "",
      widthTo: "",
      durtion: player.duration,
      from: 0,
      to: player.duration,
    },
  ]);
  const myref = useRef(null);
  const segRef = useRef(null);

  useEffect(() => {
    setSliderValue(player.currentTime);
  }, [player]);
  useEffect(() => {
    // recordingData.map((data, key) => {
    setSegments(recordingData);
    // });
  }, [recordingData]);
  const splitTime = (startTime, endTime, interval) => {
    const result = [startTime.toString().split(" ")[4]];
    let time = startTime.add(interval, "m");
    while (time.isBetween(startTime, endTime, undefined, [])) {
      result.push(time.toString().split(" ")[4]);
      time = time.add(interval, "m");
    }
    return result;
  };
  useEffect(() => {
    let Sec = 0;
    const intervalBySeconds = player.duration / 30;
    for (var i = 0; i <= intervalBySeconds; i++) {
      Sec = Sec + 30;
      let currentSec = Sec;
      setMarks((marks) => [
        ...marks,
        {
          value: currentSec,
          label: convertHMS(currentSec),
        },
      ]);
    }
  }, [player.duration]);

  useEffect(() => {
    const Segment = segments.filter(
      (segment) =>
        segment.from < player.currentTime && segment.to > player.currentTime
    );
    var AudioPlay = new Audio();
    if (Segment.length > 0) {
      const breakValue = player.currentTime - Segment[0].from;
      AudioPlay.src = Segment[0].sourceAudio;
      AudioPlay.play();
      AudioPlay.currentTime = breakValue;
    } else {
      AudioPlay.pause();
    }
  }, [player.currentTime]);
  function convertHMS(value) {
    const sec = parseInt(value); // convert value to number if it's string
    let hours = Math.floor(sec / 3600); // get hours
    let minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
    let seconds = sec - hours * 3600 - minutes * 60; //  get seconds
    // add 0 if value < 10; Example: 2 => 02
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return hours + ":" + minutes + ":" + seconds; // Return is HH : MM : SS
  }
  useEffect(() => {
    if (toggleSlider) {
      play();
    } else {
      pause();
    }
  }, [toggleSlider]);
  function random(number) {
    return Math.floor(Math.random() * number);
  }

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  };

  async function removeFirst_N_SecondsFromAudio(seconds, arrayBuffer) {
    const originalArrayBuffer = arrayBuffer; // your original ArrayBuffer
    const bytesPerSecond = 4410 * 2; // sample rate * channels * bytes per sample
    const bytesToRemove = seconds * bytesPerSecond;
    const newArrayBuffer = arrayBuffer.slice(bytesToRemove);
    const totalBytes = originalArrayBuffer.byteLength;

    const newBlob = new Blob([newArrayBuffer], { type: "audio/mpeg" });
    const updated = await blobToBase64(newBlob);
    return { newArrayBuffer, updated };
  }
  async function removeLast_N_SecondsFromAudio(seconds, arrayBuffer) {
    const originalArrayBuffer = arrayBuffer; // your original ArrayBuffer
    const secondsToRemove = seconds; // number of seconds to remove
    const bytesPerSecond = 4410 * 2; // sample rate * channels * bytes per sample
    const bytesToRemove = seconds * bytesPerSecond;
    const totalBytes = originalArrayBuffer.byteLength;
    const newArrayBuffer = originalArrayBuffer.slice(
      0,
      totalBytes - bytesToRemove
    );
    const newBlob = new Blob([newArrayBuffer], { type: "audio/mpeg" });
    const lastRemoved = await blobToBase64(newBlob);
    return { newArrayBuffer, lastRemoved };
  }
  async function divideAudio(breakPoint, totalSeconds, arrayBuffer) {
    const removeSeconds = totalSeconds - breakPoint;
    const firstPart = await removeLast_N_SecondsFromAudio(
      removeSeconds,
      arrayBuffer[0] ?? arrayBuffer
    );
    const secondPart = await removeFirst_N_SecondsFromAudio(
      breakPoint,
      arrayBuffer[0] ?? arrayBuffer
    );
    return {
      firstPart,
      secondPart,
    };
  }

  const handleTrim = async () => {
    const trimSegment = segments.filter(
      (segment) =>
        segment.from < player.currentTime && segment.to > player.currentTime
    );

    const breakValue = player.currentTime - trimSegment[0].from;
    const dividedAudio = await divideAudio(
      breakValue,
      trimSegment[0].recordingDuration,
      trimSegment[0].buffer
    );

    const pullTrimSegment = segments.splice(
      segments.findIndex(
        (segment) =>
          segment.from < player.currentTime && segment.to > player.currentTime
      ),
      1
    );
    const random1 = random(23);

    const color1 =
      "rgb(" + random(255) + "," + random(255) + "," + random(255) + ")";
    const color2 =
      "rgb(" + random(255) + "," + random(255) + "," + random(255) + ")";
    setRecordingData([
      ...recordingData,
      {
        color: color1,
        width:
          (player.currentTime / player.duration) * 100 -
          (trimSegment[0].from / player.duration) * 100,
        audioNumber: random1,
        startTime: trimSegment[0].from,
        endTime: trimSegment[0].from + breakValue,
        widthFrom: (trimSegment[0].from / player.duration) * 100,
        widthTo: (player.currentTime / player.duration) * 100,
        durtion: player.duration,
        from: trimSegment[0].from,
        to: player.currentTime,
        buffer: dividedAudio.firstPart.newArrayBuffer,
        sourceAudio: dividedAudio.firstPart.lastRemoved,
      },
      {
        color: color2,
        width:
          (trimSegment[0].to / player.duration) * 100 -
          (player.currentTime / player.duration) * 100,
        audioNumber: random1 + 1,
        startTime: trimSegment[0].from + breakValue,
        endTime: trimSegment[0].from,
        widthFrom: (player.currentTime / player.duration) * 100,
        widthTo: (trimSegment[0].to / player.duration) * 100,
        durtion: player.duration,
        from: player.currentTime,
        to: trimSegment[0].from,
        buffer: dividedAudio.secondPart.newArrayBuffer,
        sourceAudio: dividedAudio.secondPart.updated,
      },
    ]);
  };

  const dragFunction = (e, i) => {};
  function _base64ToArrayBuffer(x) {
    const binaryString = atob(x.splice(1, -1));
    const arrayBuffer = new Uint8Array(binaryString.length).map((_, i) =>
      binaryString.charCodeAt(i)
    );
  }
  const dragEndFunction = (e, i) => {
    const test = recordingData.map((obj, index) => {
      if (obj.color === segments[i].color) {
        return {
          color: segments[i].color,
          width: segments[i].width,
          widthFrom:
            ((e.clientX - segRef.current.offsetLeft) * 100) /
            segRef.current.offsetWidth,
          widthTo:
            ((e.clientX - segRef.current.offsetLeft) * 100) /
              segRef.current.offsetWidth +
            (segments[i].widthTo - segments[i].widthFrom),
          durtion: player.duration,
          from:
            ((((e.clientX - segRef.current.offsetLeft) * 100) /
              segRef.current.offsetWidth) *
              player.duration) /
            100,
          to:
            ((((e.clientX - segRef.current.offsetLeft) * 100) /
              segRef.current.offsetWidth +
              (segments[i].widthTo - segments[i].widthFrom)) *
              player.duration) /
            100,
          startTime:
            ((((e.clientX - segRef.current.offsetLeft) * 100) /
              segRef.current.offsetWidth) *
              player.duration) /
            100,
          endTime: segments[i].endTime,
          buffer: segments[i].buffer,
          sourceAudio: segments[i].sourceAudio,
          url: segments[i].sourceAudio,
          base64: segments[i].sourceAudio,
        };
      }
      return obj;
    });
    setRecordingData(test);
  };
  return (
    <div>
      <Button
        variant="contained"
        component="label"
        color="primary"
        style={{ marginLeft: "10px" }}
        onClick={() => {
          setToggleSlider(true);
        }}
      >
        Start Recorder Slider
      </Button>
      <Button
        variant="contained"
        component="label"
        color="primary"
        style={{ marginLeft: "10px" }}
        onClick={() => {
          setToggleSlider(false);
        }}
      >
        Stop Recorder Slider
      </Button>
      <Button
        variant="contained"
        component="label"
        color="primary"
        style={{ marginLeft: "10px" }}
        onClick={() => handleTrim()}
      >
        Trim
      </Button>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginLeft: "85%",
        }}
      >
        <Button
          onClick={() => {
            setSliderWidth(sliderWidth + 200);
          }}
          variant="contained"
          component="label"
          color="primary"
          style={{ marginLeft: "10px", height: "30px" }}
        >
          +
        </Button>
        <Button
          onClick={() => {
            setSliderWidth(sliderWidth - 200);
          }}
          variant="contained"
          component="label"
          color="primary"
          style={{ marginLeft: "10px", height: "30px" }}
        >
          -
        </Button>
      </div>
      <div
        className="sliderclass"
        style={{
          display: "flex",
          justifyContent: "left",
          marginTop: "40px",
          maxWidth: 1500,
          overflow: "auto",
          paddingTop: "60px",
        }}
      >
        <Box style={{ width: sliderWidth }}>
          <Slider
            onChange={(e) => {
              onSeekbarChange(e.target.value);
              setSliderValue(e.target.value);
            }}
            aria-label="Default"
            style={{ fontSize: 50 }}
            slots={{
              thumb: {
                height: 20,
                backgroundImage: `url("https://picsum.photos/40/40")`,
                width: 20,
                backgroundColor: "#fff",
                marginTop: -20,
                marginLeft: -20,
              },
            }}
            value={sliderValue}
            valueLabelDisplay="auto"
            getAriaValueText={convertHMS}
            valueLabelFormat={convertHMS}
            marks={marks}
            min={0}
            max={player.duration}
          />
          <div
            ref={segRef}
            style={{
              width: sliderWidth,
              height: "50px",
              display: "flex",
              backgroundColor: "#FF8232",
              marginTop: "-38px",
              marginBottom: "100px",
            }}
          >
            {segments.map((val, key, arr) => {
              return (
                <>
                  <div
                    ref={myref}
                    draggable={true}
                    onDrag={(e) => dragFunction(e, key)}
                    onDragEnd={(e) => dragEndFunction(e, key)}
                    onClick={() => {
                      _base64ToArrayBuffer(jsonArray[0]?.base64);
                    }}
                    style={{
                      cursor: "pointer",
                      width: val.width + "%",
                      backgroundColor: val.color,
                      height: "50px",
                      marginLeft:
                        key > 0
                          ? val.widthFrom - arr[key - 1].widthTo + "%"
                          : (val.from / player.duration) * 100 + "%",
                    }}
                  ></div>
                </>
              );
            })}
          </div>
        </Box>
      </div>
    </div>
  );
}
export default TimeSlider;

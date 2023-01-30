import React, { useState, useContext, useRef } from "react";
import { Progress } from "antd";
import { red, green } from "@ant-design/colors";
import vmsg from "vmsg";
import { Scrubber, ScrubberProps } from "react-scrubber";
import Button from "@mui/material/Button";
import "react-voice-recorder/dist/index.css";
import "react-scrubber/lib/scrubber.css";
import "./AudioPlayer.css";
import { useEffect } from "react";
import TimeSlider from "./TimeSlider";
import Buffer from "Buffer";
import { mainContext } from "../App";
const recorder = new vmsg.Recorder({
  wasmURL: "https://unpkg.com/vmsg@0.3.0/vmsg.wasm",
});
const AudioPlayer = (props) => {
  const {
    muteVideo,
    getCurrentTime,
    voiceList,
    videoCurrentTime,
    videoMuteState,
    videoPause,
    videoPlay,
    player,
    getJsonData,
    ...rest
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState("");
  const [recordingEndTime, setRecordingEndTime] = useState("");
  const [receivedVoices, setReceivedVoices] = useState([]);
  const [currentVoiceToPlay, setCurrentVoiceToPlay] = useState({});

  const bufferRef = useRef(null);
  const {
    recordingData,
    setRecordingData,
    jsonData,
    setJsonData,
    recordings,
    setRecordings,
  } = useContext(mainContext);
  //////////////////////////
  const [selectedInterval, setSelectedInterval] = useState([
    { start: 0, end: 100 },
  ]);
  function random(number) {
    return Math.floor(Math.random() * number);
  }

  const [scrubberValue, setScrubberValue] = useState(50);
  const handleScrubStart = () => {};
  const handleScrubEnd = () => {};
  const handleScrubChange = (value) => {
    setScrubberValue(value);
  };
  useEffect(() => {
    setReceivedVoices([...props.voiceList]);
    setRecordingData([...props.voiceList]);
  }, [props.voiceList]);
  const data =
    "blob:http://localhost:3000/134f0add-62c0-44da-b314-c23d52658683";
  const record = async () => {
    setIsLoading(true);
    if (isRecording) {
      let endTime = props.getCurrentTime();
      setRecordingEndTime(endTime);
      const blob = await recorder.stopRecording();
      setIsLoading(false);
      setIsRecording(false);
      blob.arrayBuffer().then(async (arrayBuffer) => {
        const buffer = Buffer(arrayBuffer);
        bufferRef.current = buffer;
        // await removeLast_N_SecondsFromAudio(5, buffer);
        await removeFirst_N_SecondsFromAudio(5, buffer);
      });
      const base64 = await blobToBase64(blob);

      setRecordingData([
        ...recordingData,
        {
          sourceAudio: base64,
          color:
            "rgb(" + random(255) + "," + random(255) + "," + random(255) + ")",
          width:
            (endTime / player.duration) * 100 -
            (recordingStartTime / player.duration) * 100,
          widthFrom: (recordingStartTime / player.duration) * 100,
          widthTo: (endTime / player.duration) * 100,
          durtion: player.duration,
          from: recordingStartTime,
          to: endTime,
          recordingDuration: endTime - recordingStartTime,
          audioNumber: jsonData.length + 1,
          buffer: bufferRef.current,
          url: base64,
          base64,
          startTime: recordingStartTime,
          endTime: endTime,
        },
      ]);

      setRecordingStartTime("");
      setRecordingEndTime("");
      getJsonData([
        ...jsonData,
        {
          audioNumber: jsonData.length + 1,
          startTime: recordingStartTime,
          endTime: endTime,
          base64,
          buffer: bufferRef.current,
        },
      ]);
    } else {
      try {
        setRecordingStartTime(props.getCurrentTime());
        await recorder.initAudio();
        await recorder.initWorker();
        recorder.startRecording();
        setIsLoading(false);
        setIsRecording(true);
      } catch (e) {
        setIsLoading(false);
      }
    }
  };
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
    return updated;
  }
  async function removeLast_N_SecondsFromAudio(seconds, arrayBuffer) {
    const originalArrayBuffer = arrayBuffer; // your original ArrayBuffer
    const secondsToRemove = seconds; // number of seconds to remove
    const bytesPerSecond = 4410 * 2; // sample rate * channels * bytes per sample
    const bytesToRemove = seconds * bytesPerSecond;
    const totalBytes = originalArrayBuffer.byteLength;
    const newArrayBuffer = await originalArrayBuffer.slice(
      0,
      totalBytes - bytesToRemove
    );
    const newBlob = new Blob([newArrayBuffer], { type: "audio/mpeg" });
    const lastRemoved = await blobToBase64(newBlob);
    return lastRemoved;
  }
  async function divideAudio(breakPoint, totalSeconds, arrayBuffer) {
    const removeSeconds = totalSeconds - breakPoint;
    const firstPart = await removeLast_N_SecondsFromAudio(
      removeSeconds,
      arrayBuffer
    );
    const secondPart = await removeFirst_N_SecondsFromAudio(
      breakPoint,
      arrayBuffer
    );
    return {
      firstPart,
      secondPart,
    };
  }
  const downloadJsonFile = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(recordingData)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";
    link.click();
  };
  const muteCurrentVideo = () => {
    props.muteVideo(true);
  };
  ////

  useEffect(() => {
    muteCurrentVideo();
    for (let i = 0; i < props.voiceList.length; i++) {
      if (
        props.videoCurrentTime >= props.voiceList[i].startTime &&
        props.videoCurrentTime <= props.voiceList[i].endTime
      ) {
        if (currentVoiceToPlay.audioNumber !== props.voiceList[i].audioNumber) {
          setCurrentVoiceToPlay({ ...props.voiceList[i] });
        }
      }
    }
  }, [props.videoCurrentTime]);
  const onChangeCallback = (selectedInterval) => {};
  return (
    <div>
      <div style={{ marginTop: "50px" }}>
        <React.Fragment>
          <Button
            variant="contained"
            component="label"
            color="primary"
            style={{ marginLeft: "10px", marginBottom: "10px" }}
            onClick={muteCurrentVideo}
          >
            Mute Video
          </Button>
          <Button
            variant="contained"
            component="label"
            color="primary"
            style={{ marginLeft: "10px", marginBottom: "10px" }}
            disabled={isLoading}
            onClick={record}
          >
            {isRecording ? "Stop" : "Record"}
          </Button>
        </React.Fragment>
        <Button
          variant="contained"
          component="label"
          color="primary"
          style={{ marginLeft: "10px", marginBottom: "10px" }}
          onClick={downloadJsonFile}
        >
          DownLoad Json
        </Button>
      </div>
    </div>
  );
};
export default AudioPlayer;

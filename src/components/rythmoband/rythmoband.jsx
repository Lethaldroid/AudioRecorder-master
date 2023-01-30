import "../../../node_modules/video-react/dist/video-react.css";
import React, { useState, useEffect, useRef } from "react";

import { Button } from "@mui/material";
import { getSub_Millis } from "../../services/srtreader.js";

import { TextField } from "@mui/material";
import { NewSRTDownload } from "../../services/srtHandler.js";

import styles from "./rythmoband.module.css";
import FloatingWords from "./FloatingWords/FloatingWords";

import { convertToSecInt } from "../../services/timeFunctions";
import { display } from "@mui/system";

export default function Rythmoband(props) {
  const [delay, setdelay] = useState("-0.2");
  const [dialogue, setDialogue] = useState(props.dialogue);

  const initialPosition = useRef(
    props.rythmoPosition === undefined ? "90%" : props.rythmoPosition
  );

  const [number, setnumber] = useState(
    props.dialogueNumber === undefined ? 0 : props.dialogueNumber
  );
  const [moverNumber, setMoverNumber] = useState(40);
  const [zoomPercent, setzoomPercent] = useState(
    ((window.outerWidth - 10) / window.innerWidth) * 100
  );

  const textMover = () => {
    let x = parseFloat(initialPosition.current);
    if (props.time[number]) {
      let start = getSub_Millis(props.time[number][0]);
      let end = getSub_Millis(props.time[number][1]);
      let timeToMove = start - end;
      setMoverNumber((timeToMove / 5000) * props.player.playbackRate);
    }
  };
  requestAnimationFrame(() => {
    textMover();
    timercheck();
    backChecker();
  });
  const timercheck = () => {
    if (props.time[number]) {
      if (
        getSub_Millis(props.time[number][1]) - props.player.currentTime * 1000 <
        1750
      ) {
        initialPosition.current = "90%";
        setnumber(number + 1);
      }
    }
  };
  const backChecker = () => {
    for (let index = 0; index < props.time.length; index++) {
      if (
        getSub_Millis(props.time[index][1]) >
          props.player.currentTime * 1000 + 1750 &&
        getSub_Millis(props.time[index][0]) <
          props.player.currentTime * 1000 - 1750
      ) {
        setnumber(index);
      }
    }
  };

  const [timeInSeconds, setTimeInSeconds] = useState();

  useEffect(() => {
    const timeInSecondsVar = [];
    for (let i = 0; i < props.time.length; i++) {
      timeInSecondsVar[i] = [
        convertToSecInt(props.time[i][0]),
        convertToSecInt(props.time[i][1]),
      ];
    }
    setTimeInSeconds(timeInSecondsVar);
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginLeft: "85%",
        }}
      >
        <Button
          onClick={() => {
            document.getElementsByClassName(
              "rythmoband_mainContainer__4zQ+K"
            )[0].style.zoom = `${zoomPercent + 50}%`;
            setzoomPercent(zoomPercent + 50);
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
            document.getElementsByClassName(
              "rythmoband_mainContainer__4zQ+K"
            )[0].style.zoom = `${zoomPercent - 50}%`;
            setzoomPercent(zoomPercent - 50);
          }}
          variant="contained"
          component="label"
          color="primary"
          style={{ marginLeft: "10px", height: "30px" }}
        >
          -
        </Button>
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.redLine} />

        {timeInSeconds && (
          <span>
            <FloatingWords
              delay={delay}
              dialogue={dialogue}
              player={props.player}
              time={timeInSeconds}
            />
          </span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <TextField
          style={{ marginTop: "20px", marginRight: "20px" }}
          label="Set your delay"
          id="outlined-start-adornment"
          onChange={(e) => {
            setdelay(e.target.value);
          }}
        />
        <TextField
          style={{ marginTop: "20px" }}
          label="Edit your dialogue"
          id="outlined-start-adornment"
          defaultValue="edit your values here"
          onChange={(e) => {
            let dialogueClone = [...dialogue];
            dialogueClone[number] = e.target.value;
            setDialogue(dialogueClone);
          }}
        />
        <Button
          onClick={() => {
            NewSRTDownload(dialogue, props.time);
          }}
          variant="contained"
          component="label"
          color="primary"
          style={{ marginLeft: "10px", height: "30px", marginTop: "30px" }}
        >
          save SRT
        </Button>
      </div>

      <pre id="output"></pre>
      <div id="container1"></div>
    </>
  );
}

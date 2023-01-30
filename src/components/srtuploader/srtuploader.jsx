import "../../../node_modules/video-react/dist/video-react.css";
import * as React from "react";
import { alpha, styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

import TextField, { TextFieldProps } from "@mui/material/TextField";

import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import logo from "../../images/logo.png";
import { useState, createContext, useContext } from "react";
import { DialoguesContext } from "../../App";

import { Link } from "react-router-dom";
import { loadFile } from "../../services/srtreader";
import { loadJson } from "../../services/srtreader";

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "green",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "green",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "red",
    },
    "&:hover fieldset": {
      borderColor: "yellow",
    },
    "&.Mui-focused fieldset": {
      borderColor: "green",
    },
  },
});
const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.mode === "light" ? "#fcfcfb" : "#2b2b2b",
    border: "1px solid #ced4da",
    fontSize: 16,
    width: "auto",
    padding: "10px 12px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

export default function SrtUploader() {
  const [value, setValue] = React.useState(0);
  const [url, seturl] = useState("");
  const [videoFilePath, setVideoFilePath] = useState(null);
  const [srtFilePath, setsrtFilePath] = useState(null);
  const [jsonFilePath, setjsonFilePath] = useState(null);
  const [videoFilePathUploaded, setVideoFilePathUploaded] = useState(false);
  const [srtFilePathUploaded, setsrtFilePathUploaded] = useState(false);
  const [jsonFilePathUploaded, setjsonFilePathUploaded] = useState(false);
  const {
    Dialogues,
    setDialogues,
    Time,
    setTime,
    source,
    setsource,
    currentTime,
    setCurrentTime,
    dialogueNumber,
    setDialogueNumber,
    rythmoPosition,
    setrythmoPosition,
    projectName,
    setprojectName,
    voiceList,
    setVoiceList,
  } = useContext(DialoguesContext);

  const handleVideoUpload = (event) => {
    setprojectName(event.target.files[0].name);
    setsource(URL.createObjectURL(event.target.files[0]));
    setVideoFilePathUploaded(true);
  };
  const handlesrtUpload = async (event) => {
    let { time, dialogue } = await loadFile(event.target.files[0]);
    setDialogues(dialogue);
    setTime(time);
    setsrtFilePathUploaded(true);
  };
  const handlejsonUpload = async (event) => {
    let { currentTime, dial_number, rythmo_position } = await loadJson(
      event.target.files[0]
    );

    setCurrentTime(currentTime);
    setDialogueNumber(dial_number);
    setrythmoPosition(rythmo_position);
    setjsonFilePathUploaded(true);
  };
  function onChange(event) {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
  }

  function onReaderLoad(event) {
    var obj = JSON.parse(event.target.result);
    setVoiceList([...obj]);
  }
  return (
    <>
      <div
        style={{
          marginTop: "150px",
          display: "flex",
          flexDirection: "column",
          "justify-content": "center",
          "align-items": "center",
        }}
      >
        <img
          src={logo}
          alt="this is logo"
          style={{ height: "200px", width: "800px" }}
        />
        <Button
          variant="contained"
          component="label"
          color="primary"
          style={{ marginTop: "30px" }}
        >
          {" "}
          {videoFilePathUploaded ? "" : <AddIcon />}
          {videoFilePathUploaded ? "Uploaded" : "Upload Video"}
          <input type="file" onChange={handleVideoUpload} hidden />
        </Button>
        <Button
          variant="contained"
          component="label"
          color="primary"
          style={{ marginTop: "30px" }}
        >
          {" "}
          {srtFilePathUploaded ? "" : <AddIcon />}
          {srtFilePathUploaded ? "Uploaded" : "Upload srt"}
          <input type="file" onChange={handlesrtUpload} hidden />
        </Button>
        <Button
          variant="contained"
          component="label"
          color="primary"
          style={{ marginTop: "30px" }}
        >
          {" "}
          {jsonFilePathUploaded ? "" : <AddIcon />}
          {jsonFilePathUploaded ? "Uploaded" : "Upload json"}
          <input type="file" onChange={onChange} hidden />
        </Button>
        <p>Upload JSON only if previously saved otherwise leave empty</p>

        <Link to="/project" style={{ "text-decoration": "none" }}>
          <Button variant="outlined" style={{ marginTop: "20px" }}>
            Submit
          </Button>
        </Link>
      </div>
    </>
  );
}
